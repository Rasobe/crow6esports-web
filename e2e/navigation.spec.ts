import { expect, test } from "@playwright/test";

test("redirects the root to the detected locale", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/(es|en)$/);
});

test("renders the roster on the team page", async ({ page }) => {
  await page.goto("/es/team");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".player-card").first()).toBeVisible();
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
