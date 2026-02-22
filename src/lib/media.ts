import { siteConfig } from "../site.config";
import { withBase } from "./url";

export type ResponsiveImage = {
  src: string;
  srcset?: string;
  sizes?: string;
  width: number;
  height: number;
};

const BREAKPOINTS = [480, 768, 1024, 1366, 1600];

export function getDisplayImage(source: string | null | undefined, seed: string, width = 1200, height = 675): string {
  if (source && source.trim().length > 0) return source;
  return getPlacecatsUrl(seed, width, height);
}

export function getPlacecatsUrl(seed: string, width = 1200, height = 675): string {
  const cleanSeed = encodeURIComponent(seed || "tech-mage");
  return `https://www.placecats.com/${width}/${height}?seed=${cleanSeed}`;
}

export function buildResponsiveImage(
  source: string | null | undefined,
  seed: string,
  width = 1200,
  height = 675,
  sizes = "100vw",
): ResponsiveImage {
  const base = getDisplayImage(source, seed, width, height);
  const includeSrcset = siteConfig.cloudflare.enabled || !source;

  if (!includeSrcset) {
    return { src: base, width, height, sizes };
  }

  const ratio = height / width;
  const widths = Array.from(new Set([...BREAKPOINTS.filter((w) => w < width), width])).sort((a, b) => a - b);
  const srcset = widths
    .map((w) => {
      const h = Math.max(1, Math.round(w * ratio));
      const url = getVariantUrl(base, seed, source, w, h);
      return `${withBase(url)} ${w}w`;
    })
    .join(", ");

  return {
    src: withBase(getVariantUrl(base, seed, source, width, height)),
    srcset,
    sizes,
    width,
    height,
  };
}

function getVariantUrl(
  base: string,
  seed: string,
  source: string | null | undefined,
  width: number,
  height: number,
): string {
  if (siteConfig.cloudflare.enabled) {
    const opts = `width=${width},height=${height},fit=cover,quality=${siteConfig.cloudflare.imageQuality},format=auto`;
    const canonical = toCanonical(base);
    const encodedSource = encodeURI(canonical);
    return `${siteConfig.cloudflare.imageResizePath}/${opts}/${encodedSource}`;
  }

  if (!source) {
    return getPlacecatsUrl(seed, width, height);
  }

  return base;
}

function toCanonical(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const normalized = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return new URL(normalized, siteConfig.siteUrl).toString();
}
