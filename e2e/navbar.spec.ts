import { expect, test } from "@playwright/test";

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("keeps the header above the backdrop while the menu is open", async ({ page }) => {
    await page.goto("/es/team", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Abrir menú" }).click();

    // `trial` comprueba que nada tapa el elemento: antes la capa difuminada cubría la cabecera
    await page.locator(".navbar__brand").click({ trial: true });
    await page.getByRole("button", { name: "Cerrar menú" }).click({ trial: true });
    const menu = page.getByRole("navigation", { name: "Menú de navegación" });
    await expect(menu.getByRole("link", { name: "Plantilla" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("closes the menu and lets the page scroll again after choosing a link", async ({ page }) => {
    await page.goto("/es", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Abrir menú" }).click();
    await page
      .getByRole("navigation", { name: "Menú de navegación" })
      .getByRole("link", { name: "Coaching" })
      .click();

    await expect(page).toHaveURL(/\/es\/coaching$/);
    await expect(page.getByRole("button", { name: "Abrir menú" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  });
});

test("marks the page as scrolled and shows the solid join button on desktop", async ({ page }) => {
  await page.goto("/es/team", { waitUntil: "networkidle" });

  await expect(page.locator(".navbar")).not.toHaveAttribute("data-scrolled", "");
  await expect(page.locator(".navbar__cta")).toHaveClass(/btn--primary/);

  await page.evaluate(() => window.scrollTo(0, 600));
  await expect(page.locator(".navbar")).toHaveAttribute("data-scrolled", "");
});
