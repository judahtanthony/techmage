import { siteConfig } from "../site.config";

export function withBase(pathname: string): string {
  if (/^https?:\/\//i.test(pathname)) return pathname;
  const basePath = normalizeBasePath(siteConfig.basePath);
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (basePath === "/") return normalized;
  return normalized.startsWith(basePath)
    ? normalized
    : `${basePath}${normalized}`;
}

function normalizeBasePath(value: string): string {
  if (!value || value === "/") return "/";
  const withLead = value.startsWith("/") ? value : `/${value}`;
  return withLead.endsWith("/") ? withLead.slice(0, -1) : withLead;
}
