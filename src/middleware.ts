import { MAINTENANCE_MODE } from "astro:env/server";
import { defineMiddleware } from "astro:middleware";
import { PAGES } from "@config/pages";
import { applySecurityHeaders } from "@/infrastructure/http/security-headers";
import { resolveLocale, resolveRequest } from "@/ui/routing/resolve-request";

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  context.locals.locale = resolveLocale(pathname, context.request.headers.get("accept-language"));

  const route = resolveRequest({
    pathname,
    localeParam: context.params.locale,
    maintenance: MAINTENANCE_MODE,
    pages: PAGES,
  });

  if (route.kind === "rewrite" && route.underConstruction) {
    context.locals.underConstruction = route.underConstruction;
  }

  const response = await (route.kind === "rewrite" ? context.rewrite(route.path) : next());
  return applySecurityHeaders(response, import.meta.env.DEV);
});
