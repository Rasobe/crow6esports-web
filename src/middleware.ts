import { MAINTENANCE_MODE } from "astro:env/server";
import { defineMiddleware } from "astro:middleware";
import { detectLocale, isLocale } from "@/ui/i18n";

const COMING_SOON_PATH = "/coming-soon";
const NOT_FOUND_PATH = "/404";
const FILE_EXTENSION_PATTERN = /\.[^/]+$/;
const API_PREFIX = "/api/";

export const onRequest = defineMiddleware((context, next) => {
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

  return next();
});
