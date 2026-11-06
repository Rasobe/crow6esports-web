import { MAINTENANCE_MODE } from "astro:env/server";
import { defineMiddleware } from "astro:middleware";
import { PAGES } from "@config/pages";
import { isAdminPath } from "@/domain/admin/admin-access";
import { guardAdminRequest } from "@/infrastructure/admin/admin-guard";
import { container } from "@/infrastructure/container";
import { applySecurityHeaders } from "@/infrastructure/http/security-headers";
import { resolveLocale, resolveRequest } from "@/ui/routing/resolve-request";

const ADMIN_RESPONSE_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow",
  "Cache-Control": "no-store",
} as const;

const withAdminHeaders = (response: Response) => {
  for (const [name, value] of Object.entries(ADMIN_RESPONSE_HEADERS)) {
    response.headers.set(name, value);
  }
  return response;
};

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  context.locals.locale = resolveLocale(pathname, context.request.headers.get("accept-language"));

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

    if (!guard.allowed)
      return applySecurityHeaders(withAdminHeaders(guard.response), import.meta.env.DEV);

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
    return applySecurityHeaders(
      context.redirect(`${route.path}${context.url.search}`, 301),
      import.meta.env.DEV,
    );
  }

  if (route.kind === "rewrite" && route.underConstruction) {
    context.locals.underConstruction = route.underConstruction;
  }

  const response = await (route.kind === "rewrite" ? context.rewrite(route.path) : next());
  const secured = applySecurityHeaders(response, import.meta.env.DEV);
  return isAdminPath(pathname) ? withAdminHeaders(secured) : secured;
});
