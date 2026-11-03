import { describe, expect, it } from "vitest";
import type { PageDefinition } from "@/domain/site/page-status";
import { resolveLocale, resolveRequest } from "./resolve-request";

const pages: PageDefinition<"home" | "team" | "store">[] = [
  { key: "home", route: "/", status: "live" },
  { key: "team", route: "/team", status: "live" },
  { key: "store", route: "/store", status: "soon" },
];

const route = (pathname: string, overrides: { localeParam?: string; maintenance?: boolean } = {}) =>
  resolveRequest({
    pathname,
    localeParam: overrides.localeParam,
    maintenance: overrides.maintenance ?? false,
    pages,
  });

describe("resolveLocale", () => {
  it("takes the locale from the URL when it has one", () => {
    expect(resolveLocale("/en/team", "es-ES")).toBe("en");
  });

  it("falls back to the browser language, and to Spanish without it", () => {
    expect(resolveLocale("/", "en-GB")).toBe("en");
    expect(resolveLocale("/", null)).toBe("es");
  });
});

describe("resolveRequest", () => {
  it("serves live pages as requested", () => {
    expect(route("/es/team")).toEqual({ kind: "next" });
  });

  it("redirects a trailing slash to the same page without it", () => {
    expect(route("/es/team/")).toEqual({ kind: "redirect", path: "/es/team" });
    expect(route("/es/")).toEqual({ kind: "redirect", path: "/es" });
    expect(route("/es//")).toEqual({ kind: "redirect", path: "/es" });
  });

  it("leaves the site root alone", () => {
    expect(route("/")).toEqual({ kind: "next" });
  });

  it("never touches files or API calls", () => {
    expect(route("/images/hero.webp", { maintenance: true })).toEqual({ kind: "next" });
    expect(route("/api/contact", { maintenance: true })).toEqual({ kind: "next" });
  });

  it("shows the coming soon page on every route in maintenance mode", () => {
    expect(route("/es/team", { maintenance: true })).toEqual({
      kind: "rewrite",
      path: "/coming-soon",
    });
    expect(route("/coming-soon", { maintenance: true })).toEqual({ kind: "next" });
  });

  it("sends unknown locales to the not found page", () => {
    expect(route("/fr/team", { localeParam: "fr" })).toEqual({ kind: "rewrite", path: "/404" });
  });

  it("shows the under construction notice on soon pages and their subroutes", () => {
    const expected = {
      kind: "rewrite",
      path: "/es/under-construction",
      underConstruction: "store",
    };
    expect(route("/es/store")).toEqual(expected);
    expect(route("/es/store/jersey")).toEqual(expected);
  });
});
