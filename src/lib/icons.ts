import lucide from "lucide";
import * as simpleIcons from "simple-icons";

type IconNode = [string, Record<string, string>][];

const {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  Expand,
  ExternalLink,
  Menu,
  X,
  Search,
  Share2,
  Tag,
} = lucide as Record<string, IconNode>;

export type UiIconName =
  | "arrow-left"
  | "arrow-right"
  | "calendar"
  | "clock"
  | "expand"
  | "external-link"
  | "menu"
  | "search"
  | "share"
  | "tag"
  | "x";

const uiIconMap: Record<UiIconName, IconNode> = {
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  calendar: CalendarDays,
  clock: Clock3,
  expand: Expand,
  "external-link": ExternalLink,
  menu: Menu,
  search: Search,
  share: Share2,
  tag: Tag,
  x: X,
};

type BrandIconName = "bluesky" | "facebook" | "github" | "linkedin" | "x";

const brandIconMap: Partial<Record<BrandIconName, { path: string; title: string; viewBox?: string }>> = {
  bluesky: {
    path: simpleIcons.siBluesky.path,
    title: simpleIcons.siBluesky.title,
  },
  facebook: {
    path: simpleIcons.siFacebook.path,
    title: simpleIcons.siFacebook.title,
  },
  github: {
    path: simpleIcons.siGithub.path,
    title: simpleIcons.siGithub.title,
  },
  linkedin: {
    path: "M5 8.5a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3ZM3.8 9.8h2.4V20H3.8Zm5 0h2.3v1.4h.03c.32-.61 1.1-1.67 2.87-1.67c3.07 0 3.64 2.02 3.64 4.64V20h-2.4v-5.12c0-1.22-.02-2.79-1.7-2.79c-1.7 0-1.96 1.33-1.96 2.7V20H8.8Z",
    title: "LinkedIn",
  },
  x: {
    path: simpleIcons.siX.path,
    title: simpleIcons.siX.title,
  },
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function attrsToString(attrs: Record<string, string>, extraClass?: string): string {
  const merged = extraClass
    ? { ...attrs, class: attrs.class ? `${attrs.class} ${extraClass}` : extraClass }
    : attrs;

  return Object.entries(merged)
    .map(([key, value]) => `${key}="${escapeHtml(String(value))}"`)
    .join(" ");
}

export function renderUiIcon(name: UiIconName, size = 18, className = ""): string {
  const iconNode = uiIconMap[name];
  const rootAttrs = {
    xmlns: "http://www.w3.org/2000/svg",
    width: String(size),
    height: String(size),
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "1.85",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "aria-hidden": "true",
    focusable: "false",
    class: "tm-icon",
  };

  const children = iconNode
    .map(([tag, attrs]) => `<${tag} ${attrsToString(attrs as Record<string, string>)}></${tag}>`)
    .join("");

  return `<svg ${attrsToString(rootAttrs, className)}>${children}</svg>`;
}

export function renderBrandIcon(name: BrandIconName, size = 16, className = ""): string {
  const icon = brandIconMap[name];
  if (!icon) return "";

  const rootAttrs = {
    xmlns: "http://www.w3.org/2000/svg",
    width: String(size),
    height: String(size),
    viewBox: icon.viewBox || "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": "true",
    focusable: "false",
    class: "tm-brand-icon",
  };

  return `<svg ${attrsToString(rootAttrs, className)}><path d="${escapeHtml(icon.path)}"></path></svg>`;
}
