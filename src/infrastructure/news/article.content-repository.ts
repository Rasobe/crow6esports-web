import { getCollection } from "astro:content";
import { estimateReadingTime, type Article } from "@/domain/news/article";
import type { ArticleRepository } from "@/domain/news/article.repository";

async function loadArticles(): Promise<Article[]> {
  const entries = await getCollection("news");

  return entries.map(({ id, data, body }) => ({
    slug: id,
    title: data.title,
    locale: data.locale,
    excerpt: data.excerpt,
    date: data.date,
    updated: data.updated ?? undefined,
    cover: data.cover,
    coverAlt: data.coverAlt,
    translationSlug: data.translationSlug ?? undefined,
    readingTime: estimateReadingTime(body ?? ""),
  }));
}

export function createContentArticleRepository(): ArticleRepository {
  return { findAll: loadArticles };
}
