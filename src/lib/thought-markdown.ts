import { marked } from "marked";

marked.use({
  async: false,
  breaks: true,
  gfm: true,
});

function normalizeThoughtMarkdown(content: string): string {
  return content
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("  \n");
}

export async function renderThoughtHtml(content: string): Promise<string> {
  const normalized = normalizeThoughtMarkdown(content.trim());
  return marked.parse(normalized) as string;
}
