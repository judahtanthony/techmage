# Image Policy (Draft)

Current state:

- During scaffolding and development, fallback images are served from `https://www.placecats.com/`.
- This keeps pages visually complete while real media is curated.

Target production policy:

1. Store canonical image assets in-repo under `public/images/` for long-term reliability.
2. Prefer local authored images for post heroes (`image` frontmatter).
3. Use Cloudflare image resizing for social/OG derivatives when enabled.
4. Keep fallback external placeholders disabled in production by adding a build check that rejects unresolved placeholder URLs.
5. Record image attribution/license notes in post frontmatter or adjacent metadata when required.

Rendering rules:

- Hero image target ratio: `16:9`.
- Social image target ratio: `1200x630`.
- Use explicit `alt` text for all author-provided images.

