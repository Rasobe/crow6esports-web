import { describe, expect, it } from "vitest";
import { articleLocalePaths } from "./article-locale-paths";

const es = { slug: "crow-6-vuelve", locale: "es" } as const;
const en = { slug: "crow-6-returns", locale: "en" } as const;

describe("articleLocalePaths", () => {
  it("links each language to its own slug when the article is translated", () => {
    expect(articleLocalePaths(es, en, "/news")).toEqual({
      es: "/news/crow-6-vuelve",
      en: "/news/crow-6-returns",
    });
    expect(articleLocalePaths(en, es, "/news")).toEqual({
      es: "/news/crow-6-vuelve",
      en: "/news/crow-6-returns",
    });
  });

  it("sends the other language to the news list when there is no translation", () => {
    expect(articleLocalePaths(es, undefined, "/news")).toEqual({
      es: "/news/crow-6-vuelve",
      en: "/news",
    });
  });
});
