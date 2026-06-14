import { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

const handleRequest = createMiddleware(routing);

export function proxy(request: NextRequest) {
  request.headers.set("x-pathname", request.nextUrl.pathname);
  const response = handleRequest(request);
  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: String.raw`/((?!api|trpc|_next|_vercel|.*\..*).*)`,
};
