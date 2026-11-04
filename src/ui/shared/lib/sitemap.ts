export interface SitemapEntry {
  /** Ruta sin prefijo de idioma ("/" para la home). */
  path: string;
  /** Última modificación, en ISO 8601 (solo la fecha basta). */
  lastmod: Date;
  priority: string;
}

interface SitemapInput<L extends string> {
  baseUrl: string;
  locales: readonly L[];
  defaultLocale: L;
  entries: readonly SitemapEntry[];
  localizePath: (locale: L, path: string) => string;
}

const CHANGE_FREQUENCY = "weekly";

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const formatDay = (date: Date) => date.toISOString().slice(0, 10);

/**
 * Sitemap con una URL por idioma y página. Cada una declara con `xhtml:link` todas las
 * versiones (incluida ella misma) y la x-default, como pide Google para hreflang.
 */
export function buildSitemap<L extends string>({
  baseUrl,
  locales,
  defaultLocale,
  entries,
  localizePath,
}: SitemapInput<L>): string {
  const urlOf = (locale: L, path: string) => escapeXml(`${baseUrl}${localizePath(locale, path)}`);

  const urls = entries.flatMap(({ path, lastmod, priority }) => {
    const alternates = [
      ...locales.map(
        (locale) =>
          `    <xhtml:link rel="alternate" hreflang="${locale}" href="${urlOf(locale, path)}"/>`,
      ),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${urlOf(defaultLocale, path)}"/>`,
    ].join("\n");

    return locales.map(
      (locale) =>
        `  <url>\n    <loc>${urlOf(locale, path)}</loc>\n    <lastmod>${formatDay(lastmod)}</lastmod>\n    <changefreq>${CHANGE_FREQUENCY}</changefreq>\n    <priority>${priority}</priority>\n${alternates}\n  </url>`,
    );
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
}
