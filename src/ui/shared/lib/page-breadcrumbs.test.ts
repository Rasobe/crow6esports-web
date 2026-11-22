import { siteConfig } from "@config/site";
import { describe, expect, it } from "vitest";
import { pageBreadcrumbs } from "./page-breadcrumbs";

type Crumb = { position: number; name: string; item: string };
const itemsOf = (data: Record<string, unknown>) => data.itemListElement as Crumb[];

describe("pageBreadcrumbs", () => {
  it("opens the trail with the localized home", () => {
    const [home] = itemsOf(pageBreadcrumbs("es", [{ name: "Plantilla", path: "/team" }]));
    expect(home).toMatchObject({ position: 1, name: siteConfig.name });
    expect(home.item).toBe(`${siteConfig.url}/es`);
  });

  it("writes each section as an absolute URL of its locale", () => {
    expect(itemsOf(pageBreadcrumbs("en", [{ name: "Team", path: "/team" }]))[1]).toMatchObject({
      position: 2,
      name: "Team",
      item: `${siteConfig.url}/en/team`,
    });
  });

  it("keeps a nested trail in order", () => {
    const items = itemsOf(
      pageBreadcrumbs("es", [
        { name: "Noticias", path: "/news" },
        { name: "Un titular", path: "/news/un-titular" },
      ]),
    );
    expect(items.map((crumb) => crumb.item)).toEqual([
      `${siteConfig.url}/es`,
      `${siteConfig.url}/es/news`,
      `${siteConfig.url}/es/news/un-titular`,
    ]);
  });
});
