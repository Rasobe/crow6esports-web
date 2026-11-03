import type { APIRoute } from "astro";
import { SITE_URL } from "astro:env/server";
import { LIVE_ROUTES } from "@config/pages";
import { ROUTES } from "@config/routes";
import { getArticles } from "@/application/news/get-articles";
import { getSitemapPaths } from "@/application/site/get-sitemap-paths";
import { container } from "@/infrastructure/container";
import { LOCALES, localizePath } from "@/ui/i18n";

const CHANGE_FREQUENCY = "weekly";

export const GET: APIRoute = async () => {
  const articles = await getArticles(container.articleRepository);
  const paths = getSitemapPaths({
    liveRoutes: LIVE_ROUTES,
    newsRoute: ROUTES.news,
    articleSlugs: articles.map((article) => article.slug),
  });

  const entries = LOCALES.flatMap((locale) =>
    paths.map((path) => {
      const priority = path === ROUTES.home ? "1.0" : "0.8";
      return `  <url><loc>${SITE_URL}${localizePath(locale, path)}</loc><changefreq>${CHANGE_FREQUENCY}</changefreq><priority>${priority}</priority></url>`;
    }),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
