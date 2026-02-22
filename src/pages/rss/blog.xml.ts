import { getCollection } from "astro:content";
import { resolvePermalink } from "../../lib/content-path";
import { buildRssXml, xmlResponse } from "../../lib/rss";
import { isVisible } from "../../lib/visibility";

export async function GET() {
  const posts = (await getCollection("posts"))
    .filter((p) => isVisible(p.data.publishedAt))
    .sort((a, b) => new Date(b.data.publishedAt || 0).getTime() - new Date(a.data.publishedAt || 0).getTime());

  const items = posts.map((post) => ({
    title: post.data.title,
    link: resolvePermalink({ ...post, collection: "posts" }),
    description: post.data.excerpt || post.data.description || "",
    pubDate: String(post.data.publishedAt || ""),
  }));

  return xmlResponse(buildRssXml("Tech Mage Blog", "Latest articles", "/rss/blog.xml", items));
}
