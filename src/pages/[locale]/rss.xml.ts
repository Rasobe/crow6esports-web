import type { APIRoute } from "astro";
import { isLocale, localizePath } from "@/ui/i18n";
import { buildLocaleFeed } from "@/ui/shared/lib/build-locale-feed";

export const GET: APIRoute = ({ params }) => {
  // El middleware deja pasar las rutas con extensión sin mirar el idioma, así que se valida aquí
  const { locale } = params;
  if (!isLocale(locale)) return new Response("Not found", { status: 404 });

  return buildLocaleFeed(locale, localizePath(locale, "/rss.xml"));
};
