# UI Component Workflow

Use this workflow whenever implementing or changing UI.

## Goal

Build features from reusable primitives first, then compose page-specific UI with minimal local styling.

## Required Steps

1. Break the feature down into UI pieces.
- Identify primitives (buttons, chips, rows, containers, skeletons, icons, cards).
- Identify composition-only pieces (layout arrangement specific to one page).

2. Decide what should be reusable.
- Reusable if it appears in multiple pages now, or is likely to appear again.
- Page-local only if it is tightly tied to one page’s specific composition.

3. Check existing component library first.
- Check shared Astro components in `/Users/janthony/src/tech-mage/src/components`.
- Check shared global primitives/utilities in `/Users/janthony/src/tech-mage/src/styles/global.css`.
- Reuse before creating anything new.

4. Add missing reusable components to the library.
- Add new reusable component styles as global `ui-*` primitives (or shared components when structural).
- Prefer composable class design over feature-specific names.
- Keep naming stable and descriptive (`ui-row`, `ui-pad`, `icon-chip`, etc.).

5. Build the feature with reusable + page-specific layers.
- Compose with reusable primitives first.
- Keep page-local CSS focused on harness/layout and one-off visual tuning.
- Avoid duplicating reusable primitive styles in page-local `<style>` blocks.

6. Validate and ship.
- Verify behavior on the feature page and at least one other page that reuses the primitive.
- Run:
  - `pnpm run build`
- If primitives changed, update style guide examples in `/Users/janthony/src/tech-mage/src/pages/style-guide.astro`.

## Guardrails

- Do not introduce new page-local utility classes when an equivalent reusable primitive exists.
- Do not copy-paste primitive CSS between pages.
- Keep style guide page styles minimal; it is a harness for reusable primitives.
