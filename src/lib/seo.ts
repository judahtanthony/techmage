import { siteConfig } from "../site.config";

export function buildDefaultSocialTitle(postTitle: string): string {
  return `${postTitle} | ${siteConfig.siteName}`;
}

export function toExcerpt(source: string, max = 170): string {
  const clean = source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

export function resolveSocialDescription(explicit: string | null | undefined, markdownBody: string): string {
  return explicit && explicit.trim().length > 0 ? explicit : toExcerpt(markdownBody);
}

export function resolveSocialImage(image: string | null | undefined): string {
  const selected = image || siteConfig.defaultSocialImage;
  const source = toCanonicalUrl(selected);

  if (!siteConfig.cloudflare.enabled) return source;

  const resizeBase = new URL(siteConfig.cloudflare.imageResizePath, siteConfig.siteUrl).toString();
  const opts = `width=1200,height=630,fit=cover,quality=${siteConfig.cloudflare.imageQuality},format=auto`;
  return `${resizeBase}/${opts}/${source}`;
}

export function toCanonicalUrl(pathname: string): string {
  if (/^https?:\/\//i.test(pathname)) return pathname;
  const basePath = normalizeBasePath(siteConfig.basePath);
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const withBase = basePath === "/" || normalized.startsWith(basePath)
    ? normalized
    : `${basePath}${normalized}`;
  return new URL(withBase, siteConfig.siteUrl).toString();
}

export function resolveCanonicalUrl(permalink: string, explicitCanonical?: string): string {
  if (explicitCanonical) return explicitCanonical;
  return toCanonicalUrl(permalink);
}

function normalizeBasePath(value: string): string {
  if (!value || value === "/") return "/";
  const withLead = value.startsWith("/") ? value : `/${value}`;
  return withLead.endsWith("/") ? withLead.slice(0, -1) : withLead;
}
