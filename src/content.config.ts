import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const EXCERPT_MAX = 160;

/**
 * Los artículos los edita Keystatic (ver keystatic.config.tsx): un fichero MDX por artículo.
 * El slug es el nombre del fichero, es decir, el `id` de la entrada.
 */
const news = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./content/news" }),
  schema: z.object({
    title: z.string(),
    locale: z.enum(["es", "en"]),
    date: z.coerce.date(),
    updated: z.coerce.date().nullish(),
    excerpt: z.string().max(EXCERPT_MAX),
    cover: z.string(),
    coverAlt: z.string(),
    translationSlug: z.string().nullish(),
  }),
});

export const collections = { news };
