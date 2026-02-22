import type { CollectionEntry } from "astro:content";
import { toExcerpt } from "./seo";

export function resolvePostTeaser(post: CollectionEntry<"posts">, max = 170): string {
  const explicit = post.data.excerpt?.trim();
  if (explicit) return explicit;
  return toExcerpt(post.body || "", max);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderTeaserMarkdown(value: string): string {
  const safe = escapeHtml(value);
  return safe
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}
