# Tech Mage Blueprint

This repository contains the concrete implementation blueprint for a GitHub Pages-hosted Astro site with:

- Blog posts and thoughts in Markdown
- Category and tag taxonomy
- Full-text search with lazy-loaded Lunr
- Lightweight nav autocomplete (substring match)
- Math (KaTeX), syntax highlighting (Shiki), and SEO defaults

Start with `/docs/implementation-blueprint.md`.
Publishing/redirect conventions are in `/docs/publishing-and-redirects.md`.
Image lifecycle notes are in `/Users/janthony/src/tech-mage/docs/image-policy.md`.

## Commands

- `pnpm install`
- `pnpm run content:prepare`
  - Generates redirect pages from `content/redirects.json`
  - Builds `public/search-keywords.json` and `public/search-lunr.json`
  - Validates frontmatter dates and local markdown links/images
- `pnpm run dev:local`
- `pnpm run build:local`
- `pnpm run preview:local`

## Local Development

- Use Node from `.nvmrc` (`nvm use`).
- `pnpm run dev:local` builds search/redirect artifacts and starts dev server on localhost.
- `pnpm run build:local` produces a local static build with base path `/`.
- Local scripts set `SITE_INCLUDE_DRAFTS=true` so drafts render in dev/local builds.

## Markdown Images

- Standard image: `![Alt text](/images/posts/example.jpg)`
- Optional caption with image title: `![Alt text](/images/posts/example.jpg \"Caption text\")`
- Optional explicit HTML figure in Markdown:
  - `<figure><img src=\"/images/posts/example.jpg\" alt=\"Alt text\" /><figcaption>Caption text</figcaption></figure>`

## Production (Cloudflare + GitHub Pages)

- Configure environment variables (see `.env.example`).
- Set:
  - `SITE_URL` to your production domain (e.g. `https://techmage.example`)
  - `SITE_BASE_PATH` to `/` for custom domain, or `/<repo-name>` for GitHub project pages
  - `CLOUDFLARE_IMAGE_RESIZE_ENABLED=true` when the domain is proxied by Cloudflare
