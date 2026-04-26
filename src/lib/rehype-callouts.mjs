function isElement(node, tag) {
  return node && node.type === "element" && node.tagName === tag;
}

function walk(node, visit) {
  if (!node || !node.children) return;
  for (let i = 0; i < node.children.length; i += 1) {
    const child = node.children[i];
    visit(child, node, i);
    walk(child, visit);
  }
}

function findFirstTextNode(nodes) {
  if (!Array.isArray(nodes)) return undefined;
  for (const node of nodes) {
    if (!node) continue;
    if (node.type === "text") return node;
    if (Array.isArray(node.children)) {
      const nested = findFirstTextNode(node.children);
      if (nested) return nested;
    }
  }
  return undefined;
}

function findFirstElementChild(node, tagName) {
  if (!node || !Array.isArray(node.children)) return undefined;
  for (const child of node.children) {
    if (isElement(child, tagName)) return child;
  }
  return undefined;
}

function collectTextNodes(nodes, out = []) {
  if (!Array.isArray(nodes)) return out;
  for (const node of nodes) {
    if (!node) continue;
    if (node.type === "text") {
      out.push(node);
      continue;
    }
    if (Array.isArray(node.children)) {
      collectTextNodes(node.children, out);
    }
  }
  return out;
}

function stripPrefixFromTextNodes(nodes, count) {
  if (!Array.isArray(nodes) || count <= 0) return;
  let remaining = count;
  for (const node of nodes) {
    if (!node || node.type !== "text" || typeof node.value !== "string") continue;
    if (remaining <= 0) break;
    if (node.value.length <= remaining) {
      remaining -= node.value.length;
      node.value = "";
      continue;
    }
    node.value = node.value.slice(remaining);
    remaining = 0;
  }
}

function isEmptyParagraph(node) {
  if (!isElement(node, "p")) return false;
  const text = flattenText(node).trim();
  return text.length === 0;
}

function flattenText(node) {
  if (!node) return "";
  if (node.type === "text") return node.value || "";
  if (!Array.isArray(node.children)) return "";
  return node.children.map((c) => flattenText(c)).join("");
}

export default function rehypeCallouts() {
  return (tree) => {
    let blockquotesSeen = 0;
    let calloutsMatched = 0;
    walk(tree, (node) => {
      if (!isElement(node, "blockquote")) return;
      blockquotesSeen += 1;
      if (!Array.isArray(node.children) || node.children.length === 0) return;

      const first = findFirstElementChild(node, "p");
      if (!isElement(first, "p")) return;

      const paragraphText = flattenText(first);
      if (typeof paragraphText !== "string" || paragraphText.trim().length === 0) return;
      const match = paragraphText.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i);
      if (!match) return;
      calloutsMatched += 1;

      const textNodes = collectTextNodes(first.children);
      stripPrefixFromTextNodes(textNodes, match[0].length);

      const calloutType = match[1].toLowerCase();
      const label = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();

      node.tagName = "aside";
      node.properties = {
        ...(node.properties || {}),
        className: ["prose-callout", `prose-callout-${calloutType}`],
        dataCalloutType: calloutType,
        dataCalloutLabel: label,
      };

      if (isEmptyParagraph(node.children[0])) {
        node.children.shift();
      }
    });

    if (process.env.DEBUG_CALLOUTS === "1") {
      // eslint-disable-next-line no-console
      console.log(`[rehype-callouts] blockquotes=${blockquotesSeen} matched=${calloutsMatched}`);
    }
  };
}
