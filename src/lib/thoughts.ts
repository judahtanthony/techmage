import { getCollection, type CollectionEntry } from "astro:content";
import { parseContentDate } from "./content-path";
import { isVisible } from "./visibility";
import { slugifyTag } from "./tags";

export type Thought = {
  id: string;
  authorSlug: string;
  authorName: string;
  publishedAt: Date;
  content: string;
  tags: string[];
  url: string;
};

const ENTRY_RE = /^\s*-\s+(\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}(?::\d{2})?)?)\s*:\s*(.*)$/;

export function parseThoughtsFromAuthor(author: CollectionEntry<"authors">): Thought[] {
  const entries = extractMicroPostEntries(author);
  if (entries.length > 0) {
    return parseThoughtEntries(author, entries);
  }

  // Backward-compatible fallback while author files are migrated.
  return parseThoughtEntries(author, parseLegacyBodyEntries(author.body || ""));
}

function parseThoughtEntries(
  author: CollectionEntry<"authors">,
  entries: Array<{ dateRaw: string; content: string }>,
): Thought[] {
  const out: Thought[] = [];
  const authorSlug = author.data.slug;
  const authorName = author.data.name;

  for (const entry of entries) {
    const date = parseContentDate(entry.dateRaw);
    const content = entry.content.trim();
    if (!date || !content) {
      continue;
    }
    const tags = extractHashtagTags(content);
    const stamp = date.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
    const id = `${authorSlug}-${stamp}-${out.length + 1}`;
    out.push({
      id,
      authorSlug,
      authorName,
      publishedAt: date,
      content,
      tags,
      url: `/notes/#${id}`,
    });
  }

  return out;
}

function extractMicroPostEntries(author: CollectionEntry<"authors">): Array<{ dateRaw: string; content: string }> {
  const raw = author.data.microPost ?? author.data.microPosts;
  return normalizeMicroPostEntries(raw);
}

function normalizeMicroPostEntries(raw: unknown): Array<{ dateRaw: string; content: string }> {
  if (!raw) return [];

  const out: Array<{ dateRaw: string; content: string }> = [];

  if (isRecord(raw)) {
    for (const [dateRaw, content] of Object.entries(raw)) {
      if (typeof content === "string") {
        out.push({ dateRaw, content });
      }
    }
    return out;
  }

  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (!isRecord(item)) continue;
      for (const [dateRaw, content] of Object.entries(item)) {
        if (typeof content === "string") {
          out.push({ dateRaw, content });
        }
      }
    }
  }

  return out;
}

function parseLegacyBodyEntries(body: string): Array<{ dateRaw: string; content: string }> {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const out: Array<{ dateRaw: string; content: string }> = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const match = ENTRY_RE.exec(line);
    if (!match) {
      i += 1;
      continue;
    }

    const contentLines: string[] = [match[2] || ""];
    i += 1;

    while (i < lines.length) {
      if (ENTRY_RE.test(lines[i])) break;
      if (lines[i].trim().length === 0) {
        contentLines.push("");
        i += 1;
        continue;
      }
      if (/^\s+/.test(lines[i])) {
        contentLines.push(lines[i].replace(/^\s+/, ""));
        i += 1;
        continue;
      }
      break;
    }

    out.push({
      dateRaw: match[1],
      content: contentLines.join("\n"),
    });
  }

  return out;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function getAllThoughts(): Promise<Thought[]> {
  const authors = await getCollection("authors");
  return authors
    .flatMap(parseThoughtsFromAuthor)
    .filter((t) => isVisible(t.publishedAt))
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

export async function getThoughtsByAuthorSlug(authorSlug: string): Promise<Thought[]> {
  const all = await getAllThoughts();
  return all.filter((t) => t.authorSlug === authorSlug);
}

export async function getTagMapForThoughts(): Promise<Map<string, string>> {
  const thoughts = await getAllThoughts();
  const map = new Map<string, string>();
  for (const thought of thoughts) {
    for (const tag of thought.tags) {
      map.set(slugifyTag(tag), tag);
    }
  }
  return map;
}

function extractHashtagTags(input: string): string[] {
  const tags = new Set<string>();
  const re = /(^|[\s(])#([a-z0-9][a-z0-9-]*)/gi;
  for (const match of input.matchAll(re)) {
    const tag = (match[2] || "").toLowerCase();
    if (tag) tags.add(tag);
  }
  return Array.from(tags);
}
