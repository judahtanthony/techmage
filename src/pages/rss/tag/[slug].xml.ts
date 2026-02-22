import { getCollection } from "astro:content";
import { resolvePermalink } from "../../../lib/content-path";
import { buildRssXml, xmlResponse } from "../../../lib/rss";
import { isVisible } from "../../../lib/visibility";
import { slugifyTag } from "../../../lib/tags";
import { getAllThoughts, getTagMapForThoughts } from "../../../lib/thoughts";

export async function getStaticPaths() {
  const posts = (await getCollection("posts")).filter((p) => isVisible(p.data.publishedAt));
  const thoughts = await getTagMapForThoughts();
  const slugs = new Set<string>();
  for (const post of posts) for (const tag of post.data.tags || []) slugs.add(slugifyTag(tag));
  for (const slug of thoughts.keys()) slugs.add(slug);
  return Array.from(slugs).map((slug) => ({ params: { slug } }));
}

export async function GET({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const posts = (await getCollection("posts"))
    .filter((p) => isVisible(p.data.publishedAt) && (p.data.tags || []).some((tag) => slugifyTag(tag) === slug))
    .map((post) => ({
      title: post.data.title,
      link: resolvePermalink({ ...post, collection: "posts" }),
      description: post.data.excerpt || post.data.description || "",
      pubDate: String(post.data.publishedAt || ""),
    }));

  const notes = (await getAllThoughts())
    .filter((n) => n.tags.some((tag) => slugifyTag(tag) === slug))
    .map((note) => ({
      title: `${note.authorName}: ${note.content.slice(0, 48)}${note.content.length > 48 ? "..." : ""}`,
      link: note.url,
      description: note.content.slice(0, 180),
      pubDate: note.publishedAt.toISOString(),
    }));

  const items = [...posts, ...notes].sort((a, b) => new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime());

  return xmlResponse(buildRssXml(`Tech Mage Tag: ${slug}`, `Latest content tagged ${slug}`, `/rss/tag/${slug}.xml`, items));
}
