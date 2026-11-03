import { describe, expect, it } from "vitest";
import { getSitemapPaths } from "./get-sitemap-paths";

const liveRoutes = ["/", "/team", "/news"];

describe("getSitemapPaths", () => {
  it("leaves the news page out while it has no articles", () => {
    expect(getSitemapPaths({ liveRoutes, newsRoute: "/news", articleSlugs: [] })).toEqual([
      "/",
      "/team",
    ]);
  });

  it("lists every article when there are some", () => {
    expect(getSitemapPaths({ liveRoutes, newsRoute: "/news", articleSlugs: ["season-2"] })).toEqual(
      ["/", "/team", "/news", "/news/season-2"],
    );
  });

  it("does not list articles when the news page is not live", () => {
    expect(
      getSitemapPaths({ liveRoutes: ["/"], newsRoute: "/news", articleSlugs: ["season-2"] }),
    ).toEqual(["/"]);
  });
});
