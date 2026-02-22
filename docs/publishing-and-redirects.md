# Publishing, Canonical URLs, Redirects, and `updatedAt`

## Canonical URLs

- Primary canonical URL is always generated from:
  - `siteConfig.siteUrl` (origin)
  - `siteConfig.basePath` (base path)
  - resolved permalink (`/blog/...` or `/notes/...`)
- Optional frontmatter `canonical` can override this when needed.

## Cloudflare OG Image Resizing

- When `CLOUDFLARE_IMAGE_RESIZE_ENABLED=true`, social images are emitted as Cloudflare resized URLs under `/cdn-cgi/image/...`.
- Keep this disabled in local development.

## Publish Semantics

- Published only when `publishedAt` exists and is in the past.
- If no timezone offset is provided in date strings, parse using `siteConfig.defaultTimeZone`.

## `updatedAt` Convention

- `updatedAt` should be set only for substantive content updates.
- Use `updatedAt` for:
  - sitemap `lastmod`
  - article metadata display ("Updated on ...")
  - cache invalidation heuristics if needed
- Fallback when `updatedAt` is absent: use `publishedAt`.

## Redirects on GitHub Pages

- Server-side redirects are not available.
- Keep redirect map in `content/redirects.json`:

```json
[
  {
    "from": "/blog/engineering/old-slug/",
    "to": "/blog/engineering/new-slug/",
    "permanent": true
  }
]
```

- Run `pnpm run redirects:generate`.
- This emits static redirect pages under `public/<from>/index.html` that redirect immediately to `to`.
