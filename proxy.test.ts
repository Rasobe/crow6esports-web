import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

const { intlMiddlewareMock } = vi.hoisted(() => ({
  intlMiddlewareMock: vi.fn(() => NextResponse.next()),
}));

vi.mock("next-intl/middleware", () => ({
  default: () => intlMiddlewareMock,
}));

import middleware from "./proxy";

describe("middleware", () => {
  const originalEnv = process.env.MAINTENANCE_MODE;

  afterEach(() => {
    process.env.MAINTENANCE_MODE = originalEnv;
    intlMiddlewareMock.mockClear();
  });

  it("delegates to the next-intl middleware when maintenance mode is off", () => {
    process.env.MAINTENANCE_MODE = "false";
    const request = new NextRequest(new URL("https://example.com/es/team"));

    middleware(request);

    expect(intlMiddlewareMock).toHaveBeenCalledWith(request);
  });

  it("delegates to the next-intl middleware when MAINTENANCE_MODE is unset", () => {
    delete process.env.MAINTENANCE_MODE;
    const request = new NextRequest(new URL("https://example.com/"));

    middleware(request);

    expect(intlMiddlewareMock).toHaveBeenCalledWith(request);
  });

  it("rewrites to /coming-soon when maintenance mode is on", () => {
    process.env.MAINTENANCE_MODE = "true";
    const request = new NextRequest(new URL("https://example.com/es/team"));

    const response = middleware(request);

    expect(response.headers.get("x-middleware-rewrite")).toBe("https://example.com/coming-soon");
    expect(intlMiddlewareMock).not.toHaveBeenCalled();
  });

  it("does not rewrite the /coming-soon path itself, even in maintenance mode", () => {
    process.env.MAINTENANCE_MODE = "true";
    const request = new NextRequest(new URL("https://example.com/coming-soon"));

    middleware(request);

    expect(intlMiddlewareMock).toHaveBeenCalledWith(request);
  });
});
