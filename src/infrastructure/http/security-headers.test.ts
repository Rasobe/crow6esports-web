import { describe, expect, it } from "vitest";
import { applySecurityHeaders, SECURITY_HEADERS } from "./security-headers";

describe("applySecurityHeaders", () => {
  it("adds every security header to the response", () => {
    const response = applySecurityHeaders(new Response("ok"));

    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      expect(response.headers.get(name)).toBe(value);
    }
  });

  it("keeps a header that the response already defines", () => {
    const response = applySecurityHeaders(
      new Response("ok", { headers: { "X-Frame-Options": "SAMEORIGIN" } }),
    );

    expect(response.headers.get("X-Frame-Options")).toBe("SAMEORIGIN");
  });
});
