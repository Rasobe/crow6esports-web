import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

export const proxy = createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - API routes, trpc, _next, _vercel, and static files
  matcher: String.raw`/((?!api|trpc|_next|_vercel|.*\..*).*)`,
};
