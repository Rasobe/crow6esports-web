import { expect, test, type Page } from "@playwright/test";

async function openTryouts(page: Page) {
  await page.goto("/es/tryouts");
  await page.locator("astro-island:not([ssr])").waitFor();
}

test("blocks the first step until required fields are filled", async ({ page }) => {
  await openTryouts(page);
  await page.getByRole("button", { name: "Siguiente" }).click();
  await expect(
    page.locator(".text-field__error", { hasText: "El usuario de Discord es obligatorio" }),
  ).toBeVisible();
});

test("does not validate a field when leaving it, only when advancing", async ({ page }) => {
  await openTryouts(page);
  const discord = page.getByLabel(/Usuario de Discord/);

  await discord.focus();
  await page.getByLabel(/País \/ Región/).focus();
  await expect(page.locator(".text-field__error")).toHaveCount(0);

  await page.getByRole("button", { name: "Siguiente" }).click();
  await expect(discord).toHaveAttribute("aria-invalid", "true");

  await discord.fill("player_one");
  await expect(discord).toHaveAttribute("aria-invalid", "false");
});

test("completes the three steps and shows the success state", async ({ page }) => {
  let submitted: Record<string, unknown> | undefined;
  await page.route("**/api/contact", async (route) => {
    submitted = route.request().postDataJSON();
    // Retraso para poder comprobar el estado de envío
    await new Promise((resolve) => setTimeout(resolve, 500));
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: '{"success":true}',
    });
  });
  // Primera página de la sesión, con utm: la atribución debe sobrevivir a la navegación
  await page.goto("/es?utm_source=Instagram&utm_medium=social&utm_campaign=lanzamiento");
  await page.waitForFunction(() => sessionStorage.getItem("crow6.attribution"));
  await openTryouts(page);

  await page.getByLabel(/Usuario de Discord/).fill("player_one");
  await page.getByLabel("Día", { exact: true }).selectOption("15");
  await page.getByLabel("Mes", { exact: true }).selectOption("06");
  await page.getByLabel("Año", { exact: true }).selectOption("2005");
  await page.getByLabel(/País \/ Región/).fill("España");
  await page.getByRole("button", { name: "Entre semana" }).click();
  await page.getByLabel("Horas fijas").check();
  await page.getByLabel(/Desde/).selectOption("18:00");
  await page.getByLabel(/Hasta/).selectOption("22:00");
  await page.getByRole("button", { name: "Siguiente" }).click();

  await page.getByLabel(/Rango actual/).fill("1830");
  await page.getByLabel(/Peak 2v2/).fill("2120");
  await page.getByLabel(/Horas jugadas/).fill("5000");
  await page.getByLabel("Mecánicas").check();
  await page.getByLabel(/Enlace RLTracker/).fill("https://rocketleague.tracker.network/profile/1");
  await page.getByRole("button", { name: "Siguiente" }).click();

  // Llegar al último paso no debe enviar el formulario ni mostrar errores
  await expect(page.getByRole("button", { name: "Enviar solicitud" })).toBeVisible();
  await expect(page.locator(".text-field__error, .choice-field__error")).toHaveCount(0);

  await page
    .getByRole("group", { name: /experiencia en equipos/ })
    .getByLabel("No")
    .check();
  await page.getByLabel(/error repetido/).fill("Hablo con calma y buscamos una solución");
  await page.getByLabel("Animo a mis compañeros").check();
  await page.getByLabel(/Qué buscas en Crow 6/).fill("Un entorno competitivo serio");
  await page
    .getByRole("group", { name: /coaching/ })
    .getByLabel("Sí")
    .check();
  await page.getByRole("button", { name: "Enviar solicitud" }).click();

  await expect(
    page.getByRole("status").filter({ hasText: "Guardando tu solicitud" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Enviando..." })).toBeDisabled();

  const heading = page.getByRole("heading", { name: "SOLICITUD ENVIADA" });
  await expect(heading).toBeVisible();
  await expect(heading).toBeFocused();
  await expect(page.getByRole("link", { name: "Volver al inicio" })).toHaveAttribute("href", "/es");
  expect(submitted).toMatchObject({
    sourcePage: "/es",
    utmSource: "instagram",
    utmMedium: "social",
    utmCampaign: "lanzamiento",
    locale: "es",
    birthDate: "2005-06-15",
    availableDays: ["mon", "tue", "wed", "thu", "fri"],
    scheduleType: "fixed",
    scheduleFrom: "18:00",
    scheduleTo: "22:00",
  });
});

test("lets the player pick training days and asks for fixed hours", async ({ page }) => {
  await openTryouts(page);
  const trainingDays = page.getByRole("group", { name: /Días que puedes entrenar/ });

  await page.getByRole("button", { name: "Fin de semana" }).click();
  await expect(trainingDays.getByLabel("Sábado")).toBeChecked();
  await expect(trainingDays.getByLabel("Lunes")).not.toBeChecked();

  await page.getByLabel("Horas fijas").check();
  await page.getByRole("button", { name: "Siguiente" }).click();
  await expect(
    page.locator(".select-field__error", { hasText: "Elige la hora de inicio" }),
  ).toBeVisible();
});

test("rejects malformed submissions at the API", async ({ request }) => {
  const response = await request.post("/api/contact", { data: { discord: "only-this" } });
  expect(response.status()).toBe(400);
});

test("only accepts POST at the contact API", async ({ request }) => {
  const response = await request.get("/api/contact");
  expect(response.status()).toBe(405);
  expect(response.headers()["allow"]).toBe("POST");
});

test("validates each step of the form in English", async ({ page }) => {
  await page.goto("/en/tryouts");
  await page.locator("astro-island:not([ssr])").waitFor();

  await page.getByRole("button", { name: "Next" }).click();
  await expect(
    page.locator(".text-field__error", { hasText: "Discord username is required" }),
  ).toBeVisible();
});
