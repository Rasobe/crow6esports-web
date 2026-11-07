export type ArticleLocale = "es" | "en";

export type Article = {
  /** Nombre del fichero: va en la URL y es único entre todos los idiomas. */
  slug: string;
  title: string;
  locale: ArticleLocale;
  /** Se usa como meta description. */
  excerpt: string;
  date: Date;
  /** Última actualización relevante, si el artículo se retocó después de publicarlo. */
  updated?: Date;
  cover: string;
  coverAlt: string;
  /** Slug del mismo artículo en el otro idioma, si se enlazó. */
  translationSlug?: string;
  readingTime: number;
};

const WORDS_PER_MINUTE = 200;

export function estimateReadingTime(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/** Fecha de la última modificación real: la de actualización o, si no hay, la de publicación. */
export const lastModified = (article: Article): Date => article.updated ?? article.date;

/**
 * La traducción de un artículo, si existe. El enlace vale en ambos sentidos (basta con que
 * uno de los dos lo declare) porque hreflang solo es válido si las dos páginas se apuntan.
 */
export function findTranslation(
  article: Article,
  articles: readonly Article[],
): Article | undefined {
  const isOtherLanguage = (candidate: Article) => candidate.locale !== article.locale;

  const declared = article.translationSlug
    ? articles.find((candidate) => candidate.slug === article.translationSlug)
    : undefined;
  if (declared && isOtherLanguage(declared)) return declared;

  return articles.find(
    (candidate) => isOtherLanguage(candidate) && candidate.translationSlug === article.slug,
  );
}
