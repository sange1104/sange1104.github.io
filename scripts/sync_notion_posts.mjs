import fs from "fs";
import path from "path";
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary 설정
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 이미지를 업로드하고 영구 URL을 반환하는 함수
async function uploadToCloudinary(imageUrl, fileName) {
  try {
    // 노션 S3 링크를 Cloudinary로 직접 전달하여 업로드
    const result = await cloudinary.uploader.upload(imageUrl, {
      public_id: `notion_blog/${fileName}`, // 폴더 구조 지정 가능
      overwrite: true
    });
    return result.secure_url; // 영구적인 https 주소 반환
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    return imageUrl; // 실패 시 원본 링크 유지
  }
}

const NOTION_TOKEN = process.env.NOTION_AUTH_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_TOKEN || !DATABASE_ID) {
  console.error("Missing NOTION_AUTH_TOKEN or NOTION_DATABASE_ID");
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

const OUT_DIR = path.join(process.cwd(), "_posts", "notion");
fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

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

function getCheckbox(props, name) {
  const p = getProp(props, name);
  return !!p?.checkbox;
}

// YYYY-MM-DD
function toYMD(dateStr) {
  // dateStr can be YYYY-MM-DD or ISO; take first 10 chars
  return dateStr.slice(0, 10);
}

function sanitizeSlug(slug) {
  // lower, replace spaces with -, keep a-z0-9-
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
      // ✅ 여기서 "내보낼 글만" 필터링 가능
      // RequestPublishing 체크박스가 true인 것만
      // filter: {
      //   property: "RequestPublishing",
      //   checkbox: { equals: true },
      // },
      // 최신 발행일 순 정렬 (선택)
      sorts: [
        { property: "PublishedAt", direction: "descending" }
      ],
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


      const mdBlocks = await n2m.pageToMarkdown(page.id);
      const mdString = n2m.toMarkdownString(mdBlocks).parent ?? "";

      const frontmatter =
`---
title: "${fmEscape(title)}"
date: ${ymd}
${categories.length > 0 ? `categories: [${categories.join(", ")}]\n` : ""}${tags.length > 0 ? `tags: [${tags.join(", ")}]` : ""}
---
`;


      const filename = `${ymd}-${slug}.md`;
      const outPath = path.join(OUT_DIR, filename);

      fs.writeFileSync(outPath, frontmatter + "\n" + mdString, "utf8");
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
