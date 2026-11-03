import { findPage, type PageDefinition } from "@/domain/site/page-status";
import { detectLocale, isLocale, stripLocale, type Locale } from "@/ui/i18n";

export const COMING_SOON_PATH = "/coming-soon";
export const NOT_FOUND_PATH = "/404";
const UNDER_CONSTRUCTION_SEGMENT = "under-construction";
const API_PREFIX = "/api/";

export type RequestRoute<Key extends string> =
  { kind: "next" } | { kind: "rewrite"; path: string; underConstruction?: Key };

interface RouteInput<Key extends string> {
  pathname: string;
  /** El parámetro `[locale]` de la ruta, si la ruta lo tiene. */
  localeParam: string | undefined;
  maintenance: boolean;
  pages: readonly PageDefinition<Key>[];
}

const isFileRequest = (pathname: string) => {
  const lastSegment = pathname.slice(pathname.lastIndexOf("/") + 1);
  return lastSegment.includes(".");
};

const firstSegmentOf = (pathname: string) => pathname.split("/")[1];

/** El idioma de la URL manda; si no lo lleva, se deduce de la cabecera del navegador. */
export function resolveLocale(pathname: string, acceptLanguage: string | null): Locale {
  const firstSegment = firstSegmentOf(pathname);
  return isLocale(firstSegment) ? firstSegment : detectLocale(acceptLanguage);
}

/**
 * Decide qué servir para una petición: la ruta pedida, el modo mantenimiento, el 404 de
 * un idioma inválido o el aviso "en construcción" de una página en "soon".
 */
export function resolveRequest<Key extends string>({
  pathname,
  localeParam,
  maintenance,
  pages,
}: RouteInput<Key>): RequestRoute<Key> {
  if (isFileRequest(pathname) || pathname.startsWith(API_PREFIX)) return { kind: "next" };

  if (maintenance && pathname !== COMING_SOON_PATH) {
    return { kind: "rewrite", path: COMING_SOON_PATH };
  }

  if (localeParam !== undefined && !isLocale(localeParam)) {
    return { kind: "rewrite", path: NOT_FOUND_PATH };
  }

  const firstSegment = firstSegmentOf(pathname);
  if (isLocale(firstSegment)) {
    const page = findPage(pages, stripLocale(pathname));
    if (page?.status === "soon") {
      return {
        kind: "rewrite",
        path: `/${firstSegment}/${UNDER_CONSTRUCTION_SEGMENT}`,
        underConstruction: page.key,
      };
    }
  }

  return { kind: "next" };
}
