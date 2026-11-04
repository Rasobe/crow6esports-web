import { expect, test, type Page } from "@playwright/test";
import { COACHING, LAUNCH_PRICE_ENDS } from "../config/coaching";
import { getCoachingPricing } from "../src/application/coaching/get-coaching-pricing";

const ORIGIN = "https://crow6esports.com";
const PUBLIC_ROUTES = ["", "/team", "/coaching", "/store", "/about-us", "/tryouts"];

const meta = (page: Page, selector: string) =>
  page.locator(selector).first().getAttribute("content");

for (const locale of ["es", "en"]) {
  test.describe(`head of /${locale}`, () => {
    for (const route of PUBLIC_ROUTES) {
      test(`${route || "home"} has a unique, well sized title and description`, async ({
        page,
      }) => {
        await page.goto(`/${locale}${route}`);

        const title = await page.title();
        const description = await meta(page, 'meta[name="description"]');
        expect(title.length).toBeLessThanOrEqual(60);
        expect(title).toContain("Crow 6 eSports");
        expect(title).not.toMatch(/\b(Inicio|Home)\b/);
        expect(description?.length).toBeGreaterThanOrEqual(120);
        expect(description?.length).toBeLessThanOrEqual(155);
        await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
        expect(await meta(page, 'meta[property="og:title"]')).toBe(title);
      });
    }

    test("describes the share image and uses the locale's language", async ({ page }) => {
      await page.goto(`/${locale}`);

      const alt = await meta(page, 'meta[property="og:image:alt"]');
      expect(alt).toBeTruthy();
      expect(alt).not.toBe(await page.title());
      expect(await meta(page, 'meta[name="twitter:image:alt"]')).toBe(alt);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
    });
  });
}

test("/en has its whole head in English", async ({ page }) => {
  await page.goto("/en");

  await expect(page).toHaveTitle("Crow 6 eSports · Rocket League Organization");
  expect(await meta(page, 'meta[name="description"]')).toMatch(/^Competitive Rocket League/);
  expect(await meta(page, 'meta[property="og:locale"]')).toBe("en_GB");
  expect(await meta(page, 'meta[property="og:image:alt"]')).toMatch(/cars/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${ORIGIN}/en`);
});

test("the Spanish home uses its own title", async ({ page }) => {
  await page.goto("/es");

  await expect(page).toHaveTitle("Crow 6 eSports · Organización de Rocket League");
  expect(await meta(page, 'meta[name="description"]')).toMatch(/^Organización competitiva/);
});

test("the home describes the team and the website as valid JSON-LD", async ({ page }) => {
  await page.goto("/es");

  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) => scripts.map((script) => JSON.parse(script.textContent ?? "")));
  const team = blocks.find((block) => block["@type"] === "SportsTeam");
  const website = blocks.find((block) => block["@type"] === "WebSite");

  expect(team).toMatchObject({
    name: "Crow 6 eSports",
    alternateName: ["Crow6", "Crow 6", "C6 eSports"],
    location: { "@type": "PostalAddress", addressLocality: "Huesca", addressCountry: "ES" },
  });
  expect(team.description).toBeTruthy();
  expect(team.sameAs.length).toBeGreaterThan(0);
  expect(website).toMatchObject({
    name: "Crow 6 eSports",
    alternateName: ["Crow6", "Crow 6"],
    url: ORIGIN,
  });
});

test("keeps only the empty news page out of search engines", async ({ page }) => {
  await page.goto("/es/news");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("the coaching JSON-LD and home banner use the current prices from the config", async ({
  page,
}) => {
  const pricing = getCoachingPricing(COACHING.plans, LAUNCH_PRICE_ENDS);

  await page.goto("/es/coaching");
  const service = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) => scripts.map((s) => JSON.parse(s.textContent ?? ""))[0]);
  expect(service.offers.lowPrice).toBe(Math.min(...pricing.currentPrices));
  expect(service.offers.highPrice).toBe(Math.max(...pricing.currentPrices));

  await page.goto("/es");
  await expect(page.locator(".coaching-banner__from")).toContainText(
    new RegExp(`Individual desde\\s*${pricing.startingPrice.individual}\\s€`),
  );
});

test("serves a sitemap with lastmod, hreflang alternates and the public domain only", async ({
  request,
}) => {
  const response = await request.get("/sitemap.xml");
  const xml = await response.text();

  expect(response.status()).toBe(200);
  expect(xml).toContain("<lastmod>");
  expect(xml).toContain('hreflang="es"');
  expect(xml).toContain('hreflang="en"');
  expect(xml).toContain('hreflang="x-default"');
  expect(xml).not.toContain("/news");

  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc);
  expect(locs.length).toBeGreaterThan(0);
  for (const loc of locs) expect(loc.startsWith(`${ORIGIN}/`)).toBe(true);
  expect(xml).not.toMatch(/localhost|vercel\.app/);
});

test("keeps the real figures in the page until their counters scroll into view", async ({
  page,
}) => {
  await page.goto("/es");
  await page.waitForLoadState("networkidle");

  const figure = page.locator(".coaching-banner__figure-value [data-count-to]").first();
  await expect(figure).not.toBeInViewport();
  await expect(figure).not.toHaveText("0");
});
