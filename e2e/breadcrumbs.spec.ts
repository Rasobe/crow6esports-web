import { expect, test, type Page } from "@playwright/test";
import { hasNews, readNewsFiles } from "./support/news-content";

const ORIGIN = "https://crow6esports.com";
const NEWS_LABEL = { es: "Noticias", en: "News" } as const;

type Crumb = { position: number; name: string; item: string };

const breadcrumbsOf = async (page: Page): Promise<Crumb[] | undefined> =>
  page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) =>
      scripts
        .map((script) => JSON.parse(script.textContent ?? ""))
        .find((block) => block["@type"] === "BreadcrumbList"),
    )
    .then((list) => list?.itemListElement);

for (const locale of ["es", "en"] as const) {
  test(`the ${locale} news list has a breadcrumb from the home`, async ({ page }) => {
    test.skip(!hasNews(locale), "Sin artículos en este idioma");
    await page.goto(`/${locale}/news`);

    expect(await breadcrumbsOf(page)).toMatchObject([
      { position: 1, name: "Crow 6 eSports", item: `${ORIGIN}/${locale}` },
      { position: 2, name: NEWS_LABEL[locale], item: `${ORIGIN}/${locale}/news` },
    ]);
  });
}

test.describe("article breadcrumbs", () => {
  const articles = readNewsFiles();
  test.skip(articles.length === 0, "Sin artículos en content/news");

  for (const article of articles) {
    const locale = article.locale as keyof typeof NEWS_LABEL;

    test(`${locale}/${article.slug} goes home › news › article`, async ({ page }) => {
      await page.goto(`/${locale}/news/${article.slug}`);

      expect(await breadcrumbsOf(page)).toMatchObject([
        { position: 1, name: "Crow 6 eSports", item: `${ORIGIN}/${locale}` },
        { position: 2, name: NEWS_LABEL[locale], item: `${ORIGIN}/${locale}/news` },
        { position: 3, name: article.title, item: `${ORIGIN}/${locale}/news/${article.slug}` },
      ]);
    });
  }
});

// Las rutas son en inglés y buena parte del público lee en español: sin el rastro,
// Google enseña "es \u203a team" en vez de "Plantilla".
const SECTIONS = [
  { route: "/team", label: { es: "Plantilla", en: "Team" } },
  { route: "/coaching", label: { es: "Coaching", en: "Coaching" } },
  { route: "/store", label: { es: "Tienda", en: "Store" } },
  { route: "/about-us", label: { es: "Sobre nosotros", en: "About us" } },
  { route: "/tryouts", label: { es: "Tryouts", en: "Tryouts" } },
] as const;

for (const locale of ["es", "en"] as const) {
  for (const { route, label } of SECTIONS) {
    test(`${locale}${route} names its section in the breadcrumb`, async ({ page }) => {
      await page.goto(`/${locale}${route}`);

      expect(await breadcrumbsOf(page)).toMatchObject([
        { position: 1, name: "Crow 6 eSports", item: `${ORIGIN}/${locale}` },
        { position: 2, name: label[locale], item: `${ORIGIN}/${locale}${route}` },
      ]);
    });
  }
}

test("the home is the root, so it carries no breadcrumb", async ({ page }) => {
  for (const path of ["/es", "/en"]) {
    await page.goto(path);
    expect(await breadcrumbsOf(page), path).toBeUndefined();
  }
});
