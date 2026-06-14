import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "always",
});

export const config = {
  matcher: [String.raw`/((?!api|_next|_vercel|.*\..*).*)`],
};
