import { expect, test } from "@playwright/test";
import { CLUB } from "../config/club";

const ROUTES = ["", "/team", "/coaching", "/news", "/store", "/about-us", "/tryouts"];

for (const locale of ["es", "en"]) {
  for (const route of ROUTES) {
    const path = `/${locale}${route}`;

    test(`${path} has a single h1 and an alt on every image`, async ({ page }) => {
      await page.goto(path);

      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("img:not([alt])")).toHaveCount(0);
    });
  }
}

test("the home h1 and an h2 name Rocket League and coaching", async ({ page }) => {
  await page.goto("/es");

  await expect(page.locator("h1")).toContainText("Rocket League");
  await expect(page.locator("h2", { hasText: /coaching/i }).first()).toBeVisible();
});

test("the coaching h1 names Rocket League", async ({ page }) => {
  await page.goto("/en/coaching");

  await expect(page.locator("h1")).toHaveText("Rocket League Coaching");
});

const CLUB_LINKS = {
  es: {
    "/es/team": "Conoce la plantilla",
    "/es/coaching": "Descubre el coaching",
    "/es/tryouts": "Consulta los tryouts",
    "/es/news": "Lee las noticias",
  },
  en: {
    "/en/team": "Meet the roster",
    "/en/coaching": "Discover the coaching",
    "/en/tryouts": "Check the tryouts",
    "/en/news": "Read the news",
  },
} as const;

for (const [locale, links] of Object.entries(CLUB_LINKS)) {
  test(`the ${locale} home club section links to team, coaching, tryouts and news`, async ({
    page,
  }) => {
    await page.goto(`/${locale}`);

    const section = page.locator(".about-club");
    await expect(section.locator("h3")).toHaveCount(3);
    for (const [href, name] of Object.entries(links)) {
      await expect(section.getByRole("link", { name })).toHaveAttribute("href", href);
    }
  });
}

test("describes the hero image and loads it first", async ({ page }) => {
  await page.goto("/en");

  const hero = page.locator(".hero__bg");
  await expect(hero).toHaveAttribute("alt", /Crow 6 eSports cars/);
  await expect(hero).toHaveAttribute("loading", "eager");
  await expect(hero).toHaveAttribute("fetchpriority", "high");
});

test("keeps the contact email out of the visible HTML", async ({ request }) => {
  for (const path of ["/es", "/es/about-us"]) {
    const html = await (await request.get(path)).text();
    const withoutStructuredData = html.replace(
      /<script type="application\/ld\+json"[\s\S]*?<\/script>/g,
      "",
    );

    expect(withoutStructuredData).not.toContain(CLUB.email);
  }
});
