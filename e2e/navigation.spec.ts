import { expect, test } from "@playwright/test";

test("redirects the root to the detected locale", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/(es|en)$/);
});

for (const [path, title] of [
  ["/es/team", "Plantilla"],
  ["/es/news", "Noticias"],
  ["/es/coaching", "Coaching"],
  ["/es/store", "Tienda"],
  ["/es/about-us", "Sobre nosotros"],
] as const) {
  test(`renders ${path} with a single h1`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
  });
}

test("does not expose the internal under construction route", async ({ page }) => {
  const response = await page.goto("/es/under-construction");
  expect(response?.status()).toBe(404);
});

test("lists every published page in the sitemap", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const route of ["tryouts", "team", "news", "coaching", "store", "about-us"]) {
    expect(xml).toContain(`/es/${route}`);
    expect(xml).toContain(`/en/${route}`);
  }
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
