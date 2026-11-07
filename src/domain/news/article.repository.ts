import type { Article } from "./article";

export interface ArticleRepository {
  /** Todos los artículos de todos los idiomas, sin orden. */
  findAll(): Promise<Article[]>;
}
