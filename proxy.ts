import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

const handleI18n = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const response = handleI18n(request);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  if (response.status === 200 && !response.headers.get("location")) {
    return NextResponse.next({
      request: { headers: requestHeaders },
      headers: response.headers,
    });
  }

  return response;
}

export const config = {
  matcher: String.raw`/((?!api|trpc|_next|_vercel|.*\..*).*)`,
};
