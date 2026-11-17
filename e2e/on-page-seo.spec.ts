import { expect, test, type Page } from "@playwright/test";
import { CLUB } from "../config/club";

const ROUTES = ["", "/team", "/coaching", "/news", "/store", "/about-us", "/tryouts"];

// Cuenta en el DOM de la página: los locators de Playwright entran también en el shadow DOM
// de la barra de desarrollo de Astro, que trae sus propios h1 e imágenes
const countInPage = (page: Page, selector: string) =>
  page.evaluate((css) => document.querySelectorAll(css).length, selector);

for (const locale of ["es", "en"]) {
  for (const route of ROUTES) {
    const path = `/${locale}${route}`;

    test(`${path} has a single h1 and an alt on every image`, async ({ page }) => {
      await page.goto(path);

      expect(await countInPage(page, "h1")).toBe(1);
      expect(await countInPage(page, "img:not([alt])")).toBe(0);
    });
  }
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
