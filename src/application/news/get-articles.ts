import { findTranslation, type Article, type ArticleLocale } from "@/domain/news/article";
import type { ArticleRepository } from "@/domain/news/article.repository";

const byNewest = (a: Article, b: Article) => b.date.getTime() - a.date.getTime();

export async function getAllArticles(repository: ArticleRepository): Promise<Article[]> {
  return [...(await repository.findAll())].sort(byNewest);
}

export async function getArticles(
  repository: ArticleRepository,
  locale: ArticleLocale,
): Promise<Article[]> {
  const articles = await getAllArticles(repository);
  return articles.filter((article) => article.locale === locale);
}

export interface ArticleView {
  article: Article;
  /** Solo si existe, para declarar hreflang únicamente cuando hay traducción. */
  translation?: Article;
}

export async function getArticleView(
  repository: ArticleRepository,
  slug: string,
  locale: ArticleLocale,
): Promise<ArticleView | undefined> {
  const articles = await repository.findAll();
  const article = articles.find(
    (candidate) => candidate.slug === slug && candidate.locale === locale,
  );

  return article && { article, translation: findTranslation(article, articles) };
}
