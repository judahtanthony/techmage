import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const redirectsJsonPath = path.join(root, "content", "redirects.json");

function sanitizePath(urlPath) {
  const noQuery = urlPath.split("?")[0].split("#")[0];
  const withLead = noQuery.startsWith("/") ? noQuery : `/${noQuery}`;
  return withLead.endsWith("/") ? withLead : `${withLead}/`;
}

async function loadRules() {
  const raw = await fs.readFile(redirectsJsonPath, "utf8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed;
}

function validateRules(rules) {
  const seen = new Set();
  const errs = [];

  for (const [idx, rule] of rules.entries()) {
    const label = `redirects[${idx}]`;
    if (!rule || typeof rule !== "object") {
      errs.push(`${label}: expected object.`);
      continue;
    }
    if (typeof rule.from !== "string" || !rule.from.trim()) {
      errs.push(`${label}: missing non-empty "from".`);
      continue;
    }
    if (typeof rule.to !== "string" || !rule.to.trim()) {
      errs.push(`${label}: missing non-empty "to".`);
      continue;
    }

    const from = sanitizePath(rule.from);
    const to = sanitizePath(rule.to);

    if (from === to) errs.push(`${label}: "from" and "to" cannot be the same (${from}).`);
    if (seen.has(from)) errs.push(`${label}: duplicate "from" path (${from}).`);
    seen.add(from);
  }

  if (errs.length) {
    const message = ["Redirect map validation failed:", ...errs.map((e) => `- ${e}`)].join("\n");
    throw new Error(message);
  }
}

function redirectHtml(target) {
  const escaped = target.replace(/"/g, "&quot;");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="robots" content="noindex" />
  <meta http-equiv="refresh" content="0; url=${escaped}" />
  <link rel="canonical" href="${escaped}" />
  <script>location.replace(${JSON.stringify(target)});</script>
  <title>Redirecting…</title>
</head>
<body>
  <p>Redirecting to <a href="${escaped}">${escaped}</a>.</p>
</body>
</html>`;
}

async function main() {
  const rules = await loadRules();
  validateRules(rules);
  let count = 0;

  for (const rule of rules) {
    const from = sanitizePath(rule.from);
    const to = sanitizePath(rule.to);
    const outPath = path.join(root, "public", from, "index.html");
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, redirectHtml(to), "utf8");
    count += 1;
  }

  console.log(`Generated ${count} static redirect pages.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
