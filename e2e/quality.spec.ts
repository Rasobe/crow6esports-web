import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { COACHING, LAUNCH_PRICE_ENDS } from "../config/coaching";
import { getCoachingPricing } from "../src/application/coaching/get-coaching-pricing";

const PUBLIC_ROUTES = ["", "/team", "/news", "/coaching", "/store", "/about-us", "/tryouts"];

// The Vite dev server answers with a 504 while it re-optimizes dependencies. It is a
// dev tooling artifact, not a site error, so it is ignored; the beforeAll warm-up
// visits every route once to settle the optimizer.
const DEV_SERVER_NOISE = /Outdated Optimize Dep/;

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage({ baseURL: test.info().project.use.baseURL });
  for (const route of PUBLIC_ROUTES) {
    await page.goto(`/es${route}`, { waitUntil: "networkidle" });
  }
  await page.close();
});

for (const locale of ["es", "en"]) {
  for (const route of PUBLIC_ROUTES) {
    test(`has no console errors on /${locale}${route}`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error" && !DEV_SERVER_NOISE.test(message.text())) {
          errors.push(message.text());
        }
      });
      page.on("pageerror", (error) => errors.push(error.message));

      await page.goto(`/${locale}${route}`);
      await page.waitForLoadState("networkidle");

      expect(errors).toEqual([]);
    });
  }
}

// axe mide el contraste con el color resultante: un texto a mitad de su fundido de entrada
// daría un falso positivo. Se esperan solo las animaciones finitas (el drift del hero no acaba).
async function settleEntranceAnimations(page: Page) {
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity)
        .map((animation) => animation.finished),
    ),
  );
}

// Mantiene el 100 de accesibilidad de Lighthouse: cualquier fallo WCAG A/AA rompe el test
for (const route of PUBLIC_ROUTES) {
  test(`has no accessibility violations on /es${route}`, async ({ page }) => {
    await page.goto(`/es${route}`);
    await page.waitForLoadState("networkidle");
    await settleEntranceAnimations(page);

    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .exclude("astro-dev-toolbar")
      .analyze();

    expect(violations.map(({ id, nodes }) => `${id} (${nodes.length})`)).toEqual([]);
  });
}

test("switches language from the home page", async ({ page }) => {
  await page.goto("/es");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");

  await page.getByRole("link", { name: "EN", exact: true }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("link", { name: "Meet the team" })).toBeVisible();
});

test("navigates through the main navigation", async ({ page }) => {
  await page.goto("/es");
  const nav = page.getByRole("banner").getByRole("navigation");

  for (const [name, path, heading] of [
    ["Plantilla", "/es/team", "Plantilla"],
    ["Noticias", "/es/news", "Noticias"],
    ["Coaching", "/es/coaching", "Coaching"],
    ["Tienda", "/es/store", "Tienda"],
    ["Sobre nosotros", "/es/about-us", "Sobre nosotros"],
  ] as const) {
    await nav.getByRole("link", { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
  }
});

test("shows the sold out store without prices", async ({ page }) => {
  await page.goto("/es/store");
  await expect(page.getByText("Próxima edición", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Agotado").first()).toBeVisible();
  await expect(page.getByText(/€/)).toHaveCount(0);
});

test("shows the news empty state and keeps it out of search engines", async ({ page }) => {
  await page.goto("/es/news");
  await expect(page.getByRole("heading", { name: "Pronto publicaremos noticias" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("describes the club and the coaching service for search engines", async ({ page }) => {
  const structuredTypes = async () =>
    page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) =>
        scripts.map((script) => JSON.parse(script.textContent ?? "")["@type"]),
      );

  await page.goto("/es");
  expect(await structuredTypes()).toEqual(expect.arrayContaining(["SportsTeam", "WebSite"]));

  await page.goto("/es/coaching");
  expect(await structuredTypes()).toContain("Service");
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "es_ES");
});

test("renders the coaching packs and single sessions from the config", async ({ page }) => {
  await page.goto("/es/coaching");
  const cards = page.locator(".plan-card");
  const pricing = getCoachingPricing(COACHING.plans, LAUNCH_PRICE_ENDS);
  const packs = [...pricing.plans.individual, ...pricing.plans.teams];
  await expect(cards).toHaveCount(packs.length);

  for (const [index, plan] of packs.entries()) {
    const card = cards.nth(index);
    const mode = index < COACHING.plans.individual.length ? "individual" : "teams";
    const features = COACHING.features[mode];
    const included = features.filter((feature) => feature.tiers.includes(plan.tier));

    await expect(card.locator(".plan-card__amount")).toHaveText(
      new RegExp(`^${plan.current}\\s€$`),
    );
    await expect(card.locator(".plan-card__feature")).toHaveCount(features.length);
    await expect(
      card.locator(".plan-card__feature:not(.plan-card__feature--excluded)"),
    ).toHaveCount(included.length);
  }

  await expect(page.getByText("Más elegido")).toHaveCount(2);
  // El texto de lanzamiento solo existe mientras el precio de lanzamiento esté vigente
  await expect(page.getByText("Precio de lanzamiento")).toHaveCount(
    pricing.launchActive ? packs.length * 2 : 0,
  );
  await expect(page.locator(".single-card")).toHaveCount(COACHING.singleSessions.length);
  await expect(page.locator(".single-card--free")).toContainText("Gratis");

  // Una sola acción por sección, no un botón por carta
  for (const label of [
    "Reservar pack individual",
    "Reservar pack de equipo",
    "Reservar sesión gratis",
  ]) {
    await expect(page.getByRole("link", { name: label })).toHaveCount(1);
  }
});

test("keeps the content visible when reduced motion is requested", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/es/coaching");
  await expect(page.getByRole("heading", { name: "Packs de coaching" })).toBeVisible();
  await expect(page.locator("html")).not.toHaveAttribute("data-motion", /.+/);
  await context.close();
});
