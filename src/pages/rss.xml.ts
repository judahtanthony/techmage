import { getCollection } from "astro:content";
import { resolvePermalink } from "../lib/content-path";
import { buildRssXml, xmlResponse } from "../lib/rss";
import { isVisible } from "../lib/visibility";
import { getAllThoughts } from "../lib/thoughts";

export async function GET() {
  const [posts, notes] = await Promise.all([getCollection("posts"), getAllThoughts()]);
  const items = [
    ...posts.filter((p) => isVisible(p.data.publishedAt)).map((post) => ({
      title: post.data.title,
      link: resolvePermalink({ ...post, collection: "posts" }),
      description: post.data.excerpt || post.data.description || "",
      pubDate: String(post.data.publishedAt || ""),
    })),
    ...notes.map((note) => ({
      title: `${note.authorName}: ${note.content.slice(0, 48)}${note.content.length > 48 ? "..." : ""}`,
      link: note.url,
      description: note.content.slice(0, 180),
      pubDate: note.publishedAt.toISOString(),
    })),
  ].sort((a, b) => new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime());

  return xmlResponse(buildRssXml("Tech Mage", "Latest articles and thoughts", "/rss.xml", items));
}
