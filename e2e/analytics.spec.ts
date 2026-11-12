import { expect, test } from "@playwright/test";

// El servidor de e2e arranca sin ANALYTICS_ENABLED, como local y dev.crow6esports.com.
// Que sí aparece en producción lo cubre ahrefs-analytics.test.ts.
for (const path of ["/es", "/en/coaching", "/admin/login", "/keystatic"]) {
  test(`does not load the analytics on ${path} while it is disabled`, async ({ request }) => {
    const html = await (await request.get(path)).text();

    expect(html).not.toContain("analytics.ahrefs.com");
  });
}

test("allows the analytics in the site CSP but not in the Keystatic one", async ({ request }) => {
  const site = (await request.get("/es")).headers()["content-security-policy"];
  const panel = (await request.get("/keystatic")).headers()["content-security-policy"];

  expect(site).toMatch(/script-src [^;]*https:\/\/analytics\.ahrefs\.com/);
  expect(site).toMatch(/connect-src [^;]*https:\/\/analytics\.ahrefs\.com/);
  expect(panel ?? "").not.toContain("analytics.ahrefs.com");
});
