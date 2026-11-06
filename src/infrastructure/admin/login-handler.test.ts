import { describe, expect, it, vi } from "vitest";
import { createRateLimiter } from "@/infrastructure/http/rate-limiter";
import { createLoginHandler } from "./login-handler";

const ORIGIN = "https://crow6esports.com";
const CLIENT = "203.0.113.7";

const loginRequest = (fields: Record<string, string>, headers: Record<string, string> = {}) =>
  new Request(`${ORIGIN}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Origin: ORIGIN, ...headers },
    body: new URLSearchParams(fields),
  });

const credentials = { email: "boss@crow6.com", password: "correct horse" };

function setup({ limit = 5, signIn = vi.fn().mockResolvedValue(true) } = {}) {
  const handle = createLoginHandler({
    limiter: createRateLimiter({ limit, windowMs: 60_000 }),
    signIn,
  });
  return { handle, signIn };
}

describe("login handler", () => {
  it("redirects to the panel after a successful sign in", async () => {
    const { handle, signIn } = setup();

    const response = await handle(loginRequest(credentials), CLIENT);

    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toBe("/admin");
    expect(signIn).toHaveBeenCalledWith("boss@crow6.com", "correct horse");
  });

  it("gives the same generic error for wrong credentials and malformed input", async () => {
    const { handle } = setup({ signIn: vi.fn().mockResolvedValue(false) });

    const wrong = await handle(loginRequest(credentials), CLIENT);
    const malformed = await handle(loginRequest({ email: "nope", password: "" }), CLIENT);

    expect(wrong.headers.get("Location")).toBe("/admin/login?error=1");
    expect(malformed.headers.get("Location")).toBe("/admin/login?error=1");
  });

  it("treats an auth failure as a failed login instead of leaking it", async () => {
    const { handle } = setup({ signIn: vi.fn().mockRejectedValue(new Error("auth down")) });

    const response = await handle(loginRequest(credentials), CLIENT);

    expect(response.headers.get("Location")).toBe("/admin/login?error=1");
  });

  it("rejects submissions from another origin without trying to sign in", async () => {
    const { handle, signIn } = setup();

    const response = await handle(
      loginRequest(credentials, { Origin: "https://evil.example" }),
      CLIENT,
    );

    expect(response.headers.get("Location")).toBe("/admin/login?error=1");
    expect(signIn).not.toHaveBeenCalled();
  });

  it("limits attempts per client, counting failed ones too", async () => {
    const { handle, signIn } = setup({ limit: 2, signIn: vi.fn().mockResolvedValue(false) });

    await handle(loginRequest(credentials), CLIENT);
    await handle(loginRequest(credentials), CLIENT);
    const blocked = await handle(loginRequest(credentials), CLIENT);

    expect(blocked.headers.get("Location")).toBe("/admin/login?error=rate_limited");
    expect(signIn).toHaveBeenCalledTimes(2);
  });
});
