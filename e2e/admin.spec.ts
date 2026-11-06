import { expect, test } from "@playwright/test";

const REQUEST_ID = "0b6d5f0e-8f3b-4c43-9a55-6f2a3d8d5c11";

test.describe("admin panel without a session", () => {
  for (const path of [
    "/admin",
    "/admin/tryouts",
    `/admin/tryouts/${REQUEST_ID}`,
    "/admin/coaching",
  ]) {
    test(`redirects ${path} to the login`, async ({ page }) => {
      await page.goto(path);

      await expect(page).toHaveURL(/\/admin\/login$/);
      await expect(page.getByRole("heading", { name: "Acceso al panel" })).toBeVisible();
    });
  }

  test("keeps the login out of search engines", async ({ page }) => {
    const response = await page.goto("/admin/login");

    expect(response?.headers()["x-robots-tag"]).toContain("noindex");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    expect(response?.headers()["cache-control"]).toContain("no-store");
  });

  test("answers 401 to API calls and never touches the data", async ({ request }) => {
    const review = await request.post(`/api/admin/tryouts/${REQUEST_ID}`, {
      form: { status: "accepted", notes: "x" },
    });
    const logout = await request.post("/api/admin/logout");

    expect(review.status()).toBe(401);
    await expect(review.json()).resolves.toEqual({ error: "unauthorized" });
    expect(logout.status()).toBe(401);
  });

  test("shows a generic error for wrong credentials and stays on the login", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("Correo").fill("nobody@example.com");
    await page.getByLabel("Contraseña").fill("not-the-password");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page).toHaveURL(/\/admin\/login\?error=1$/);
    await expect(page.getByRole("alert")).toHaveText(/No se pudo iniciar sesión/);
  });
});

test.describe("admin stays out of the public site", () => {
  test("is disallowed in robots.txt and absent from the sitemap", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    const sitemap = await (await request.get("/sitemap.xml")).text();

    expect(robots).toContain("Disallow: /admin");
    expect(robots).toContain("Disallow: /api/admin");
    expect(sitemap).not.toContain("/admin");
  });

  test("is not linked from the public pages", async ({ page }) => {
    for (const path of ["/es", "/es/tryouts", "/es/coaching"]) {
      await page.goto(path);
      await expect(page.locator('a[href^="/admin"]')).toHaveCount(0);
    }
  });
});

const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;

test("signs in with real credentials and reaches the panel", async ({ page }) => {
  test.skip(!adminEmail || !adminPassword, "Needs E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD");

  await page.goto("/admin/tryouts");
  await expect(page).toHaveURL(/\/admin\/login$/);

  await page.getByLabel("Correo").fill(adminEmail!);
  await page.getByLabel("Contraseña").fill(adminPassword!);
  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "Resumen" })).toBeVisible();

  await page.getByRole("button", { name: "Salir" }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
});
