import { ROUTES } from "@config/routes";
import { siteConfig } from "@config/site";
import { getArticles } from "@/application/news/get-articles";
import { container } from "@/infrastructure/container";
import { createTranslator, localizePath, type Locale } from "@/ui/i18n";
import { buildRssFeed } from "./rss";

const absolute = (path: string) => `${siteConfig.url}${path}`;

/**
 * La respuesta RSS de un idioma, compartida por /rss.xml y /[locale]/rss.xml.
 * `feedPath` es la ruta desde la que se sirve, porque RSS pide que el feed se declare a sí mismo.
 */
export async function buildLocaleFeed(locale: Locale, feedPath: string): Promise<Response> {
  const t = createTranslator(locale, "news.seo");
  const articles = await getArticles(container.articleRepository, locale);

  const xml = buildRssFeed({
    title: `${siteConfig.name} · ${t("title")}`,
    description: t("description"),
    siteUrl: absolute(localizePath(locale, ROUTES.news)),
    feedUrl: absolute(feedPath),
    language: locale,
    items: articles.map((article) => ({
      title: article.title,
      description: article.excerpt,
      url: absolute(localizePath(locale, `${ROUTES.news}/${article.slug}`)),
      published: article.updated ?? article.date,
      image: absolute(article.cover),
    })),
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
