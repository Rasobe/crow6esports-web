import { describe, expect, it } from "vitest";
import { findPage, isLive, type PageDefinition } from "./page-status";

const pages: PageDefinition[] = [
  { key: "home", route: "/", status: "live" },
  { key: "store", route: "/store", status: "soon" },
  { key: "team", route: "/team", status: "live" },
];

describe("findPage", () => {
  it("matches the home page only on the exact root path", () => {
    expect(findPage(pages, "/")?.key).toBe("home");
    expect(findPage(pages, "/unknown")).toBeUndefined();
  });

  it("matches a route and its nested paths", () => {
    expect(findPage(pages, "/store")?.key).toBe("store");
    expect(findPage(pages, "/store/crow6-jersey-2025")?.key).toBe("store");
  });

  it("does not match a different route that shares a prefix", () => {
    expect(findPage(pages, "/storefront")).toBeUndefined();
    expect(findPage(pages, "/teams")).toBeUndefined();
  });

  it("prefers the most specific route", () => {
    const nested: PageDefinition[] = [
      ...pages,
      { key: "store-product", route: "/store/special", status: "live" },
    ];

    expect(findPage(nested, "/store/special")?.key).toBe("store-product");
    expect(findPage(nested, "/store/other")?.key).toBe("store");
  });
});

describe("isLive", () => {
  it("is true only for live pages", () => {
    expect(isLive(pages[0]!)).toBe(true);
    expect(isLive(pages[1]!)).toBe(false);
  });
});
