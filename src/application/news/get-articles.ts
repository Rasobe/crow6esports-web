import type { Article } from "@/domain/news/article";
import type { ArticleRepository } from "@/domain/news/article.repository";

export async function getArticles(repository: ArticleRepository): Promise<Article[]> {
  const articles = await repository.findAll();
  return [...articles].sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getArticleBySlug(
  repository: ArticleRepository,
  slug: string,
): Promise<Article | undefined> {
  return repository.findBySlug(slug);
}
