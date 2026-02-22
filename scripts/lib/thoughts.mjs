import { DateTime } from "luxon";

const ENTRY_RE = /^\s*-\s+(\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}(?::\d{2})?)?)\s*:\s*(.*)$/;

export function parseThoughtsFromAuthorMicroPosts(authorSlug, authorName, rawMicroPosts, defaultTimeZone) {
  const entries = normalizeMicroPostEntries(rawMicroPosts);
  const out = [];

  for (const { rawDate, content } of entries) {
    const dt = parseDate(rawDate, defaultTimeZone);
    const text = String(content || "").trim();
    if (!dt || !text) continue;

    const tags = extractHashtagTags(text);
    const stamp = dt.toUTC().toFormat("yyyyLLddHHmmss");
    const id = `${authorSlug}-${stamp}-${out.length + 1}`;
    out.push({
      id,
      authorSlug,
      authorName,
      publishedAt: dt.toUTC(),
      content: text,
      tags,
      url: `/notes/#${id}`,
    });
  }

  return out;
}

export function parseThoughtsFromAuthorBody(authorSlug, authorName, body, defaultTimeZone) {
  const lines = String(body || "").replace(/\r\n/g, "\n").split("\n");
  const out = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const m = ENTRY_RE.exec(line);
    if (!m) {
      i += 1;
      continue;
    }

    const rawDate = m[1];
    const dt = parseDate(rawDate, defaultTimeZone);
    const contentLines = [m[2] || ""];
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

    const content = contentLines.join("\n").trim();
    if (!dt || !content) continue;

    const tags = extractHashtagTags(content);
    const stamp = dt.toUTC().toFormat("yyyyLLddHHmmss");
    const id = `${authorSlug}-${stamp}-${out.length + 1}`;
    out.push({
      id,
      authorSlug,
      authorName,
      publishedAt: dt.toUTC(),
      content,
      tags,
      url: `/notes/#${id}`,
    });
  }

  return out;
}

function normalizeMicroPostEntries(rawMicroPosts) {
  if (!rawMicroPosts) return [];

  if (isRecord(rawMicroPosts)) {
    return Object.entries(rawMicroPosts)
      .filter(([, content]) => typeof content === "string")
      .map(([rawDate, content]) => ({ rawDate, content }));
  }

  if (Array.isArray(rawMicroPosts)) {
    const entries = [];
    for (const item of rawMicroPosts) {
      if (!isRecord(item)) continue;
      for (const [rawDate, content] of Object.entries(item)) {
        if (typeof content === "string") {
          entries.push({ rawDate, content });
        }
      }
    }
    return entries;
  }

  return [];
}

function parseDate(value, defaultTimeZone) {
  if (!value) return undefined;
  const raw = String(value).trim();
  const hasZone = /([zZ]|[+-]\d{2}:\d{2})$/.test(raw);
  let dt = hasZone
    ? DateTime.fromISO(raw, { setZone: true })
    : DateTime.fromISO(raw, { zone: defaultTimeZone });
  if (!dt.isValid && !hasZone) {
    dt = DateTime.fromFormat(raw, "yyyy-MM-dd HH:mm:ss", { zone: defaultTimeZone });
  }
  if (!dt.isValid && !hasZone) {
    dt = DateTime.fromFormat(raw, "yyyy-MM-dd HH:mm", { zone: defaultTimeZone });
  }
  if (!dt.isValid) return undefined;
  return dt;
}

function extractHashtagTags(input) {
  const tags = new Set();
  const re = /(^|[\s(])#([a-z0-9][a-z0-9-]*)/gi;
  for (const m of input.matchAll(re)) {
    const tag = String(m[2] || "").toLowerCase();
    if (tag) tags.add(tag);
  }
  return Array.from(tags);
}

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
