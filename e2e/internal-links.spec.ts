import { expect, test } from "@playwright/test";

const START = ["/es", "/en"];
const SKIP = /^\/(admin|keystatic|api)(\/|$)/;

// Recorre la web pública desde las dos portadas siguiendo los enlaces internos
test("internal links point straight to localized pages, never to / or http://", async ({
  request,
}) => {
  test.setTimeout(120_000);
  const visited = new Set<string>();
  const queue = [...START];
  const problems: string[] = [];

  while (queue.length > 0) {
    const path = queue.shift()!;
    if (visited.has(path)) continue;
    visited.add(path);

    const response = await request.get(path, { maxRedirects: 0 });
    if (response.status() !== 200) {
      problems.push(`${response.status()} ${path}`);
      continue;
    }
    if (!(response.headers()["content-type"] ?? "").includes("text/html")) continue;

    const html = await response.text();
    for (const [, href] of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
      if (href.startsWith("http://")) problems.push(`http:// link ${href} on ${path}`);
      if (href === "/" || href.startsWith("https://crow6esports.com")) {
        problems.push(`unlocalized or absolute internal link ${href} on ${path}`);
      }
      if (!href.startsWith("/") || href.startsWith("//")) continue;

      const target = href.split("#")[0].split("?")[0];
      if (!/^\/(es|en)(\/|$)/.test(target)) problems.push(`link without locale ${href} on ${path}`);
      if (target && !SKIP.test(target) && !visited.has(target)) queue.push(target);
    }
  }

  expect(visited.size).toBeGreaterThan(10);
  expect(problems).toEqual([]);
});
