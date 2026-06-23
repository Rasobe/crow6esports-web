import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";
  const isComingSoonPath = request.nextUrl.pathname === "/coming-soon";

  if (isMaintenanceMode && !isComingSoonPath) {
    return NextResponse.rewrite(new URL("/coming-soon", request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [String.raw`/((?!api|_next|_vercel|.*\..*).*)`],
};
