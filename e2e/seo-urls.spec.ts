import { expect, test } from "@playwright/test";

test("redirects trailing slashes to the canonical URL with a 301", async ({ request }) => {
  const response = await request.get("/es/team/?ref=test", { maxRedirects: 0 });

  expect(response.status()).toBe(301);
  expect(response.headers().location).toBe("/es/team?ref=test");
});

test("serves the language roots without a redirect", async ({ request }) => {
  for (const path of ["/es", "/en"]) {
    expect((await request.get(path, { maxRedirects: 0 })).status()).toBe(200);
  }
});

test("returns a real 404 for URLs that never existed", async ({ request }) => {
  for (const path of ["/es/home", "/home"]) {
    expect((await request.get(path, { maxRedirects: 0 })).status()).toBe(404);
  }
});

test("shows a helpful not found page that search engines skip", async ({ page }) => {
  const response = await page.goto("/es/no-existe");

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { level: 1, name: "Esta jugada no existe" }),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

  const links = page.getByRole("navigation", { name: "Sigue jugando" });
  await expect(links.getByRole("link")).toHaveCount(5);
  await expect(page.getByRole("link", { name: "Volver al inicio" })).toHaveAttribute("href", "/es");
});
