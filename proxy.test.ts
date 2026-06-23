import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

const { intlMiddlewareMock } = vi.hoisted(() => ({
  intlMiddlewareMock: vi.fn(() => NextResponse.next()),
}));

vi.mock("next-intl/middleware", () => ({
  default: () => intlMiddlewareMock,
}));

import { proxy } from "./src/proxy";

describe("proxy", () => {
  const originalEnv = process.env.NEXT_PUBLIC_MAINTENANCE_MODE;

  afterEach(() => {
    process.env.NEXT_PUBLIC_MAINTENANCE_MODE = originalEnv;
    intlMiddlewareMock.mockClear();
  });

  it("delegates to the next-intl middleware when maintenance mode is off", () => {
    process.env.NEXT_PUBLIC_MAINTENANCE_MODE = "false";
    const request = new NextRequest(new URL("https://example.com/es/team"));

    proxy(request);

    expect(intlMiddlewareMock).toHaveBeenCalledWith(request);
  });

  it("delegates to the next-intl middleware when NEXT_PUBLIC_MAINTENANCE_MODE is unset", () => {
    delete process.env.NEXT_PUBLIC_MAINTENANCE_MODE;
    const request = new NextRequest(new URL("https://example.com/"));

    proxy(request);

    expect(intlMiddlewareMock).toHaveBeenCalledWith(request);
  });

  it("rewrites to /coming-soon when maintenance mode is on", () => {
    process.env.NEXT_PUBLIC_MAINTENANCE_MODE = "true";
    const request = new NextRequest(new URL("https://example.com/es/team"));

    const response = proxy(request);

    expect(response.headers.get("x-middleware-rewrite")).toBe("https://example.com/coming-soon");
    expect(intlMiddlewareMock).not.toHaveBeenCalled();
  });

  it("does not rewrite the /coming-soon path itself, even in maintenance mode", () => {
    process.env.NEXT_PUBLIC_MAINTENANCE_MODE = "true";
    const request = new NextRequest(new URL("https://example.com/coming-soon"));

    proxy(request);

    expect(intlMiddlewareMock).toHaveBeenCalledWith(request);
  });
});
