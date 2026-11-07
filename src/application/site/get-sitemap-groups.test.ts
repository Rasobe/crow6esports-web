import { describe, expect, it } from "vitest";
import type { Article } from "@/domain/news/article";
import { getSitemapGroups } from "./get-sitemap-groups";

const buildDate = new Date("2026-11-06T00:00:00Z");
const liveRoutes = ["/", "/team", "/news"];

const article = (overrides: Partial<Article>): Article => ({
  slug: "slug",
  title: "Título",
  locale: "es",
  excerpt: "Resumen",
  date: new Date("2026-11-01T00:00:00Z"),
  cover: "/images/news/cover.webp",
  coverAlt: "Portada",
  readingTime: 1,
  ...overrides,
});

const groupsFor = (articles: Article[], routes = liveRoutes) =>
  getSitemapGroups({
    locales: ["es", "en"],
    liveRoutes: routes,
    newsRoute: "/news",
    homeRoute: "/",
    articles,
    buildDate,
  });

const paths = (articles: Article[], routes?: string[]) =>
  groupsFor(articles, routes).flatMap(({ versions }) =>
    versions.map(({ locale, path }) => `${locale}:${path}`),
  );

describe("getSitemapGroups without articles", () => {
  it("leaves the news page out and keeps every other page in both languages", () => {
    expect(paths([])).toEqual(["es:/", "en:/", "es:/team", "en:/team"]);
  });

  it("dates the fixed pages with the build and gives the home top priority", () => {
    const [home, team] = groupsFor([]);

    expect(home.priority).toBe("1.0");
    expect(team.priority).toBe("0.8");
    expect(home.versions.every(({ lastmod }) => lastmod === buildDate)).toBe(true);
  });
});

describe("getSitemapGroups with articles", () => {
  it("adds the news page only for the languages that have articles", () => {
    expect(paths([article({ slug: "hola", locale: "es" })])).toEqual([
      "es:/",
      "en:/",
      "es:/team",
      "en:/team",
      "es:/news",
      "es:/news/hola",
    ]);
  });

  it("lists the news page in both languages once both have articles", () => {
    const result = paths([
      article({ slug: "hola", locale: "es" }),
      article({ slug: "hello", locale: "en" }),
    ]);

    expect(result).toContain("es:/news");
    expect(result).toContain("en:/news");
  });

  it("uses the article date, or its update date when there is one, as lastmod", () => {
    const groups = groupsFor([
      article({ slug: "viejo", date: new Date("2026-10-01T00:00:00Z") }),
      article({
        slug: "retocado",
        date: new Date("2026-10-05T00:00:00Z"),
        updated: new Date("2026-11-03T00:00:00Z"),
      }),
    ]);
    const lastmod = (path: string) =>
      groups.flatMap(({ versions }) => versions).find((version) => version.path === path)?.lastmod;

    expect(lastmod("/news/viejo")).toEqual(new Date("2026-10-01T00:00:00Z"));
    expect(lastmod("/news/retocado")).toEqual(new Date("2026-11-03T00:00:00Z"));
  });

  it("keeps an article without translation as a single version", () => {
    const group = groupsFor([article({ slug: "solo-es" })]).find(({ versions }) =>
      versions.some(({ path }) => path === "/news/solo-es"),
    );

    expect(group?.versions).toHaveLength(1);
  });

  it("joins an article with its translation, declared by either side", () => {
    const es = article({ slug: "hola", locale: "es", translationSlug: "hello" });
    const en = article({ slug: "hello", locale: "en" });

    for (const articles of [
      [es, en],
      [en, es],
    ]) {
      const group = groupsFor(articles).find(
        ({ versions }) => versions.length === 2 && versions[0].path.startsWith("/news/"),
      );

      expect(group?.versions.map(({ locale, path }) => `${locale}:${path}`).sort()).toEqual([
        "en:/news/hello",
        "es:/news/hola",
      ]);
    }
    expect(
      paths([
        article({ slug: "hola" }),
        article({ slug: "hello", locale: "en", translationSlug: "hola" }),
      ]).filter((p) => p.includes("/news/")),
    ).toHaveLength(2);
  });

  it("ignores a translation link that points to the same language", () => {
    const groups = groupsFor([
      article({ slug: "uno", translationSlug: "dos" }),
      article({ slug: "dos" }),
    ]).filter(({ versions }) => versions[0].path.startsWith("/news/"));

    expect(groups).toHaveLength(2);
    expect(groups.every(({ versions }) => versions.length === 1)).toBe(true);
  });

  it("does not list articles when the news page is not live", () => {
    expect(paths([article({})], ["/"])).toEqual(["es:/", "en:/"]);
  });
});
