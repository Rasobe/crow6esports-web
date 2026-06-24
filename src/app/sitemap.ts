import { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { ROUTES } from "@config/routes";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://crow6esports.com";

export default function sitemap(): MetadataRoute.Sitemap {
    return routing.locales.flatMap(locale =>
        Object.values(ROUTES).map(route => ({
            url: `${BASE_URL}/${locale}${route === "/" ? "" : route}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: route === "/" ? 1 : 0.8,
        }))
    );
}