export type SiteConfig = {
  siteName: string;
  siteUrl: string;
  basePath: string;
  canonicalSiteUrl: string;
  canonicalBasePath: string;
  noIndex: boolean;
  includeDrafts: boolean;
  defaultTimeZone: string;
  defaultAuthorSlug: string;
  defaultSocialImage: string;
  cloudflare: {
    enabled: boolean;
    imageResizePath: string;
    imageQuality: number;
  };
  social: {
    github?: string;
    x?: string;
    medium?: string;
    linkedin?: string;
  };
};

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value == null) return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function parseNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const siteConfig: SiteConfig = {
  siteName: process.env.SITE_NAME || "Tech Mage",
  siteUrl: process.env.SITE_URL || "https://judahtanthony.com",
  basePath: process.env.SITE_BASE_PATH || "/",
  canonicalSiteUrl: process.env.SITE_CANONICAL_URL || "https://judahtanthony.com",
  canonicalBasePath: process.env.SITE_CANONICAL_BASE_PATH || "/",
  noIndex: parseBoolean(process.env.SITE_NOINDEX, false),
  includeDrafts: parseBoolean(process.env.SITE_INCLUDE_DRAFTS, false),
  defaultTimeZone: process.env.SITE_TIME_ZONE || "America/New_York",
  defaultAuthorSlug: process.env.SITE_DEFAULT_AUTHOR || "judah-t-anthony",
  defaultSocialImage: process.env.SITE_DEFAULT_SOCIAL_IMAGE || "/images/social/default-og.png",
  cloudflare: {
    enabled: parseBoolean(process.env.CLOUDFLARE_IMAGE_RESIZE_ENABLED, false),
    imageResizePath: process.env.CLOUDFLARE_IMAGE_RESIZE_PATH || "/cdn-cgi/image",
    imageQuality: parseNumber(process.env.CLOUDFLARE_IMAGE_QUALITY, 85),
  },
  social: {
    medium: "https://medium.com/@judahtanthony",
    github: "https://github.com/judahtanthony",
    x: "https://x.com/judahtanthony",
    linkedin: "https://www.linkedin.com/in/judahtanthony",
  },
};
