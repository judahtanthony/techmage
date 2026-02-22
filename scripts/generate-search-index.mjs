import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";
import { DateTime } from "luxon";
import { isPublishedAt, toUtcDateTime } from "./lib/publish-date.mjs";
import { parseThoughtsFromAuthorBody, parseThoughtsFromAuthorMicroPosts } from "./lib/thoughts.mjs";

const root = process.cwd();
const keywordsPath = path.join(root, "public", "search-keywords.json");
const lunrPath = path.join(root, "public", "search-lunr.json");
const defaultTimeZone = "America/New_York";
const includeDrafts = ["1", "true", "yes", "on"].includes(
  String(process.env.SITE_INCLUDE_DRAFTS || "").toLowerCase(),
);
const stopWords = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "in", "is", "it", "of", "on", "or", "that",
  "the", "to", "with", "you", "your",
]);

function isPublished(publishedAt) {
  if (includeDrafts) return true;
  return isPublishedAt(publishedAt, DateTime.utc(), defaultTimeZone);
}

function inferSlug(filePath, data) {
  if (data.slug) return String(data.slug);
  return path.basename(filePath, path.extname(filePath));
}

function inferPathNamespace(filePath, collection) {
  const markers = [
    `${path.sep}content${path.sep}${collection}${path.sep}`,
    `${path.sep}drafts${path.sep}${collection}${path.sep}`,
  ];

  let rest;
  for (const marker of markers) {
    const idx = filePath.indexOf(marker);
    if (idx >= 0) {
      rest = filePath.slice(idx + marker.length);
      break;
    }
  }
  if (!rest) return undefined;
  const dir = path.dirname(rest);
  if (!dir || dir === ".") return undefined;
  return dir.split(path.sep).join("/");
}

function inferDateNamespace(publishedAt) {
  const dt = toUtcDateTime(publishedAt, defaultTimeZone);
  if (!dt) return undefined;
  return dt.toFormat("yyyy/MM");
}

function resolveNamespace(filePath, collection, data) {
  return data.category || inferPathNamespace(filePath, collection) || inferDateNamespace(data.publishedAt) || "unpublished";
}

function stripMarkdown(source) {
  return source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/[>#*_~\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value) {
  return String(value || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && !stopWords.has(t));
}

function buildEntry(filePath, collection) {
  const raw = fs.readFile(filePath, "utf8");
  return raw.then((text) => {
    const parsed = matter(text);
    const data = parsed.data || {};
    if (!isPublished(data.publishedAt)) return null;

    const slug = inferSlug(filePath, data);
    const namespace = resolveNamespace(filePath, collection, data);
    const rootPath = collection === "posts" ? "/blog" : "/notes";
    const url = `${rootPath}/${namespace}/${slug}/`;
    const title = data.title || stripMarkdown(parsed.content).slice(0, 72) || slug;
    const body = stripMarkdown(parsed.content);

    return {
      id: `${collection}:${namespace}:${slug}`,
      title,
      category: namespace,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      body,
      url,
    };
  });
}

function buildThoughtEntries(filePath) {
  const raw = fs.readFile(filePath, "utf8");
  return raw.then((text) => {
    const parsed = matter(text);
    const data = parsed.data || {};
    const authorSlug = data.slug || path.basename(filePath, path.extname(filePath));
    const authorName = data.name || authorSlug;
    const fromMicroPosts = parseThoughtsFromAuthorMicroPosts(
      authorSlug,
      authorName,
      data.microPost ?? data.microPosts,
      defaultTimeZone,
    );
    const fallback = fromMicroPosts.length
      ? []
      : parseThoughtsFromAuthorBody(authorSlug, authorName, parsed.content, defaultTimeZone);
    const thoughts = [...fromMicroPosts, ...fallback].filter(
      (t) => includeDrafts || t.publishedAt.toMillis() <= DateTime.utc().toMillis(),
    );

    return thoughts.map((t) => ({
      id: `thought:${t.id}`,
      title: "",
      category: "thoughts",
      tags: t.tags || [],
      body: t.content,
      url: t.url,
    }));
  });
}

async function main() {
  const [postFiles, authorFiles] = await Promise.all([
    fg(includeDrafts ? ["content/posts/**/*.md", "drafts/posts/**/*.md"] : ["content/posts/**/*.md"], {
      cwd: root,
      absolute: true,
    }),
    fg(["content/authors/**/*.md"], {
      cwd: root,
      absolute: true,
    }),
  ]);

  const entries = (
    await Promise.all([
      ...postFiles.map((file) => buildEntry(file, "posts")),
      ...authorFiles.map((file) => buildThoughtEntries(file)),
    ])
  ).flat().filter(Boolean);

  const keywordCounts = new Map();
  for (const e of entries) {
    const tokens = new Set([
      ...tokenize(e.title),
      ...tokenize(e.category),
      ...tokenize((e.tags || []).join(" ")),
    ]);
    for (const token of tokens) {
      keywordCounts.set(token, (keywordCounts.get(token) || 0) + 1);
    }
  }
  const keywords = Array.from(keywordCounts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
    .map((item) => item.value);

  const lunrCorpus = entries.map((e) => ({
    id: e.id,
    title: e.title,
    category: e.category,
    tags: (e.tags || []).join(" "),
    body: e.body || "",
    url: e.url,
  }));

  await fs.mkdir(path.dirname(keywordsPath), { recursive: true });
  for (const item of lunrCorpus) {
    if (item.url.startsWith("/notes/") && !item.url.includes("#")) {
      const parts = item.url.replace(/\/$/, "").split("/");
      const slug = parts[parts.length - 1];
      item.url = `/notes/#${slug}`;
    }
  }
  await fs.writeFile(keywordsPath, JSON.stringify(keywords));
  await fs.writeFile(lunrPath, JSON.stringify(lunrCorpus));
  console.log(`Wrote ${keywords.length} keyword docs and ${lunrCorpus.length} lunr docs.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
