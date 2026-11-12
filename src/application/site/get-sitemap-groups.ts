import { findTranslation, lastModified, type Article } from "@/domain/news/article";

interface GroupVersion<L extends string> {
  locale: L;
  path: string;
  /** Solo cuando hay una fecha fiable de cambio: si no, el sitemap no la declara. */
  lastmod?: Date;
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
}

const HOME_PRIORITY = "1.0";
const PAGE_PRIORITY = "0.8";
const ARTICLE_PRIORITY = "0.6";

/**
 * Qué páginas publica el sitemap, agrupando las versiones de cada una.
 * - Las páginas fijas salen en todos los idiomas sin lastmod: no hay una fecha fiable de su
 *   último cambio, y la del despliegue cambiaría en cada publicación aunque la página no
 *   cambie (Google deja de fiarse del lastmod de un sitio si no es exacto).
 * - El listado de noticias de un idioma solo sale si hay artículos en ese idioma (vacío se
 *   queda en noindex y fuera), con la fecha de su artículo más reciente.
 * - Cada artículo sale con su fecha real (actualización o publicación). Solo se enlaza con su
 *   traducción cuando existe; sin ella es una página suelta, sin hreflang.
 */
export function getSitemapGroups<L extends string>({
  locales,
  liveRoutes,
  newsRoute,
  homeRoute,
  articles,
}: SitemapInput<L>): SitemapPageGroup<L>[] {
  const articlesIn = (locale: L) => articles.filter((article) => article.locale === locale);
  const newestIn = (locale: L) =>
    new Date(Math.max(...articlesIn(locale).map((article) => lastModified(article).getTime())));
  const newsLive = liveRoutes.includes(newsRoute);

  const pages = liveRoutes.flatMap((route) => {
    const isNews = route === newsRoute;
    const versions = locales
      .filter((locale) => !isNews || articlesIn(locale).length > 0)
      .map((locale) => ({ locale, path: route, ...(isNews ? { lastmod: newestIn(locale) } : {}) }));

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
