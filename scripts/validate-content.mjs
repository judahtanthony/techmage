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

async function main() {
  const files = await fg(contentGlob, { cwd: root, absolute: true });

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
