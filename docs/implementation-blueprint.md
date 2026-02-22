# Tech Mage Implementation Blueprint

## 1) Recommended Stack

- Framework: Astro
- Package manager: pnpm
- Content: Astro Content Collections + Markdown/MDX
- Markdown pipeline: remark/rehype
- Syntax highlighting: Shiki
- Math: remark-math + rehype-katex
- Client search: Lunr.js (lazy load on `/search` only)
- Nav autocomplete: lightweight client substring match over prebuilt keyword index
- Deploy: GitHub Actions to GitHub Pages

## 2) Content Types

First-order content types:

- `authors`: reusable author entities (slug, name, description, image, socials)
- `categories`: reusable category entities (slug, name, description, image, seo)
- `posts`: long-form article content
- `notes`: thought/short-form content

## 3) Publishing Rules

A document is considered published only when:

- `publishedAt` is present, and
- `publishedAt <= now` (UTC)

If `publishedAt` is empty or in the future, it is unpublished.

Date parsing rule:

- If a date string has no timezone offset, interpret it in `site.defaultTimeZone` (`America/New_York`).

## 4) Frontmatter Rules (Posts/Notes)

Common fields:

- `title` (required for posts, optional for notes)
- `slug` (optional override)
- `publishedAt` (optional; controls publish status)
- `updatedAt` (optional)
- `author` (optional slug ref; defaults to `site.defaultAuthorSlug`)
- `category` (optional slug ref)
- `tags` (optional string array)
- `image` (optional)
- `description` (optional)

Derived behavior:

- If `slug` missing: derive from markdown filename base.
- If `category` missing: infer from path namespace segment.
- If `category` present: it overrides path-inferred namespace/category.
- URL always includes slug.
- `updatedAt` should be used as the primary \"last modified\" signal (fallback to `publishedAt`).

## 5) URL and Namespace Strategy

Canonical URL pattern:

- Posts: `/blog/{namespace}/{slug}/`
- Notes: `/notes/{namespace}/{slug}/`

Namespace resolution:

1. If frontmatter `category` exists: namespace = category slug
2. Else if path namespace exists: namespace = that path segment
3. Else if publishedAt exists: namespace = `YYYY/MM`
4. Else fallback namespace = `unpublished`

## 6) Content Folder Templates

```text
content/
  authors/
    judah-t-anthony.md
  categories/
    engineering.md
    writing.md
  posts/
    engineering/
      example-post.md
    2026/02/
      namespace-from-date.md
  notes/
    stream/
      first-note.md
drafts/
  posts/
    engineering/
      wip-idea.md
  notes/
    stream/
      wip-note.md
```

Notes:

- `drafts/**` is for work in progress and should render only when `SITE_INCLUDE_DRAFTS=true`.
- Production renders/indexes published content from `content/posts/**` and `content/notes/**`.

## 7) Site-Wide Config

`src/site.config.ts` provides:

- `siteName`
- `siteUrl` (production origin)
- `basePath` (repo/site base path)
- `defaultTimeZone`
- `defaultAuthorSlug`
- `defaultSocialImage`
- Cloudflare image resize settings
- social profile URLs
- metadata defaults

SEO defaults:

- Social title default: `<post title> | Tech Mage`
- Social description default: excerpt from rendered/plain content (first 150-180 chars)
- Canonical URLs are always derived from `siteUrl + basePath + permalink` unless explicitly overridden.

## 8) Hero Image + Meta Image Behavior

When `image` is present:

- Post page renders it as a full-bleed top hero.
- OG/Twitter metadata should use Cloudflare image resizing when enabled.

When `image` is missing:

- Use `site.defaultSocialImage` for metadata.

## 9) Search Architecture

### 9.1 Nav Autocomplete

- Input in persistent nav does simple substring matching (case-insensitive).
- Search fields: title, category label/slug, tags.
- Uses tiny prebuilt keyword index JSON loaded at startup or on first input.
- Returns quick suggestions and direct links.

### 9.2 Full Search (`/search`)

- On submit from nav, route to `/search?q=<query>`.
- `/search` lazily imports Lunr only when query is present or user types.
- Full index includes body content + frontmatter fields.

## 10) Route Generation Logic

Static routes to generate:

- Post detail pages
- Note detail pages
- Category pages
- Tag pages
- Author pages

Route metadata helpers should produce:

- canonical URL
- publish status filtering
- taxonomy relationships (posts by category/tag/author)

## 11) Build and Deploy

Build pipeline:

1. Install deps
2. Run content validation
3. Build keyword + lunr index artifacts
4. Build static redirect pages from `src/site.redirects.ts`
5. Astro build (`dist`)
6. Upload pages artifact
7. Deploy to GitHub Pages

See `.github/workflows/deploy.yml`.

## 12) Medium Starter Content

Seed stubs from your Medium profile are provided in `content/posts/imported-medium/`.

Purpose:

- preserve titles/slugs as migration checkpoints
- add canonical/source references for each migrated post
- progressively copy/edit full content into your own markdown

## 13) Redirect Strategy (GitHub Pages Compatible)

Because GitHub Pages does not support server-side redirect rules, redirects are implemented as generated static pages:

- Define old->new mappings in `content/redirects.json`
- Run `pnpm run redirects:generate`
- The generator emits `public/<old-path>/index.html` pages that immediately redirect (meta refresh + JS)
