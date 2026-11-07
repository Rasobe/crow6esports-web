import type { APIRoute } from "astro";
import { LIVE_ROUTES } from "@config/pages";
import { ROUTES } from "@config/routes";
import { siteConfig } from "@config/site";
import { getAllArticles } from "@/application/news/get-articles";
import { getSitemapGroups } from "@/application/site/get-sitemap-groups";
import { container } from "@/infrastructure/container";
import { DEFAULT_LOCALE, LOCALES, localizePath } from "@/ui/i18n";
import { buildSitemap } from "@/ui/shared/lib/sitemap";

// Fecha del despliegue (ver `define` en astro.config.ts): las páginas se publican con él
const BUILD_DATE = new Date(__BUILD_DATE__);

export const GET: APIRoute = async () => {
  const articles = await getAllArticles(container.articleRepository);

  const xml = buildSitemap({
    // Siempre el dominio público: SITE_URL puede apuntar a un entorno de desarrollo
    baseUrl: siteConfig.url,
    defaultLocale: DEFAULT_LOCALE,
    localizePath,
    groups: getSitemapGroups({
      locales: LOCALES,
      liveRoutes: LIVE_ROUTES,
      newsRoute: ROUTES.news,
      homeRoute: ROUTES.home,
      articles,
      buildDate: BUILD_DATE,
    }),
  });

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
