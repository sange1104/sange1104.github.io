import fs from "fs";
import path from "path";
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { v2 as cloudinary } from 'cloudinary'; // 1. Cloudinary 추가

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
fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

// 2. Cloudinary 업로드 함수 정의
async function uploadToCloudinary(imageUrl, fileName) {
  if (!imageUrl || imageUrl.trim() === "") return null;
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: "notion_blog",
      public_id: fileName,
      overwrite: true
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Cloudinary Upload Failed for ${fileName}:`, error);
    return null; // 실패 시 에러 방지를 위해 null 반환
  }
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

// 이미지 주소를 가져오는 헬퍼 함수 추가 (노션 이미지 필드명에 맞춰 수정 필요)
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

async function main() {
  let cursor = undefined;
  let count = 0;

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

      const slug = sanitizeSlug(slugRaw);
      const ymd = toYMD(publishedAt);
      const tags = getMultiSelect(props, "Tags");
      const categories = getMultiSelect(props, "Categories");

      // 3. 이미지 처리 (노션의 'Image' 속성에서 가져온다고 가정)
      const rawImageUrl = getImageUrl(props, "Image");
      const permanentUrl = await uploadToCloudinary(rawImageUrl, `${ymd}-${slug}`);

      const mdBlocks = await n2m.pageToMarkdown(page.id);
      const mdString = n2m.toMarkdownString(mdBlocks).parent ?? "";

      // 4. Front Matter 구성 (image가 있을 때만 포함)
      let frontmatter = `---
title: "${fmEscape(title)}"
date: ${ymd}
${categories.length > 0 ? `categories: [${categories.join(", ")}]\n` : ""}${tags.length > 0 ? `tags: [${tags.join(", ")}]\n` : ""}`;
      
      // 이미지가 성공적으로 업로드되었을 때만 추가
      if (permanentUrl) {
        frontmatter += `image: ${permanentUrl}\n`;
      }
      
      frontmatter += `---`;

      const filename = `${ymd}-${slug}.md`;
      const outPath = path.join(OUT_DIR, filename);

      fs.writeFileSync(outPath, frontmatter + "\n\n" + mdString, "utf8");
      count += 1;
      console.log(`Wrote: ${outPath}`);
    }

    if (!resp.has_more) break;
    cursor = resp.next_cursor;
  }

  console.log(`Done. Exported ${count} posts to ${OUT_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
