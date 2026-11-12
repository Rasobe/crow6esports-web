import type { Article } from "@/domain/news/article";
import { LOCALES, type Locale } from "@/ui/i18n";

/**
 * A dónde lleva el selector de idioma desde un artículo (rutas sin prefijo de idioma): el
 * propio artículo en su idioma, su traducción si existe y, si no, el listado de noticias.
 * Los slugs son distintos en cada idioma, así que nunca vale reutilizar el del artículo.
 */
export function articleLocalePaths(
  article: Pick<Article, "slug" | "locale">,
  translation: Pick<Article, "slug" | "locale"> | undefined,
  newsRoute: string,
): Record<Locale, string> {
  const pathFor = (locale: Locale) => {
    if (locale === article.locale) return `${newsRoute}/${article.slug}`;
    if (translation?.locale === locale) return `${newsRoute}/${translation.slug}`;
    return newsRoute;
  };

  return Object.fromEntries(LOCALES.map((locale) => [locale, pathFor(locale)])) as Record<
    Locale,
    string
  >;
}
