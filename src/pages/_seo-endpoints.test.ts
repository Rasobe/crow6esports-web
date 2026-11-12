import type { APIContext } from "astro";
import { describe, expect, it } from "vitest";
import { GET as getRobots } from "./robots.txt";
import { GET as getSitemap } from "./sitemap.xml";

const context = {} as APIContext;

describe("SEO endpoints", () => {
  it("serves the sitemap as cacheable XML with hreflang alternates", async () => {
    const response = await getSitemap(context);
    const body = await response.text();

    expect(response.headers.get("Content-Type")).toBe("application/xml; charset=utf-8");
    expect(response.headers.get("Cache-Control")).toMatch(/^public, max-age=\d+/);
    expect(body.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n')).toBe(true);
    expect(body).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    );
    expect(body).toMatch(/<xhtml:link rel="alternate" hreflang="es" href="[^"]+"\/>/);
    expect(body).toMatch(/<xhtml:link rel="alternate" hreflang="en" href="[^"]+"\/>/);
  });

  it("serves robots.txt as cacheable plain text pointing to the sitemap", async () => {
    const response = await getRobots(context);

    expect(response.headers.get("Content-Type")).toBe("text/plain; charset=utf-8");
    expect(response.headers.get("Cache-Control")).toMatch(/^public, max-age=\d+/);
    expect(await response.text()).toMatch(/^Sitemap: https:\/\/\S+\/sitemap\.xml$/m);
  });
});
