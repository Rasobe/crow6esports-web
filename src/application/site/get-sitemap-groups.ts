import { findTranslation, lastModified, type Article } from "@/domain/news/article";

interface GroupVersion<L extends string> {
  locale: L;
  path: string;
  lastmod: Date;
}

export interface SitemapPageGroup<L extends string> {
  priority: string;
  versions: GroupVersion<L>[];
}

interface SitemapInput<L extends string> {
  locales: readonly L[];
  liveRoutes: readonly string[];
  newsRoute: string;
  homeRoute: string;
  articles: readonly Article[];
  /** Fecha de las páginas fijas: la del despliegue. */
  buildDate: Date;
}

const HOME_PRIORITY = "1.0";
const PAGE_PRIORITY = "0.8";
const ARTICLE_PRIORITY = "0.6";

/**
 * Qué páginas publica el sitemap, agrupando las versiones de cada una.
 * - Las páginas fijas salen en todos los idiomas, con la fecha del despliegue.
 * - El listado de noticias de un idioma solo sale si hay artículos en ese idioma (vacío se
 *   queda en noindex y fuera).
 * - Cada artículo sale con su fecha real (actualización o publicación). Solo se enlaza con su
 *   traducción cuando existe; sin ella es una página suelta, sin hreflang.
 */
export function getSitemapGroups<L extends string>({
  locales,
  liveRoutes,
  newsRoute,
  homeRoute,
  articles,
  buildDate,
}: SitemapInput<L>): SitemapPageGroup<L>[] {
  const hasArticles = (locale: L) => articles.some((article) => article.locale === locale);
  const newsLive = liveRoutes.includes(newsRoute);

  const pages = liveRoutes.flatMap((route) => {
    const versions = locales
      .filter((locale) => route !== newsRoute || hasArticles(locale))
      .map((locale) => ({ locale, path: route, lastmod: buildDate }));

    return versions.length === 0
      ? []
      : [{ priority: route === homeRoute ? HOME_PRIORITY : PAGE_PRIORITY, versions }];
  });

  if (!newsLive) return pages;

  const done = new Set<string>();
  const articleGroups = articles.flatMap((article) => {
    if (done.has(article.slug) || !locales.includes(article.locale as L)) return [];

    const translation = findTranslation(article, articles);
    const members = translation ? [article, translation] : [article];
    for (const member of members) done.add(member.slug);

    return [
      {
        priority: ARTICLE_PRIORITY,
        versions: members.map((member) => ({
          locale: member.locale as L,
          path: `${newsRoute}/${member.slug}`,
          lastmod: lastModified(member),
        })),
      },
    ];
  });

  return [...pages, ...articleGroups];
}
