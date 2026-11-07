import { describe, expect, it } from "vitest";
import { buildSitemap, type SitemapGroup } from "./sitemap";

type Locale = "es" | "en";

const localizePath = (locale: Locale, path: string) =>
  path === "/" ? `/${locale}` : `/${locale}${path}`;

const page = (path: string, lastmod: string, priority: string): SitemapGroup<Locale> => ({
  priority,
  versions: (["es", "en"] as const).map((locale) => ({
    locale,
    path,
    lastmod: new Date(lastmod),
  })),
});

const build = (groups: SitemapGroup<Locale>[]) =>
  buildSitemap({ baseUrl: "https://crow6esports.com", defaultLocale: "es", groups, localizePath });

const xml = build([
  page("/", "2026-11-04T10:00:00Z", "1.0"),
  page("/team", "2026-10-01T10:00:00Z", "0.8"),
]);

describe("buildSitemap", () => {
  it("lists one URL per locale and page, with its lastmod", () => {
    expect(xml.match(/<url>/g)).toHaveLength(4);
    expect(xml).toContain("<loc>https://crow6esports.com/en/team</loc>");
    expect(xml).toContain("<lastmod>2026-11-04</lastmod>");
    expect(xml).toContain("<lastmod>2026-10-01</lastmod>");
  });

  it("links every language version and the x-default from each URL", () => {
    const home = xml.split("<url>")[1];
    expect(home).toContain(
      '<xhtml:link rel="alternate" hreflang="es" href="https://crow6esports.com/es"/>',
    );
    expect(home).toContain(
      '<xhtml:link rel="alternate" hreflang="en" href="https://crow6esports.com/en"/>',
    );
    expect(home).toContain(
      '<xhtml:link rel="alternate" hreflang="x-default" href="https://crow6esports.com/es"/>',
    );
  });

  it("declares the xhtml namespace and only uses the production origin", () => {
    expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
    const hosts = [...xml.matchAll(/https?:\/\/[^/"<]+/g)].map(([host]) => host);
    expect(new Set(hosts)).toEqual(
      new Set(["https://crow6esports.com", "http://www.sitemaps.org", "http://www.w3.org"]),
    );
  });

  it("gives a single version no hreflang alternatives at all", () => {
    const single = build([
      {
        priority: "0.6",
        versions: [
          { locale: "es", path: "/news/solo-es", lastmod: new Date("2026-11-07T00:00:00Z") },
        ],
      },
    ]);

    expect(single.match(/<url>/g)).toHaveLength(1);
    expect(single).not.toContain("xhtml:link");
  });

  it("keeps each version's own lastmod when a page is translated", () => {
    const translated = build([
      {
        priority: "0.6",
        versions: [
          { locale: "es", path: "/news/hola", lastmod: new Date("2026-11-09T00:00:00Z") },
          { locale: "en", path: "/news/hello", lastmod: new Date("2026-11-07T00:00:00Z") },
        ],
      },
    ]);
    const [, spanish, english] = translated.split("<url>");

    expect(spanish).toContain("<loc>https://crow6esports.com/es/news/hola</loc>");
    expect(spanish).toContain("<lastmod>2026-11-09</lastmod>");
    expect(english).toContain("<loc>https://crow6esports.com/en/news/hello</loc>");
    expect(english).toContain("<lastmod>2026-11-07</lastmod>");
    expect(english).toContain('hreflang="es" href="https://crow6esports.com/es/news/hola"');
    expect(english).toContain('hreflang="x-default" href="https://crow6esports.com/es/news/hola"');
  });
});
