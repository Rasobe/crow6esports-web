import { describe, expect, it } from "vitest";
import { buildSitemap } from "./sitemap";

const localizePath = (locale: "es" | "en", path: string) =>
  path === "/" ? `/${locale}` : `/${locale}${path}`;

const xml = buildSitemap({
  baseUrl: "https://crow6esports.com",
  locales: ["es", "en"],
  defaultLocale: "es",
  entries: [
    { path: "/", lastmod: new Date("2026-11-04T10:00:00Z"), priority: "1.0" },
    { path: "/team", lastmod: new Date("2026-10-01T10:00:00Z"), priority: "0.8" },
  ],
  localizePath,
});

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
});
