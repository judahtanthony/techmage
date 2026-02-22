import { buildRssXml, xmlResponse } from "../../lib/rss";
import { getAllThoughts } from "../../lib/thoughts";

export async function GET() {
  const notes = await getAllThoughts();

  const items = notes.map((note) => ({
    title: `${note.authorName}: ${note.content.slice(0, 48)}${note.content.length > 48 ? "..." : ""}`,
    link: note.url,
    description: note.content.slice(0, 180),
    pubDate: note.publishedAt.toISOString(),
  }));

  return xmlResponse(buildRssXml("Tech Mage Thoughts", "Latest thoughts", "/rss/notes.xml", items));
}
