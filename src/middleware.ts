import type { APIContext, MiddlewareNext } from "astro";
import { MAINTENANCE_MODE } from "astro:env/server";
import { defineMiddleware } from "astro:middleware";
import { PAGES } from "@config/pages";
import { findPage } from "@/domain/site/page-status";
import { applySecurityHeaders } from "@/infrastructure/http/security-headers";
import { detectLocale, isLocale, stripLocale } from "@/ui/i18n";

const COMING_SOON_PATH = "/coming-soon";
const NOT_FOUND_PATH = "/404";
const FILE_EXTENSION_PATTERN = /\.[^/]+$/;
const API_PREFIX = "/api/";
const UNDER_CONSTRUCTION_SEGMENT = "under-construction";

const handleRequest = (context: APIContext, next: MiddlewareNext): Promise<Response> | Response => {
  const { pathname } = context.url;
  const [, firstSegment] = pathname.split("/");

  context.locals.locale = isLocale(firstSegment)
    ? firstSegment
    : detectLocale(context.request.headers.get("accept-language"));

  if (FILE_EXTENSION_PATTERN.test(pathname) || pathname.startsWith(API_PREFIX)) return next();

  if (MAINTENANCE_MODE && pathname !== COMING_SOON_PATH) {
    return context.rewrite(COMING_SOON_PATH);
  }

  const { locale: localeParam } = context.params;
  if (localeParam !== undefined && !isLocale(localeParam)) {
    return context.rewrite(NOT_FOUND_PATH);
  }

  if (isLocale(firstSegment)) {
    const page = findPage(PAGES, stripLocale(pathname));
    if (page?.status === "soon") {
      context.locals.underConstruction = page.key;
      return context.rewrite(`/${firstSegment}/${UNDER_CONSTRUCTION_SEGMENT}`);
    }
  }

  return next();
};

export const onRequest = defineMiddleware(async (context, next) =>
  applySecurityHeaders(await handleRequest(context, next), import.meta.env.DEV),
);
