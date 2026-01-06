import fs from "fs";
import path from "path";
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

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

      const mdBlocks = await n2m.pageToMarkdown(page.id);
      const mdString = n2m.toMarkdownString(mdBlocks).parent ?? "";

      const frontmatter =
`---
title: "${fmEscape(title)}"
date: ${ymd}
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
