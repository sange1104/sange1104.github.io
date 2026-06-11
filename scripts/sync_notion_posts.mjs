import fs from "fs";
import path from "path";
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { v2 as cloudinary } from 'cloudinary';

const NOTION_TOKEN = process.env.NOTION_AUTH_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

// Cloudinary 설정
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

if (!NOTION_TOKEN || !DATABASE_ID) {
  console.error("Missing NOTION_AUTH_TOKEN or NOTION_DATABASE_ID");
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

const OUT_DIR = path.join(process.cwd(), "_posts", "notion");
// 증분 동기화 상태 파일 (pageId -> { lastEdited, filename }). Jekyll은 점(.) 파일을 무시함.
const STATE_FILE = path.join(OUT_DIR, ".sync-state.json");

fs.mkdirSync(OUT_DIR, { recursive: true });

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    return {};
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + "\n", "utf8");
}

// Cloudinary 업로드 (원격 URL -> 영구 URL). public_id가 같으면 덮어씀.
async function uploadToCloudinary(imageUrl, publicId) {
  if (!imageUrl || imageUrl.trim() === "") return null;
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: "notion_blog",
      public_id: publicId,
      overwrite: true
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Cloudinary upload failed for ${publicId}:`, error?.message || error);
    return null;
  }
}

// 만료되는 Notion 서명 URL인지 판별 (본문 이미지가 이런 형태)
function isExpiringNotionUrl(url) {
  return /prod-files-secure\.s3|amazonaws\.com|secure\.notion-static\.com|notion\.so\//.test(url);
}

// 본문 마크다운의 Notion 임시 이미지들을 Cloudinary로 올리고 URL을 영구 주소로 치환
async function persistBodyImages(md, baseId) {
  const re = /!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
  const matches = [...md.matchAll(re)];
  let out = md;
  let idx = 0;
  for (const m of matches) {
    const [full, alt, url] = m;
    if (!isExpiringNotionUrl(url)) continue; // 외부 영구 URL(github, arxiv 등)은 그대로 둠
    idx += 1;
    const permanent = await uploadToCloudinary(url, `${baseId}-img${idx}`);
    if (permanent) out = out.split(full).join(`![${alt}](${permanent})`);
  }
  return out;
}

function getProp(props, name) {
  return props?.[name];
}

function getTitle(props) {
  const p = getProp(props, "Title");
  const t = p?.title?.map(x => x.plain_text).join("")?.trim();
  return t || "Untitled";
}

function getSlug(props) {
  const p = getProp(props, "Slug");
  const s = p?.rich_text?.map(x => x.plain_text).join("")?.trim();
  return s || null;
}

function getDate(props) {
  const p = getProp(props, "PublishedAt");
  const d = p?.date?.start?.trim();
  return d || null;
}

function getImageUrl(props, name) {
  const p = getProp(props, name);
  if (p?.type === 'files') {
    return p.files[0]?.file?.url || p.files[0]?.external?.url || null;
  }
  return null;
}

function toYMD(dateStr) {
  return dateStr.slice(0, 10);
}

function sanitizeSlug(slug) {
  return slug
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function fmEscape(s) {
  return s.replace(/"/g, '\\"');
}

function getMultiSelect(props, name) {
  const p = props?.[name];
  if (!p || p.type !== "multi_select") return [];
  return p.multi_select.map(x => x.name);
}

// 단일 값 속성 (select / status / 또는 multi_select의 첫 값)
function getSelect(props, name) {
  const p = props?.[name];
  if (!p) return null;
  if (p.type === "select") return p.select?.name?.trim() || null;
  if (p.type === "status") return p.status?.name?.trim() || null;
  if (p.type === "multi_select") return p.multi_select?.[0]?.name?.trim() || null;
  return null;
}

// 분류 규칙: 전용 속성(Category/Field, Length)이 있으면 우선, 없으면 기존 Categories/Tags로 폴백
function resolveCategories(props) {
  const top = getSelect(props, "Category");
  const field = getSelect(props, "Field");
  if (top || field) return [top, field].filter(Boolean);
  return getMultiSelect(props, "Categories");
}

function resolveTags(props) {
  let tags = getMultiSelect(props, "Tags");
  const length = getSelect(props, "Length"); // "short" | "long"
  if (length) {
    const v = length.toLowerCase();
    tags = tags.filter(t => t.toLowerCase() !== "short" && t.toLowerCase() !== "long");
    tags = [v, ...tags];
  }
  return tags;
}

async function main() {
  const prevState = loadState();
  const nextState = {};
  const validFilenames = new Set([path.basename(STATE_FILE)]);

  let cursor = undefined;
  let pageCount = 0;
  let written = 0;
  let skipped = 0;

  while (true) {
    const resp = await notion.databases.query({
      database_id: DATABASE_ID,
      start_cursor: cursor,
      page_size: 100,
      sorts: [{ property: "PublishedAt", direction: "descending" }],
    });

    for (const page of resp.results) {
      const props = page.properties;
      const title = getTitle(props);
      const slugRaw = getSlug(props);
      const publishedAt = getDate(props);

      if (!slugRaw || !publishedAt) {
        console.warn(`Skip (missing Slug or PublishedAt): ${title}`);
        continue;
      }

      pageCount += 1;

      const slug = sanitizeSlug(slugRaw);
      const ymd = toYMD(publishedAt);
      const filename = `${ymd}-${slug}.md`;
      const outPath = path.join(OUT_DIR, filename);
      const lastEdited = page.last_edited_time;
      validFilenames.add(filename);

      // 증분: 마지막 수정 시각이 같고 파일이 그대로 있으면 건너뜀
      const prev = prevState[page.id];
      if (prev && prev.lastEdited === lastEdited && prev.filename === filename && fs.existsSync(outPath)) {
        nextState[page.id] = { lastEdited, filename };
        skipped += 1;
        continue;
      }

      const tags = resolveTags(props);
      const categories = resolveCategories(props);

      // 본문 변환 + 본문 이미지 영구화
      const mdBlocks = await n2m.pageToMarkdown(page.id);
      const rawMd = n2m.toMarkdownString(mdBlocks).parent ?? "";
      const mdString = await persistBodyImages(rawMd, `${ymd}-${slug}`);

      // 커버 이미지(선택)
      const coverUrl = await uploadToCloudinary(getImageUrl(props, "Image"), `${ymd}-${slug}-cover`);

      let frontmatter = `---
title: "${fmEscape(title)}"
date: ${ymd}
${categories.length > 0 ? `categories: [${categories.join(", ")}]\n` : ""}${tags.length > 0 ? `tags: [${tags.join(", ")}]\n` : ""}`;
      if (coverUrl) {
        frontmatter += `image: ${coverUrl}\n`;
      }
      frontmatter += `---`;

      fs.writeFileSync(outPath, frontmatter + "\n\n" + mdString, "utf8");
      nextState[page.id] = { lastEdited, filename };
      written += 1;
      console.log(`Wrote: ${outPath}`);
    }

    if (!resp.has_more) break;
    cursor = resp.next_cursor;
  }

  // 안전장치: 한 건도 못 가져오면(설정/토큰 문제 가능) 삭제 정리는 건너뜀
  if (pageCount === 0) {
    console.warn("No published pages fetched — skipping deletion sweep to avoid wiping posts.");
    return;
  }

  // 노션에서 사라진 글의 파일 정리
  let removed = 0;
  for (const f of fs.readdirSync(OUT_DIR)) {
    if (!f.endsWith(".md")) continue;
    if (!validFilenames.has(f)) {
      fs.rmSync(path.join(OUT_DIR, f));
      removed += 1;
      console.log(`Removed (no longer in Notion): ${f}`);
    }
  }

  saveState(nextState);
  console.log(`Done. ${written} written, ${skipped} unchanged, ${removed} removed (${pageCount} pages).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
