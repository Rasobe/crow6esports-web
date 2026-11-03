interface SitemapInput {
  liveRoutes: readonly string[];
  newsRoute: string;
  articleSlugs: readonly string[];
}

/**
 * Rutas que se publican en el sitemap, sin prefijo de idioma. Noticias solo entra si hay
 * artículos (vacía no aporta nada al buscador), y entonces con cada artículo.
 */
export function getSitemapPaths({ liveRoutes, newsRoute, articleSlugs }: SitemapInput): string[] {
  if (articleSlugs.length === 0) return liveRoutes.filter((route) => route !== newsRoute);
  if (!liveRoutes.includes(newsRoute)) return [...liveRoutes];
  return [...liveRoutes, ...articleSlugs.map((slug) => `${newsRoute}/${slug}`)];
}
