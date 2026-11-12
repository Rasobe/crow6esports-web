import { expect, test, type Page } from "@playwright/test";
import { COACHING, LAUNCH_PRICE_ENDS } from "../config/coaching";
import { hasNews } from "./support/news-content";
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
        expect(title.length).toBeGreaterThanOrEqual(50);
        expect(title.length).toBeLessThanOrEqual(60);
        expect(title).toContain("Crow 6 eSports");
        expect(title).not.toMatch(/\b(Inicio|Home)\b/);
        expect(description?.length).toBeGreaterThanOrEqual(120);
        expect(description?.length).toBeLessThanOrEqual(160);
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

  await expect(page).toHaveTitle("Crow 6 eSports | Rocket League Organization & Coaching");
  expect(await meta(page, 'meta[name="description"]')).toMatch(
    /^Crow 6 eSports is a competitive Rocket League/,
  );
  expect(await meta(page, 'meta[property="og:locale"]')).toBe("en_GB");
  expect(await meta(page, 'meta[property="og:image:alt"]')).toMatch(/cars/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${ORIGIN}/en`);
});

test("the Spanish home uses its own title", async ({ page }) => {
  await page.goto("/es");

  await expect(page).toHaveTitle("Crow 6 eSports | Organización y coaching de Rocket League");
  expect(await meta(page, 'meta[name="description"]')).toMatch(
    /^Crow 6 eSports es una organización/,
  );
});

for (const locale of ["es", "en"]) {
  test(`the ${locale} home describes the organization, its team and the site as one JSON-LD graph`, async ({
    page,
  }) => {
    await page.goto(`/${locale}`);

    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) => scripts.map((script) => JSON.parse(script.textContent ?? "")));
    const graph = blocks.flatMap((block) => block["@graph"] ?? []);
    const nodeOf = (type: string) =>
      graph.find((node: { "@type": string }) => node["@type"] === type);
    const organization = nodeOf("Organization");

    expect(organization).toMatchObject({
      name: "Crow 6 eSports",
      url: ORIGIN,
      logo: { url: `${ORIGIN}/icon-512.png` },
      foundingDate: "2020",
      address: { "@type": "PostalAddress", addressLocality: "Huesca", addressCountry: "ES" },
      alternateName: expect.arrayContaining(["Crow6", "C6 eSports"]),
    });
    expect(organization.description).toMatch(/^Crow 6 eSports/);
    expect(organization.sameAs.length).toBeGreaterThan(0);
    expect(nodeOf("SportsTeam")).toMatchObject({
      sport: "Rocket League",
      parentOrganization: { "@id": organization["@id"] },
    });
    expect(nodeOf("WebSite")).toMatchObject({
      url: ORIGIN,
      publisher: { "@id": organization["@id"] },
    });
    expect(JSON.stringify(blocks)).not.toMatch(/Review|AggregateRating/);
  });
}

for (const locale of ["es", "en"]) {
  test(`the ${locale} news list describes its articles as a CollectionPage`, async ({ page }) => {
    test.skip(!hasNews(locale), "Sin artículos en este idioma");
    await page.goto(`/${locale}/news`);

    const collection = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) =>
        scripts
          .map((script) => JSON.parse(script.textContent ?? ""))
          .find((block) => block["@type"] === "CollectionPage"),
      );
    const items = collection.mainEntity.itemListElement;
    const listed = await page
      .locator("main article a")
      .evaluateAll((links) =>
        links.map((link) => (link as HTMLAnchorElement).getAttribute("href")),
      );

    expect(collection).toMatchObject({ url: `${ORIGIN}/${locale}/news`, inLanguage: locale });
    expect(collection.mainEntity.numberOfItems).toBe(items.length);
    expect(items.map((item: { url: string }) => item.url.replace(ORIGIN, ""))).toEqual(listed);
    items.forEach((item: { position: number; name: string }, index: number) => {
      expect(item.position).toBe(index + 1);
      expect(item.name).toBeTruthy();
    });
  });
}

test("keeps the news page out of search engines only while it has no articles", async ({
  page,
}) => {
  await page.goto("/es/news");
  const noindex = page.locator('meta[name="robots"][content*="noindex"]');

  await expect(noindex).toHaveCount(hasNews("es") ? 0 : 1);
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

test("serves a sitemap with real lastmod dates, hreflang alternates and the public domain only", async ({
  request,
}) => {
  const response = await request.get("/sitemap.xml");
  const xml = await response.text();
  const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, entry]) => ({
    loc: /<loc>([^<]+)<\/loc>/.exec(entry)![1],
    lastmod: /<lastmod>([^<]+)<\/lastmod>/.exec(entry)?.[1],
  }));

  expect(response.status()).toBe(200);
  // Solo las noticias tienen una fecha fiable; las páginas fijas no declaran lastmod
  for (const { loc, lastmod } of entries) {
    if (loc.includes("/news")) expect(lastmod, loc).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    else expect(lastmod, loc).toBeUndefined();
  }
  expect(xml).toContain('hreflang="es"');
  expect(xml).toContain('hreflang="en"');
  expect(xml).toContain('hreflang="x-default"');
  if (!hasNews()) expect(xml).not.toContain("/news");

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
