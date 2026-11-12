export interface SitemapVersion<L extends string> {
  locale: L;
  /** Ruta sin prefijo de idioma ("/" para la home). */
  path: string;
  /** Se omite cuando no hay una fecha fiable de último cambio. */
  lastmod?: Date;
}

/**
 * Versiones de una misma página en distintos idiomas. Se enlazan entre sí con hreflang; un
 * grupo con una sola versión (un artículo sin traducción) no declara ninguna alternativa.
 */
export interface SitemapGroup<L extends string> {
  priority: string;
  versions: readonly SitemapVersion<L>[];
}

interface SitemapInput<L extends string> {
  baseUrl: string;
  defaultLocale: L;
  groups: readonly SitemapGroup<L>[];
  localizePath: (locale: L, path: string) => string;
}

const CHANGE_FREQUENCY = "weekly";

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const formatDay = (date: Date) => date.toISOString().slice(0, 10);

/**
 * Sitemap con una URL por versión. Cuando una página tiene varias, cada URL declara con
 * `xhtml:link` todas las versiones (incluida ella misma) y la x-default, como pide Google.
 */
export function buildSitemap<L extends string>({
  baseUrl,
  defaultLocale,
  groups,
  localizePath,
}: SitemapInput<L>): string {
  const urlOf = ({ locale, path }: SitemapVersion<L>) =>
    escapeXml(`${baseUrl}${localizePath(locale, path)}`);

  const urls = groups.flatMap(({ priority, versions }) => {
    const defaultVersion = versions.find((version) => version.locale === defaultLocale);
    const alternates =
      versions.length < 2
        ? ""
        : `\n${[
            ...versions.map(
              (version) =>
                `    <xhtml:link rel="alternate" hreflang="${version.locale}" href="${urlOf(version)}"/>`,
            ),
            ...(defaultVersion
              ? [
                  `    <xhtml:link rel="alternate" hreflang="x-default" href="${urlOf(defaultVersion)}"/>`,
                ]
              : []),
          ].join("\n")}`;

    const lastmodOf = ({ lastmod }: SitemapVersion<L>) =>
      lastmod ? `\n    <lastmod>${formatDay(lastmod)}</lastmod>` : "";

    return versions.map(
      (version) =>
        `  <url>\n    <loc>${urlOf(version)}</loc>${lastmodOf(version)}\n    <changefreq>${CHANGE_FREQUENCY}</changefreq>\n    <priority>${priority}</priority>${alternates}\n  </url>`,
    );
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
}
