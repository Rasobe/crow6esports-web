import type { APIRoute } from "astro";
import { siteConfig } from "@config/site";

export const GET: APIRoute = () =>
  new Response(
    `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/admin\nDisallow: /keystatic\nDisallow: /api/keystatic\n\nSitemap: ${siteConfig.url}/sitemap.xml\n`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    },
  );
