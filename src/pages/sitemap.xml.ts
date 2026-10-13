import type { APIRoute } from "astro";
import { SITE_URL } from "astro:env/server";
import { LIVE_ROUTES } from "@config/pages";
import { ROUTES } from "@config/routes";
import { LOCALES, localizePath } from "@/ui/i18n";

const CHANGE_FREQUENCY = "weekly";

export const GET: APIRoute = () => {
  const lastModified = new Date().toISOString();

  const entries = LOCALES.flatMap((locale) =>
    LIVE_ROUTES.map((route) => {
      const priority = route === ROUTES.home ? "1.0" : "0.8";
      return `  <url><loc>${SITE_URL}${localizePath(locale, route)}</loc><lastmod>${lastModified}</lastmod><changefreq>${CHANGE_FREQUENCY}</changefreq><priority>${priority}</priority></url>`;
    }),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
