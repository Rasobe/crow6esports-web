import { getCollection } from "astro:content";
import { estimateReadingTime, type Article } from "@/domain/news/article";
import type { ArticleRepository } from "@/domain/news/article.repository";

async function loadArticles(): Promise<Article[]> {
  const entries = await getCollection("news");

  return entries.map(({ data, body }) => ({
    ...data,
    readingTime: estimateReadingTime(body ?? ""),
  }));
}

export function createContentArticleRepository(): ArticleRepository {
  return {
    findAll: loadArticles,
    async findBySlug(slug) {
      const articles = await loadArticles();
      return articles.find((article) => article.slug === slug);
    },
  };
}
