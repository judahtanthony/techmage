import { getCollection } from "astro:content";
import { resolvePermalink, resolveNamespace } from "../../../lib/content-path";
import { buildRssXml, xmlResponse } from "../../../lib/rss";
import { isVisible } from "../../../lib/visibility";

export async function getStaticPaths() {
  const posts = (await getCollection("posts")).filter((p) => isVisible(p.data.publishedAt));
  const slugs = new Set<string>();
  for (const post of posts) slugs.add(resolveNamespace({ ...post, collection: "posts" }));
  return Array.from(slugs).map((slug) => ({ params: { slug } }));
}

export async function GET({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const posts = (await getCollection("posts"))
    .filter((p) => isVisible(p.data.publishedAt) && resolveNamespace({ ...p, collection: "posts" }) === slug)
    .map((post) => ({
      title: post.data.title,
      link: resolvePermalink({ ...post, collection: "posts" }),
      description: post.data.excerpt || post.data.description || "",
      pubDate: String(post.data.publishedAt || ""),
    }));

  const items = posts.sort((a, b) => new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime());

  return xmlResponse(buildRssXml(`Tech Mage Category: ${slug}`, `Latest content in ${slug}`, `/rss/category/${slug}.xml`, items));
}
