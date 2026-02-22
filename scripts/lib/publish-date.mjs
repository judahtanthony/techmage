import { DateTime } from "luxon";

export function toUtcDateTime(value, defaultTimeZone) {
  if (!value) return undefined;
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return undefined;
    return DateTime.fromJSDate(value).toUTC();
  }

  const raw = String(value).trim();
  const hasZone = /([zZ]|[+-]\d{2}:\d{2})$/.test(raw);
  const dt = hasZone
    ? DateTime.fromISO(raw, { setZone: true })
    : DateTime.fromISO(raw, { zone: defaultTimeZone });
  if (!dt.isValid) return undefined;
  return dt.toUTC();
}

export function toUtcDate(value, defaultTimeZone) {
  const dt = toUtcDateTime(value, defaultTimeZone);
  return dt ? dt.toJSDate() : undefined;
}

export function isPublishedAt(value, nowUtc, defaultTimeZone) {
  const dt = toUtcDateTime(value, defaultTimeZone);
  if (!dt) return false;
  return dt.toMillis() <= nowUtc.toMillis();
}
