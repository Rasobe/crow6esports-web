import { siteConfig } from "@config/site";
import { localizePath, type Locale } from "@/ui/i18n";
import { breadcrumbData, type StructuredData } from "./structured-data";

/** Un tramo del rastro: la etiqueta que lee la persona y la ruta sin prefijo de idioma. */
export interface Crumb {
  name: string;
  path: string;
}

/**
 * El rastro desde la portada hasta la página, en URLs absolutas del idioma en curso.
 * La portada la pone esta función, así que cada página solo declara sus propios tramos.
 *
 * Las rutas del sitio están en inglés (`/team`, `/store`) y buena parte del público lee
 * en español: sin este marcado Google enseña los tramos de la URL ("es › team") en vez
 * de las etiquetas del menú ("Plantilla").
 */
export function pageBreadcrumbs(locale: Locale, trail: readonly Crumb[]): StructuredData {
  return breadcrumbData([
    { name: siteConfig.name, url: `${siteConfig.url}${localizePath(locale, "/")}` },
    ...trail.map(({ name, path }) => ({
      name,
      url: `${siteConfig.url}${localizePath(locale, path)}`,
    })),
  ]);
}
