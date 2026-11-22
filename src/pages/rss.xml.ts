import type { APIRoute } from "astro";
import { DEFAULT_LOCALE } from "@/ui/i18n";
import { buildLocaleFeed } from "@/ui/shared/lib/build-locale-feed";

/** El feed del idioma por defecto, en la ruta que buscan los lectores y los bots. */
export const GET: APIRoute = () => buildLocaleFeed(DEFAULT_LOCALE, "/rss.xml");
