import { expect, test } from "@playwright/test";

const QUOTES = {
  es: ["La experiencia con Rasobe ha sido fantástica", "Siempre agradecido con Rasobe"],
  en: ["Working with Rasobe has been fantastic", "Always grateful to Rasobe"],
} as const;

const HIGHLIGHTS = {
  es: ["2000 MMR en 2s · 1700 MMR en 3s", "1500 → 1791 MMR en 3 meses"],
  en: ["2000 MMR in 2s · 1700 MMR in 3s", "1500 → 1791 MMR in 3 months"],
} as const;

for (const locale of ["es", "en"] as const) {
  for (const path of [`/${locale}/coaching`, `/${locale}`]) {
    test(`renders the testimonials in the server HTML of ${path}`, async ({ request }) => {
      const html = await (await request.get(path)).text();

      for (const text of [
        ...QUOTES[locale],
        ...HIGHLIGHTS[locale].flatMap((h) => h.split(" · ")),
      ]) {
        expect(html).toContain(text);
      }
    });
  }

  test(`${locale} coaching shows them before the final CTA with a contact link`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/coaching`);
    const section = page.locator(".testimonials");

    await expect(section.locator("blockquote")).toHaveCount(2);
    await expect(section.locator("figcaption cite").first()).toHaveText("Jerry");
    await expect(section.locator(".btn")).toHaveAttribute("href", /discord/);

    const order = await page.evaluate(() => {
      const nodes = [".testimonials", ".coaching-cta"].map((s) => document.querySelector(s));
      return nodes[0]!.compareDocumentPosition(nodes[1]!) & Node.DOCUMENT_POSITION_FOLLOWING;
    });
    expect(order).toBeTruthy();
  });

  test(`${locale} home shows the compact version linking to coaching`, async ({ page }) => {
    await page.goto(`/${locale}`);
    const section = page.locator(".testimonials--compact");

    await expect(section).toHaveCount(1);
    await expect(section.locator(".testimonials__link")).toHaveAttribute(
      "href",
      `/${locale}/coaching`,
    );
  });
}

test("does not show the testimonials on tryouts", async ({ page }) => {
  for (const path of ["/es/tryouts", "/en/tryouts"]) {
    await page.goto(path);
    await expect(page.locator(".testimonials")).toHaveCount(0);
  }
});

test("does not publish Review or AggregateRating structured data", async ({ request }) => {
  for (const path of ["/es/coaching", "/es"]) {
    const html = await (await request.get(path)).text();

    expect(html).not.toMatch(/"@type"\s*:\s*"(Review|AggregateRating)"/);
  }
});
