import { siteConfig } from "../site.config";
import { isPublished } from "./content-path";

export function isVisible(publishedAt?: string | Date | null): boolean {
  return siteConfig.includeDrafts || isPublished(publishedAt);
}

export function isDraft(publishedAt?: string | Date | null): boolean {
  return !isPublished(publishedAt);
}
