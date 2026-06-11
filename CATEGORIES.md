# Post Taxonomy

How posts are classified on this blog. Every post's front matter uses
`categories: [<top>, <field>]` and `tags: [...]`.

Most posts are synced from Notion by `scripts/sync_notion_posts.mjs`. The 6 hand-written
posts in `_posts/*.md` follow the same rules.

### Setting the taxonomy in Notion

The sync script reads two ways — use whichever is convenient (dedicated properties win
if present):

1. **Dedicated properties (recommended).** Add these Notion properties:
   - `Category` (select) → top-level → `categories[0]`
   - `Field` (select) → field/area → `categories[1]`
   - `Length` (select: `short` / `long`) → added as the first tag
2. **Legacy fallback.** If `Category`/`Field` are absent, the script uses the
   `Categories` multi-select verbatim (put both top + field, e.g.
   `paper-review, vision-language`). `Length` likewise falls back to a `short`/`long`
   value in the `Tags` multi-select.

`Tags` (multi-select) is always merged in for any extra free-form tags.

## Top-level categories (`categories[0]`)

| Slug             | Meaning                                  |
| ---------------- | ---------------------------------------- |
| `paper-review`   | Paper reviews / reading notes            |
| `lecture-review` | Lecture notes                            |
| `concept-note`   | 개념 정리 — foundational concept explainers |
| `research-note`  | Research notes — ideas, experiments, logs |

## Field (`categories[1]`) — used mainly under `paper-review`

The second category is the field/area. Current values under `paper-review`:

- `vision-language`
- `emotion-mllm`
- `3d-generation`
- `spatial-reasoning`

Add new fields freely; the Posts page builds its 2nd-level "Field" filter
automatically from whatever fields appear. `lecture-review` uses this slot for the
course (e.g. `UOS 2025 Spring`).

## Tags

Free-form, plus one required **length tag on every `paper-review`**:

- `short` — concise summary version
- `long` — full detailed review

The Posts page shows a colored badge (green = short, blue = long) from this tag, and
Chirpy lists all tags on the post page. One paper can have both a short and a long
post — author two posts and tag each accordingly.

## Where this is consumed

- `_tabs/posts.md` — the **Posts** page. Top-category filter chips + a 2nd-level
  "Field" filter that appears when a top category with fields is selected, plus the
  short/long badge and post counts. All driven dynamically from front matter; no code
  changes needed when you add a new category, field, or tag.

## Sync behavior (`scripts/sync_notion_posts.mjs`)

- **Incremental.** State is tracked in `_posts/notion/.sync-state.json`
  (pageId → last-edited time + filename). Only pages edited in Notion since the last
  run are re-fetched and rewritten; unchanged pages are skipped. Pages removed from
  Notion get their files deleted. If the query returns 0 pages, the deletion sweep is
  skipped (safety against token/config errors wiping everything).
- **Permanent images.** Notion's body image URLs are signed and expire (~1 h), so the
  script uploads every body image to Cloudinary and rewrites the markdown to the
  permanent URL. This is what makes incremental sync safe — skipped posts keep working
  images instead of pointing at expired Notion links.
- Runs daily via `.github/workflows/sync-notion-posts.yml` (or manual dispatch).
