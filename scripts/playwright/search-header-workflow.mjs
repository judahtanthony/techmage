#!/usr/bin/env node

import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SEARCH_TERM = process.env.SEARCH_TERM || "hiring";
const TARGET_URL = process.argv[2] || process.env.TARGET_URL || "http://127.0.0.1:4321/";
const OUTPUT_DIR = path.resolve(process.cwd(), "output/playwright");
const HEADER_IDLE_PATH = path.join(OUTPUT_DIR, "search-header-idle.png");
const HEADER_FOCUSED_PATH = path.join(OUTPUT_DIR, "search-header-focused.png");
const HEADER_TYPED_PATH = path.join(OUTPUT_DIR, "search-header-typed.png");
const SCREENSHOT_PATH = path.join(OUTPUT_DIR, "search-header-results.png");
const REPORT_PATH = path.join(OUTPUT_DIR, "search-header-results.json");
const HEADLESS = process.env.HEADLESS !== "false";
const BROWSER_CHANNEL = process.env.BROWSER_CHANNEL || "chrome";
const RECORD_VIDEO = process.env.RECORD_VIDEO === "true";

async function pathExists(candidate) {
  try {
    await fs.access(candidate);
    return true;
  } catch {
    return false;
  }
}

async function findPlaywrightFromNpxCache() {
  const npxRoot = path.join(os.homedir(), ".npm", "_npx");
  if (!(await pathExists(npxRoot))) return null;

  const entries = await fs.readdir(npxRoot, { withFileTypes: true });
  const candidates = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const modulePath = path.join(npxRoot, entry.name, "node_modules", "playwright", "index.js");
    if (!(await pathExists(modulePath))) continue;
    const stats = await fs.stat(modulePath);
    candidates.push({ modulePath, mtimeMs: stats.mtimeMs });
  }

  candidates.sort((a, b) => b.mtimeMs - a.mtimeMs);
  return candidates[0]?.modulePath || null;
}

async function loadPlaywright() {
  const explicitModule = process.env.PLAYWRIGHT_MODULE;
  if (explicitModule) {
    const loaded = await import(pathToFileURL(explicitModule).href);
    return loaded.default || loaded;
  }

  try {
    const loaded = await import("playwright");
    return loaded.default || loaded;
  } catch {
    const cachedModule = await findPlaywrightFromNpxCache();
    if (cachedModule) {
      const loaded = await import(pathToFileURL(cachedModule).href);
      return loaded.default || loaded;
    }
  }

  throw new Error(
    "Playwright was not found. Install it with `npm install -g playwright` or prime the npx cache with `npx --yes playwright --version`."
  );
}

function sanitizeConsoleMessage(message) {
  return {
    type: message.type(),
    text: message.text(),
  };
}

async function main() {
  const playwright = await loadPlaywright();
  const browser = await playwright.chromium.launch({
    channel: BROWSER_CHANNEL,
    headless: HEADLESS,
  });

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const contextOptions = {
    viewport: { width: 1440, height: 1200 },
    colorScheme: "dark",
  };

  if (RECORD_VIDEO) {
    contextOptions.recordVideo = {
      dir: OUTPUT_DIR,
      size: { width: 1440, height: 1200 },
    };
  }

  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  const consoleMessages = [];
  const pageErrors = [];

  page.on("console", (message) => consoleMessages.push(sanitizeConsoleMessage(message)));
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(TARGET_URL, { waitUntil: "networkidle" });

  const navSearchInput = page.locator("#nav-search-input");
  const navSearchForm = page.locator("#nav-search-form");
  const header = page.locator(".topbar-inner");

  await header.screenshot({ path: HEADER_IDLE_PATH });

  await navSearchInput.focus();
  await page.waitForTimeout(250);
  await header.screenshot({ path: HEADER_FOCUSED_PATH });
  await navSearchInput.fill(SEARCH_TERM);
  await page.waitForTimeout(250);
  await header.screenshot({ path: HEADER_TYPED_PATH });

  await Promise.all([
    page.waitForURL((url) => url.pathname.endsWith("/search/") && url.searchParams.get("q") === SEARCH_TERM),
    navSearchForm.press("Enter"),
  ]);

  await page.waitForLoadState("networkidle");
  await page.locator("#search-input").waitFor({ state: "visible" });
  await page.waitForFunction(() => {
    const results = document.querySelectorAll("#results .result");
    const empty = document.querySelector("#results .empty");
    return results.length > 0 || Boolean(empty);
  });

  const resultCards = page.locator("#results .result");
  const emptyState = page.locator("#results .empty");
  const resultCount = await resultCards.count();
  const emptyStateVisible = await emptyState.isVisible().catch(() => false);
  const video = RECORD_VIDEO ? page.video() : null;

  const report = {
    startUrl: TARGET_URL,
    finalUrl: page.url(),
    title: await page.title(),
    searchTerm: SEARCH_TERM,
    resultCount,
    firstResult: resultCount > 0 ? await resultCards.first().locator(".title").textContent() : null,
    emptyStateVisible,
    emptyStateText: emptyStateVisible ? await emptyState.textContent() : null,
    consoleMessages,
    pageErrors,
    headerIdlePath: HEADER_IDLE_PATH,
    headerFocusedPath: HEADER_FOCUSED_PATH,
    headerTypedPath: HEADER_TYPED_PATH,
    screenshotPath: SCREENSHOT_PATH,
  };

  await page.screenshot({ path: SCREENSHOT_PATH, fullPage: true });
  await context.close();
  report.videoPath = video ? await video.path() : null;
  await fs.writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(JSON.stringify(report, null, 2));
  await browser.close();
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exitCode = 1;
});
