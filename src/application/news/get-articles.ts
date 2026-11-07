import { findTranslation, type Article, type ArticleLocale } from "@/domain/news/article";
import type { ArticleRepository } from "@/domain/news/article.repository";

const byNewest = (a: Article, b: Article) => b.date.getTime() - a.date.getTime();

/** Todos los artículos, de todos los idiomas, del más reciente al más antiguo. */
export async function getAllArticles(repository: ArticleRepository): Promise<Article[]> {
  return [...(await repository.findAll())].sort(byNewest);
}

/** Los artículos de un idioma, del más reciente al más antiguo. */
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

/** El artículo de ese idioma con su traducción, o undefined si no existe en ese idioma. */
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
