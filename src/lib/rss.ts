import { siteConfig } from "../site.config";

type RssItem = {
  title: string;
  link: string;
  description?: string;
  pubDate?: string;
};

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toAbsolute(link: string) {
  return /^https?:\/\//i.test(link) ? link : new URL(link, siteConfig.siteUrl).toString();
}

export function buildRssXml(title: string, description: string, path: string, items: RssItem[]) {
  const channelLink = toAbsolute(path);
  const renderedItems = items
    .map((item) => `\n<item><title>${esc(item.title)}</title><link>${esc(toAbsolute(item.link))}</link>${item.description ? `<description>${esc(item.description)}</description>` : ""}${item.pubDate ? `<pubDate>${new Date(item.pubDate).toUTCString()}</pubDate>` : ""}</item>`)
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>${esc(title)}</title><link>${esc(channelLink)}</link><description>${esc(description)}</description>${renderedItems}\n</channel></rss>`;
}

export function xmlResponse(xml: string) {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
