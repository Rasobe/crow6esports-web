import { describe, expect, it } from "vitest";
import { shouldLoadAnalytics } from "./analytics-scope";

describe("shouldLoadAnalytics", () => {
  it.each(["/", "/es", "/en/coaching", "/es/news/some-article", "/404"])(
    "loads on the public page %s when enabled",
    (pathname) => {
      expect(shouldLoadAnalytics({ enabled: true, pathname })).toBe(true);
    },
  );

  it.each([
    "/admin",
    "/admin/",
    "/admin/login",
    "/admin/tryouts/123",
    "/ADMIN/coaching",
    "/keystatic",
    "/keystatic/branch/main",
    "/login",
    "/login/",
  ])("never loads on the private path %s", (pathname) => {
    expect(shouldLoadAnalytics({ enabled: true, pathname })).toBe(false);
  });

  it("does not load anywhere when disabled", () => {
    expect(shouldLoadAnalytics({ enabled: false, pathname: "/es" })).toBe(false);
  });

  it("does not confuse a public path that only starts like a private one", () => {
    expect(shouldLoadAnalytics({ enabled: true, pathname: "/loginless" })).toBe(true);
    expect(shouldLoadAnalytics({ enabled: true, pathname: "/administration" })).toBe(true);
  });
});
