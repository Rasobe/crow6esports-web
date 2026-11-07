import { describe, expect, it } from "vitest";
import { estimateReadingTime, findTranslation, lastModified, type Article } from "./article";

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

describe("estimateReadingTime", () => {
  it("is never below one minute", () => {
    expect(estimateReadingTime("")).toBe(1);
    expect(estimateReadingTime("pocas palabras")).toBe(1);
  });

  it("rounds up at 200 words per minute", () => {
    expect(estimateReadingTime("palabra ".repeat(201))).toBe(2);
  });
});

describe("lastModified", () => {
  it("is the update date, or the publication date without one", () => {
    const date = new Date("2026-11-01T00:00:00Z");
    const updated = new Date("2026-11-05T00:00:00Z");

    expect(lastModified(article({ date }))).toBe(date);
    expect(lastModified(article({ date, updated }))).toBe(updated);
  });
});

describe("findTranslation", () => {
  const es = article({ slug: "hola", locale: "es", translationSlug: "hello" });
  const en = article({ slug: "hello", locale: "en" });

  it("follows the link declared by the article", () => {
    expect(findTranslation(es, [es, en])).toBe(en);
  });

  it("also works when only the other side declares the link", () => {
    const reverse = article({ slug: "hello", locale: "en", translationSlug: "hola" });
    const plain = article({ slug: "hola", locale: "es" });

    expect(findTranslation(plain, [plain, reverse])).toBe(reverse);
    expect(findTranslation(reverse, [plain, reverse])).toBe(plain);
  });

  it("has no translation when nothing links the two", () => {
    expect(
      findTranslation(article({ slug: "a" }), [article({ slug: "b", locale: "en" })]),
    ).toBeUndefined();
  });

  it("ignores a link to a missing article or to the same language", () => {
    const broken = article({ slug: "a", translationSlug: "no-existe" });
    const sameLanguage = article({ slug: "b", translationSlug: "c" });

    expect(findTranslation(broken, [broken])).toBeUndefined();
    expect(findTranslation(sameLanguage, [sameLanguage, article({ slug: "c" })])).toBeUndefined();
  });
});
