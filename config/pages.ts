import { isLive, type PageDefinition, type PageStatus } from "@/domain/site/page-status";
import { ROUTES } from "./routes";

export type PageKey = keyof typeof ROUTES;

/**
 * Estado de cada página. Una página en "soon" muestra el aviso de "en construcción"
 * (con noindex y fuera del sitemap) sin tocar su implementación. Para publicarla,
 * basta con cambiarla a "live".
 */
const PAGE_STATUS: Record<PageKey, PageStatus> = {
  home: "live",
  team: "soon",
  coaching: "soon",
  store: "soon",
  aboutUs: "soon",
  tryouts: "live",
};

export const PAGES: readonly PageDefinition<PageKey>[] = (Object.keys(ROUTES) as PageKey[]).map(
  (key) => ({ key, route: ROUTES[key], status: PAGE_STATUS[key] }),
);

export const LIVE_ROUTES: readonly string[] = PAGES.filter(isLive).map((page) => page.route);
