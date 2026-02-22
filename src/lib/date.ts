import { DateTime } from "luxon";
import { siteConfig } from "../site.config";
import { parseContentDate } from "./content-path";

export function formatContentDate(value?: string | Date | null): string {
  const d = parseContentDate(value);
  if (!d) return "Unpublished";
  return DateTime.fromJSDate(d).setZone(siteConfig.defaultTimeZone).toFormat("LLLL d, yyyy");
}
