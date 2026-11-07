import { MAINTENANCE_MODE } from "astro:env/server";
import { defineMiddleware } from "astro:middleware";
import { PAGES } from "@config/pages";
import { REPOSITORY } from "@config/repository";
import { isAdminPath } from "@/domain/admin/admin-access";
import {
  KEYSTATIC_ACCESS_TOKEN_COOKIE,
  KEYSTATIC_REFRESH_TOKEN_COOKIE,
  isKeystaticPath,
} from "@/domain/keystatic/keystatic-access";
import { guardAdminRequest } from "@/infrastructure/admin/admin-guard";
import { container } from "@/infrastructure/container";
import { applySecurityHeaders } from "@/infrastructure/http/security-headers";
import { guardKeystaticRequest } from "@/infrastructure/keystatic/keystatic-guard";
import { resolveGithubSession } from "@/infrastructure/keystatic/github-session";
import { resolveLocale, resolveRequest } from "@/ui/routing/resolve-request";

const PRIVATE_RESPONSE_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow",
  "Cache-Control": "no-store",
} as const;

const withPrivateHeaders = (response: Response) => {
  for (const [name, value] of Object.entries(PRIVATE_RESPONSE_HEADERS)) {
    response.headers.set(name, value);
  }
  return response;
};

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const isDev = import.meta.env.DEV;
  context.locals.locale = resolveLocale(pathname, context.request.headers.get("accept-language"));

  if (isKeystaticPath(pathname)) {
    const blocked = await guardKeystaticRequest({
      pathname,
      isDev,
      configured: container.keystaticConfigured,
      resolveSession: () =>
        resolveGithubSession({
          accessToken: context.cookies.get(KEYSTATIC_ACCESS_TOKEN_COOKIE)?.value,
          hasRefreshToken: context.cookies.has(KEYSTATIC_REFRESH_TOKEN_COOKIE),
          repository: REPOSITORY,
        }),
    });
    if (blocked) return applySecurityHeaders(withPrivateHeaders(blocked), isDev, true);

    const response = await next();
    return applySecurityHeaders(withPrivateHeaders(response), isDev, true);
  }

  if (isAdminPath(pathname)) {
    const adminAuth = (() => {
      try {
        return container.createAdminAuth(context.request, context.cookies);
      } catch (error) {
        console.error("Admin authentication is not configured", error);
        return undefined;
      }
    })();

    // La sesión se verifica contra Supabase en cada petición; sin configuración, nadie entra
    const guard = await guardAdminRequest({
      pathname,
      getVerifiedEmail: async () => (adminAuth ? adminAuth.getVerifiedEmail() : null),
      allowedEmails: container.adminAllowedEmails,
    });

    if (!guard.allowed) return applySecurityHeaders(withPrivateHeaders(guard.response), isDev);

    context.locals.adminAuth = adminAuth;
    if (guard.adminEmail) context.locals.adminEmail = guard.adminEmail;
  }

  const route = resolveRequest({
    pathname,
    localeParam: context.params.locale,
    maintenance: MAINTENANCE_MODE,
    pages: PAGES,
  });

  if (route.kind === "redirect") {
    return applySecurityHeaders(context.redirect(`${route.path}${context.url.search}`, 301), isDev);
  }

  if (route.kind === "rewrite" && route.underConstruction) {
    context.locals.underConstruction = route.underConstruction;
  }

  const response = await (route.kind === "rewrite" ? context.rewrite(route.path) : next());
  const secured = applySecurityHeaders(response, isDev);
  return isAdminPath(pathname) ? withPrivateHeaders(secured) : secured;
});
