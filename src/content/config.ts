import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { siteConfig } from "../site.config";

const isoDate = z.union([z.date(), z.string().datetime({ offset: true }), z.string().date()]).nullable();

const postSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).optional(),
  publishedAt: isoDate.optional(),
  updatedAt: isoDate.optional(),
  author: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  tags: z.array(z.string().min(1)).default([]),
  series: z.string().min(1).optional(),
  part: z.number().int().positive().optional(),
  image: z.string().min(1).nullable().optional(),
  excerpt: z.string().nullable().optional(),
  description: z.string().optional(),
  canonical: z.string().url().optional(),
  source: z
    .object({
      name: z.string().min(1),
      url: z.string().url(),
    })
    .optional(),
});

const categorySchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  image: z.string().min(1).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

const authorSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  image: z.string().min(1).optional(),
  microPost: z.record(z.string()).optional(),
  microPosts: z.union([z.record(z.string()), z.array(z.record(z.string()))]).optional(),
  socials: z
    .object({
      github: z.string().url().optional(),
      medium: z.string().url().optional(),
      x: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      website: z.string().url().optional(),
    })
    .optional(),
});

export const collections = {
  posts: defineCollection({
    loader: glob({
      pattern: siteConfig.includeDrafts
        ? ["content/posts/**/*.md", "drafts/posts/**/*.md"]
        : ["content/posts/**/*.md"],
      base: ".",
    }),
    schema: postSchema,
  }),
  categories: defineCollection({
    loader: glob({ pattern: "content/categories/**/*.md", base: "." }),
    schema: categorySchema,
  }),
  authors: defineCollection({
    loader: glob({ pattern: "content/authors/**/*.md", base: "." }),
    schema: authorSchema,
  }),
};
