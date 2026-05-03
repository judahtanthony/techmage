import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";
import { toUtcDate } from "./lib/publish-date.mjs";

const root = process.cwd();
const contentGlob = [
  "content/posts/**/*.md",
  "content/categories/**/*.md",
  "content/authors/**/*.md",
  "drafts/posts/**/*.md",
];
const allowedLocalExtensions = new Set(["", ".md", ".mdx", ".html", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".avif"]);
const defaultTimeZone = "America/New_York";

const errors = [];
const contentRoutes = new Set();

function exists(p) {
  return fs.access(p).then(() => true).catch(() => false);
}

function parseDate(value, filePath, keyName) {
  if (!value) return;
  const dt = toUtcDate(value, defaultTimeZone);
  if (!dt) {
    const str = String(value).trim();
    errors.push(`${filePath}: invalid ${keyName} date \`${str}\`.`);
  }
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
  const dt = toUtcDate(publishedAt, defaultTimeZone);
  if (!dt) return undefined;
  const yyyy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  return `${yyyy}/${mm}`;
}

function resolveNamespace(filePath, collection, data) {
  return data.category || inferPathNamespace(filePath, collection) || inferDateNamespace(data.publishedAt) || "unpublished";
}

function normalizeRoute(route) {
  return route.endsWith("/") ? route : `${route}/`;
}

function extractMarkdownTargets(markdown) {
  const links = [];
  const images = [];
  const linkRe = /\[[^\]]+\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  const imageRe = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

  let m;
  while ((m = linkRe.exec(markdown)) !== null) links.push(m[1]);
  while ((m = imageRe.exec(markdown)) !== null) images.push(m[1]);

  return { links, images };
}

function isExternal(target) {
  return /^(https?:)?\/\//i.test(target) || target.startsWith("mailto:") || target.startsWith("tel:");
}

async function validateLocalTarget(filePath, target) {
  if (!target || isExternal(target) || target.startsWith("#")) return;

  const clean = target.split("#")[0].split("?")[0];
  const ext = path.extname(clean).toLowerCase();
  if (!allowedLocalExtensions.has(ext)) {
    errors.push(`${filePath}: unsupported local target extension in \`${target}\`.`);
    return;
  }

  if (clean.startsWith("/")) {
    if (contentRoutes.has(normalizeRoute(clean))) return;

    const publicPath = path.join(root, "public", clean);
    if (!(await exists(publicPath))) {
      errors.push(`${filePath}: missing public asset/link target \`${clean}\`.`);
    }
    return;
  }

  const abs = path.resolve(path.dirname(filePath), clean);
  if (!(await exists(abs))) {
    errors.push(`${filePath}: missing relative target \`${target}\`.`);
  }
}

async function buildContentRoutes(files) {
  for (const filePath of files) {
    if (!filePath.includes(`${path.sep}posts${path.sep}`)) continue;

    // eslint-disable-next-line no-await-in-loop
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = matter(raw);
    const data = parsed.data || {};
    const slug = inferSlug(filePath, data);
    const namespace = resolveNamespace(filePath, "posts", data);
    contentRoutes.add(`/blog/${namespace}/${slug}/`);
  }
}

async function main() {
  const files = await fg(contentGlob, { cwd: root, absolute: true });
  await buildContentRoutes(files);

  for (const filePath of files) {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = matter(raw);
    const data = parsed.data || {};

    parseDate(data.publishedAt, filePath, "publishedAt");
    parseDate(data.updatedAt, filePath, "updatedAt");

    const { links, images } = extractMarkdownTargets(parsed.content);
    for (const target of [...links, ...images]) {
      // eslint-disable-next-line no-await-in-loop
      await validateLocalTarget(filePath, target);
    }
  }

  if (errors.length > 0) {
    console.error("Content validation failed:\n");
    for (const e of errors) console.error(`- ${e}`);
    process.exit(1);
  }

  console.log(`Validated ${files.length} content files successfully.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
