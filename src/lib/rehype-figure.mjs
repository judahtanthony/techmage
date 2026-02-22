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

export default function rehypeFigure() {
  return (tree) => {
    walk(tree, (node, parent, index) => {
      if (!parent || typeof index !== "number") return;
      if (!isElement(node, "p")) return;
      if (!Array.isArray(node.children) || node.children.length !== 1) return;

      const only = node.children[0];
      if (!isElement(only, "img")) return;

      const title = only.properties?.title;
      const imgNode = {
        ...only,
        properties: {
          ...only.properties,
          className: ["prose-image"],
        },
      };

      const figureChildren = [imgNode];
      if (typeof title === "string" && title.trim().length > 0) {
        figureChildren.push({
          type: "element",
          tagName: "figcaption",
          properties: { className: ["prose-caption"] },
          children: [{ type: "text", value: title.trim() }],
        });
      }

      parent.children[index] = {
        type: "element",
        tagName: "figure",
        properties: { className: ["prose-figure"] },
        children: figureChildren,
      };
    });
  };
}
