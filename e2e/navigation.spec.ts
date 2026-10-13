import { expect, test } from "@playwright/test";

test("redirects the root to the detected locale", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/(es|en)$/);
});

for (const [path, title] of [
  ["/es/team", "Plantilla"],
  ["/es/coaching", "Coaching"],
  ["/es/store", "Tienda"],
  ["/es/about-us", "Sobre nosotros"],
] as const) {
  test(`shows the under construction notice on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
    await expect(page.getByText("En construcción", { exact: true })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });
}

test("translates the under construction notice", async ({ page }) => {
  await page.goto("/en/team");
  await expect(page.getByRole("heading", { level: 1, name: "Roster" })).toBeVisible();
  await expect(page.getByText("Under construction", { exact: true })).toBeVisible();
});

test("does not expose the internal under construction route", async ({ page }) => {
  const response = await page.goto("/es/under-construction");
  expect(response?.status()).toBe(404);
});

test("only lists published pages in the sitemap", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml).toContain("/es/tryouts");
  expect(xml).not.toContain("/es/team");
  expect(xml).not.toContain("/es/store");
});

test("switches locale keeping the current path", async ({ page }) => {
  await page.goto("/es/team");
  await page.getByRole("link", { name: "EN", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/team$/);
});

test("shows the not found page for unknown routes", async ({ page }) => {
  const response = await page.goto("/es/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.locator(".not-found")).toBeVisible();
});
