import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const news = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./content/news" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    excerpt: z.string(),
    date: z.coerce.date(),
    author: z.string(),
    cover: z.string(),
    tags: z.array(z.string()),
  }),
});

export const collections = { news };
