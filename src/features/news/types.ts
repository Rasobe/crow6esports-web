export type ArticleFrontmatter = {
  title: string;
  slug: string;
  excerpt: string;
  date: string; // ISO 8601
  author: string;
  cover: string;
  tags: string[];
};

export type Article = ArticleFrontmatter & {
  readingTime: number; // minutes
};
