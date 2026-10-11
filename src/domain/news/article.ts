export type Article = {
  title: string;
  slug: string;
  excerpt: string;
  date: Date;
  author: string;
  cover: string;
  tags: string[];
  readingTime: number;
};

const WORDS_PER_MINUTE = 200;

export function estimateReadingTime(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
