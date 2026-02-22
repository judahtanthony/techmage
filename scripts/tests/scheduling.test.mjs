import test from "node:test";
import assert from "node:assert/strict";
import { DateTime } from "luxon";
import { isPublishedAt, toUtcDateTime } from "../lib/publish-date.mjs";

const defaultTimeZone = "America/New_York";

test("parses date-only input in site timezone before converting to UTC", () => {
  const dt = toUtcDateTime("2026-02-21", defaultTimeZone);
  assert.equal(dt?.toISO(), "2026-02-21T05:00:00.000Z");
});

test("parses date-time without offset in site timezone", () => {
  const dt = toUtcDateTime("2026-03-08T01:30:00", defaultTimeZone);
  assert.equal(dt?.toISO(), "2026-03-08T06:30:00.000Z");
});

test("respects explicit UTC offsets", () => {
  const dt = toUtcDateTime("2026-03-08T01:30:00-05:00", defaultTimeZone);
  assert.equal(dt?.toISO(), "2026-03-08T06:30:00.000Z");
});

test("publish scheduling uses UTC comparison consistently", () => {
  const now = DateTime.fromISO("2026-02-21T05:00:00.000Z", { setZone: true }).toUTC();
  assert.equal(isPublishedAt("2026-02-21", now, defaultTimeZone), true);
  assert.equal(isPublishedAt("2026-02-21T00:01:00", now, defaultTimeZone), false);
  assert.equal(isPublishedAt("2026-02-20T23:59:59", now, defaultTimeZone), true);
});
