import { expect, test, type Page } from "@playwright/test";
import { readNewsFiles } from "./support/news-content";

const LOCALES = ["es", "en"] as const;
const PUBLIC_ROUTES = ["", "/team", "/coaching", "/store", "/about-us", "/tryouts", "/news"];

const articleRoutes = () =>
  readNewsFiles().map((article) => `/${article.locale}/news/${article.slug}`);

const publicPaths = () => [
  ...LOCALES.flatMap((locale) => PUBLIC_ROUTES.map((route) => `/${locale}${route}`)),
  ...articleRoutes(),
];

test.describe("images always declare an alt attribute", () => {
  for (const path of publicPaths()) {
    test(`${path} has no <img> without alt`, async ({ page }) => {
      await page.goto(path, { waitUntil: "networkidle" });

      const withoutAlt = await page
        .locator("img:not([alt])")
        .evaluateAll((images) => images.map((image) => image.getAttribute("src")));

      expect(withoutAlt).toEqual([]);
    });
  }

  test("the brand logos describe themselves in each language", async ({ page }) => {
    for (const [locale, alt] of [
      ["es", "Logo de Crow 6 eSports"],
      ["en", "Crow 6 eSports logo"],
    ] as const) {
      await page.goto(`/${locale}`, { waitUntil: "networkidle" });
      await expect(page.locator(".navbar__logo")).toHaveAttribute("alt", alt);
      await expect(page.locator(".footer__logo")).toHaveAttribute("alt", alt);
    }
  });

  test("decorative images stay out of the accessibility tree", async ({ page }) => {
    await page.goto("/es/store", { waitUntil: "networkidle" });

    const exposedEmpty = await page
      .locator('img[alt=""]:not([aria-hidden="true"])')
      .evaluateAll((images) => images.map((image) => image.getAttribute("src")));

    expect(exposedEmpty).toEqual([]);
  });
});

const hreflangs = (page: Page) =>
  page
    .locator('link[rel="alternate"][hreflang]')
    .evaluateAll((links) =>
      Object.fromEntries(
        links.map((link) => [
          link.getAttribute("hreflang"),
          new URL(link.getAttribute("href") ?? "").pathname,
        ]),
      ),
    );

test.describe("hreflang", () => {
  for (const locale of LOCALES) {
    for (const [name, route] of [
      ["home", ""],
      ["team", "/team"],
    ] as const) {
      test(`/${locale}${route} declares es, en and x-default`, async ({ page }) => {
        await page.goto(`/${locale}${route}`);

        expect(await hreflangs(page)).toEqual({
          es: `/es${route}`,
          en: `/en${route}`,
          "x-default": `/es${route}`,
        });
        expect(name).toBeTruthy();
      });
    }
  }
});

for (const locale of LOCALES) {
  test(`the ${locale} home carries exactly one JSON-LD Organization`, async ({ page }) => {
    await page.goto(`/${locale}`);

    const types = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
      scripts.flatMap((script) => {
        const data = JSON.parse(script.textContent ?? "{}");
        return (data["@graph"] ?? [data]).map((node: { "@type": string }) => node["@type"]);
      }),
    );

    expect(types.filter((type) => type === "Organization")).toHaveLength(1);
  });
}

test("headings do not glue words together between their inline blocks", async ({ page }) => {
  for (const [locale, heading] of [
    ["es", "Únete a los cuervos."],
    ["en", "Join the crows."],
  ] as const) {
    await page.goto(`/${locale}`);
    await expect(page.locator("#tryouts-banner-title")).toHaveText(heading, { ignoreCase: true });
  }
});
