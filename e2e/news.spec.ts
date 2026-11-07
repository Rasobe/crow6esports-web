import { expect, test, type Page } from "@playwright/test";
import { readNewsFiles } from "./support/news-content";

const ORIGIN = "https://crow6esports.com";

const articles = readNewsFiles();

const hasTranslation = (article: (typeof articles)[number]) =>
  articles.some(
    (other) =>
      other.locale !== article.locale &&
      (article.translationSlug === other.slug || other.translationSlug === article.slug),
  );

const translated = articles.find(hasTranslation);
const standalone = articles.find((article) => !hasTranslation(article));

const attr = (page: Page, selector: string, name: string) =>
  page.locator(selector).first().getAttribute(name);

const jsonLd = (page: Page) =>
  page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) => scripts.map((script) => JSON.parse(script.textContent ?? "")));

test.describe("news articles", () => {
  test.skip(articles.length === 0, "Sin artículos en content/news (por ejemplo en CI)");

  test("lists the articles of the language, newest first, and is indexable", async ({ page }) => {
    const first = articles.find((article) => article.locale === "es");
    test.skip(!first, "No hay artículos en español");

    await page.goto("/es/news");

    await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: new RegExp(first!.title.replace(/[[\]]/g, "\\$&")) }),
    ).toBeVisible();
    await expect(page.getByText("news.meta.description")).toHaveCount(0);
  });

  test("describes an article with its own title, description, canonical and Open Graph", async ({
    page,
  }) => {
    const article = translated ?? articles[0];
    await page.goto(`/${article.locale}/news/${article.slug}`);

    const canonical = `${ORIGIN}/${article.locale}/news/${article.slug}`;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", canonical);
    await expect(page).toHaveTitle(new RegExp(article.title.replace(/[[\]]/g, "\\$&")));
    expect(await attr(page, 'meta[name="description"]', "content")).toBeTruthy();
    expect((await attr(page, 'meta[name="description"]', "content"))!.length).toBeLessThanOrEqual(
      160,
    );
    expect(await attr(page, 'meta[property="og:type"]', "content")).toBe("article");
    expect(await attr(page, 'meta[property="og:url"]', "content")).toBe(canonical);
    expect(await attr(page, 'meta[property="og:image"]', "content")).toMatch(
      new RegExp(`^${ORIGIN}/images/news/`),
    );
    expect(await attr(page, 'meta[property="og:image:alt"]', "content")).toBeTruthy();
    await expect(page.getByRole("img", { name: /.+/ }).first()).toBeVisible();
  });

  test("includes a schema.org Article in JSON-LD", async ({ page }) => {
    const article = articles[0];
    await page.goto(`/${article.locale}/news/${article.slug}`);

    const data = (await jsonLd(page)).find((entry) => entry["@type"] === "Article");

    expect(data).toBeDefined();
    expect(data.headline).toBeTruthy();
    expect(data.description).toBeTruthy();
    expect(data.image[0]).toMatch(new RegExp(`^${ORIGIN}/`));
    expect(Number.isNaN(Date.parse(data.datePublished))).toBe(false);
    expect(Number.isNaN(Date.parse(data.dateModified))).toBe(false);
    expect(data.author.name).toBe("Crow 6 eSports");
    expect(data.publisher.logo.url).toMatch(new RegExp(`^${ORIGIN}/`));
    expect(data.inLanguage).toBe(article.locale);
  });

  test("declares hreflang only when the article has a translation", async ({ page }) => {
    test.skip(!translated, "No hay ningún artículo con traducción");
    await page.goto(`/${translated!.locale}/news/${translated!.slug}`);

    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveCount(1);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);
  });

  test("leaves hreflang out of an article without translation", async ({ page }) => {
    test.skip(!standalone, "Todos los artículos tienen traducción");
    await page.goto(`/${standalone!.locale}/news/${standalone!.slug}`);

    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0);
  });

  test("does not serve an article under the other language", async ({ page }) => {
    const article = articles[0];
    const other = article.locale === "es" ? "en" : "es";
    const response = await page.goto(`/${other}/news/${article.slug}`);

    expect(response?.status()).toBe(404);
  });

  test("lists articles in the sitemap with their real lastmod", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();

    for (const article of articles) {
      const block = xml
        .split("<url>")
        .find((url) => url.includes(`/${article.locale}/news/${article.slug}<`));
      expect(block, `${article.slug} falta en el sitemap`).toBeDefined();
      expect(block).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
    }
  });
});

test.describe("Keystatic stays private", () => {
  test("is disallowed in robots.txt and absent from the sitemap", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    const sitemap = await (await request.get("/sitemap.xml")).text();

    expect(robots).toContain("Disallow: /keystatic");
    expect(robots).toContain("Disallow: /api/keystatic");
    expect(sitemap).not.toContain("keystatic");
  });

  test("is served with noindex and no cache", async ({ request }) => {
    for (const path of ["/keystatic", "/api/keystatic/tree"]) {
      const response = await request.get(path);

      expect(response.headers()["x-robots-tag"], path).toContain("noindex");
      expect(response.headers()["cache-control"], path).toContain("no-store");
    }
  });

  test("is not linked from the public pages", async ({ page }) => {
    for (const path of ["/es", "/es/news", "/es/tryouts", "/en/store"]) {
      await page.goto(path);
      await expect(page.locator('a[href*="keystatic"]')).toHaveCount(0);
    }
  });

  test("does not get in the way of the /admin login", async ({ page }) => {
    await page.goto("/admin");

    await expect(page).toHaveURL(/\/admin\/login$/);
    await expect(page.getByRole("heading", { name: "Acceso al panel" })).toBeVisible();
  });
});
