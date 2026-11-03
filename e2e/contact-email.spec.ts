import { expect, test } from "@playwright/test";

test.use({ permissions: ["clipboard-read", "clipboard-write"] });

const PAGES = ["/es/store", "/es/about-us", "/es/coaching"];

for (const path of PAGES) {
  test(`offers mailto, copy and Gmail options on ${path}`, async ({ page }) => {
    await page.goto(path, { waitUntil: "networkidle" });

    const contact = page.locator("main contact-email");
    await contact.scrollIntoViewIfNeeded();
    await expect(contact.getByRole("link", { name: /Escribir/ })).toHaveAttribute(
      "href",
      /^mailto:.+@.+/,
    );
    // La ayuda solo aparece al pulsar el botón principal
    await expect(contact.getByRole("button", { name: "Copiar correo" })).toBeHidden();
    await contact.getByRole("link", { name: /Escribir/ }).click();

    await expect(contact.getByText("¿No se abre tu app de correo?")).toBeVisible();
    await expect(contact.getByRole("link", { name: /Abrir en Gmail/ })).toHaveAttribute(
      "href",
      /^https:\/\/mail\.google\.com\/mail\/\?view=cm.*to=.+/,
    );

    await contact.getByRole("button", { name: "Copiar correo" }).click();
    await expect(contact.getByRole("button", { name: "¡Copiado!" })).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(/@/);
  });
}

test("keeps the contact email copyable from the footer", async ({ page }) => {
  await page.goto("/es", { waitUntil: "networkidle" });

  const footer = page.getByRole("contentinfo");
  await expect(footer.getByRole("link", { name: /@/ })).toHaveAttribute("href", /^mailto:/);
  await footer.getByRole("button", { name: "Copiar correo" }).click();
  await expect(footer.getByRole("button", { name: "¡Copiado!" })).toBeVisible();
});
