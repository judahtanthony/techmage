import { siteConfig } from "../site.config";
import { DateTime } from "luxon";

type BaseEntry = {
  slug: string;
  id: string;
  body?: string;
  collection: "posts" | "notes";
  data: {
    title?: string;
    slug?: string;
    publishedAt?: string | Date | null;
    updatedAt?: string | Date | null;
    author?: string;
    category?: string;
    tags?: string[];
  };
};

export function isPublished(publishedAt?: string | Date | null, now = new Date()): boolean {
  const t = parseContentDate(publishedAt);
  if (!t) return false;
  return t.getTime() <= now.getTime();
}

export function inferSlug(entry: BaseEntry): string {
  if (entry.data.slug) return entry.data.slug;
  const idParts = entry.id.split("/");
  const file = idParts[idParts.length - 1] || "untitled";
  return file.replace(/\.mdx?$/i, "");
}

export function inferPathNamespace(entry: BaseEntry): string | undefined {
  const id = entry.id.replace(/\\/g, "/");
  const markers = [
    `/content/${entry.collection}/`,
    `/drafts/${entry.collection}/`,
    `content/${entry.collection}/`,
    `drafts/${entry.collection}/`,
    `${entry.collection}/`,
  ];

  let rest = id;
  for (const marker of markers) {
    const idx = id.indexOf(marker);
    if (idx >= 0) {
      rest = id.slice(idx + marker.length);
      break;
    }
  }

  const parts = rest.split("/").filter(Boolean);
  if (parts.length <= 1) return undefined;
  return parts.slice(0, -1).join("/");
}

export function inferDateNamespace(publishedAt?: string | Date | null): string | undefined {
  const d = parseContentDate(publishedAt);
  if (!d) return undefined;
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${yyyy}/${mm}`;
}

export function resolveNamespace(entry: BaseEntry): string {
  return (
    entry.data.category ||
    inferPathNamespace(entry) ||
    inferDateNamespace(entry.data.publishedAt) ||
    "unpublished"
  );
}

export function resolveAuthorSlug(entry: BaseEntry): string {
  return entry.data.author || siteConfig.defaultAuthorSlug;
}

export function resolvePermalink(entry: BaseEntry): string {
  const root = entry.collection === "posts" ? "blog" : "notes";
  const namespace = resolveNamespace(entry);
  const slug = inferSlug(entry);
  return `/${root}/${namespace}/${slug}/`;
}

export function resolveLastModified(entry: BaseEntry): Date | undefined {
  return parseContentDate(entry.data.updatedAt) || parseContentDate(entry.data.publishedAt);
}

export function parseContentDate(value?: string | Date | null): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return undefined;
    return new Date(value.getTime());
  }

  // If no explicit zone is supplied, interpret with the configured site timezone.
  const hasZone = /([zZ]|[+-]\d{2}:\d{2})$/.test(value.trim());
  let dt = hasZone
    ? DateTime.fromISO(value, { setZone: true })
    : DateTime.fromISO(value, { zone: siteConfig.defaultTimeZone });

  if (!dt.isValid && !hasZone) {
    dt = DateTime.fromFormat(value.trim(), "yyyy-MM-dd HH:mm:ss", { zone: siteConfig.defaultTimeZone });
  }
  if (!dt.isValid && !hasZone) {
    dt = DateTime.fromFormat(value.trim(), "yyyy-MM-dd HH:mm", { zone: siteConfig.defaultTimeZone });
  }

  if (!dt.isValid) return undefined;
  return dt.toUTC().toJSDate();
}
