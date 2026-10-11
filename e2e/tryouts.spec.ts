import { expect, test, type Page } from "@playwright/test";

async function openTryouts(page: Page) {
  await page.goto("/es/tryouts");
  await page.locator("astro-island:not([ssr])").waitFor();
}

test("blocks the first step until required fields are filled", async ({ page }) => {
  await openTryouts(page);
  await page.getByRole("button", { name: "Siguiente" }).click();
  await expect(
    page.locator(".text-field__error", { hasText: "El Discord ID es obligatorio" }),
  ).toBeVisible();
});

test("completes the three steps and shows the success state", async ({ page }) => {
  await page.route("**/api/contact", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: '{"success":true}' }),
  );
  await openTryouts(page);

  await page.getByLabel(/Discord ID/).fill("player#0001");
  await page.getByLabel(/Fecha de nacimiento/).fill("2000-01-01");
  await page.getByLabel(/País \/ Región/).fill("España");
  await page.getByLabel(/entre semana/).fill("L-V 18:00 a 22:00");
  await page.getByLabel(/fines de semana/).fill("S-D 10:00 a 23:00");
  await page.getByLabel(/scrims/).fill("Miércoles 20:00");
  await page.getByRole("button", { name: "Siguiente" }).click();

  await page.getByLabel(/Enlace RLTracker/).fill("https://rocketleague.tracker.network/profile/1");
  await page.getByLabel(/Rango actual/).fill("1830");
  await page.getByLabel(/Peak 2v2/).fill("2120");
  await page.getByLabel(/Horas jugadas/).fill("5000");
  await page.getByRole("button", { name: "Siguiente" }).click();

  await page.getByLabel(/error repetido/).fill("Hablo con calma y buscamos una solución");
  await page.getByLabel(/Qué buscas en Crow 6/).fill("Un entorno competitivo serio");
  await page.getByRole("button", { name: "Enviar solicitud" }).click();

  await expect(page.getByRole("heading", { name: "SOLICITUD ENVIADA" })).toBeVisible();
});

test("rejects malformed submissions at the API", async ({ request }) => {
  const response = await request.post("/api/contact", { data: { discord: "only-this" } });
  expect(response.status()).toBe(400);
});
