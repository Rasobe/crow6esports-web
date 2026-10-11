import type { Article } from "./article";

export interface ArticleRepository {
  findAll(): Promise<Article[]>;
  findBySlug(slug: string): Promise<Article | undefined>;
}
