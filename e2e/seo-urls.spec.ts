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
