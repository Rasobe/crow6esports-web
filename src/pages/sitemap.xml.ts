import type { APIRoute } from "astro";
import { LIVE_ROUTES } from "@config/pages";
import { ROUTES } from "@config/routes";
import { siteConfig } from "@config/site";
import { getArticles } from "@/application/news/get-articles";
import { getSitemapPaths } from "@/application/site/get-sitemap-paths";
import { container } from "@/infrastructure/container";
import { DEFAULT_LOCALE, LOCALES, localizePath } from "@/ui/i18n";
import { buildSitemap } from "@/ui/shared/lib/sitemap";

// Fecha del despliegue (ver `define` en astro.config.ts): las páginas se publican con él
const BUILD_DATE = new Date(__BUILD_DATE__);

export const GET: APIRoute = async () => {
  const articles = await getArticles(container.articleRepository);
  const articleDates = new Map(
    articles.map((article) => [`${ROUTES.news}/${article.slug}`, article.date]),
  );
  const paths = getSitemapPaths({
    liveRoutes: LIVE_ROUTES,
    newsRoute: ROUTES.news,
    articleSlugs: articles.map((article) => article.slug),
  });

  const xml = buildSitemap({
    // Siempre el dominio público: SITE_URL puede apuntar a un entorno de desarrollo
    baseUrl: siteConfig.url,
    locales: LOCALES,
    defaultLocale: DEFAULT_LOCALE,
    localizePath,
    entries: paths.map((path) => ({
      path,
      lastmod: articleDates.get(path) ?? BUILD_DATE,
      priority: path === ROUTES.home ? "1.0" : "0.8",
    })),
  });

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
