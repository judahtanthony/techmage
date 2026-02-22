import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { siteConfig } from "./src/site.config";
import rehypeFigure from "./src/lib/rehype-figure.mjs";

export default defineConfig({
  site: siteConfig.siteUrl,
  base: siteConfig.basePath,
  integrations: [sitemap()],
  markdown: {
    syntaxHighlight: "shiki",
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, rehypeFigure],
  },
  output: "static",
});
