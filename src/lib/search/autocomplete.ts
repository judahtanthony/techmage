export type AutocompleteRecord = {
  title: string;
  category?: string;
  tags: string[];
  url: string;
};

function contains(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

export function autocomplete(records: AutocompleteRecord[], query: string, limit = 8) {
  const q = query.trim();
  if (!q) return [];

  const scored = records
    .map((r) => {
      let score = 0;
      if (contains(r.title, q)) score += 3;
      if (r.category && contains(r.category, q)) score += 2;
      if ((r.tags || []).some((t) => contains(t, q))) score += 1;
      return { r, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.r.title.localeCompare(b.r.title))
    .slice(0, limit)
    .map((x) => x.r);

  return scored;
}
