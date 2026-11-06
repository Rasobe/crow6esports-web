import { describe, expect, it, vi } from "vitest";
import { guardAdminRequest } from "./admin-guard";

const allowedEmails = ["boss@crow6.com"];

function run(pathname: string, email: string | null) {
  const getVerifiedEmail = vi.fn().mockResolvedValue(email);
  return {
    getVerifiedEmail,
    result: guardAdminRequest({ pathname, getVerifiedEmail, allowedEmails }),
  };
}

describe("admin guard", () => {
  it("redirects a page request without session to the login", async () => {
    const result = await run("/admin", null).result;

    expect(result.allowed).toBe(false);
    if (result.allowed) return;
    expect(result.response.status).toBe(302);
    expect(result.response.headers.get("Location")).toBe("/admin/login");
  });

  it("answers 401 with a generic body to an API call without session", async () => {
    const result = await run("/api/admin/tryouts/1", null).result;

    expect(result.allowed).toBe(false);
    if (result.allowed) return;
    expect(result.response.status).toBe(401);
    await expect(result.response.json()).resolves.toEqual({ error: "unauthorized" });
  });

  it("blocks a valid session whose email is not in ADMIN_EMAILS", async () => {
    const page = await run("/admin/tryouts", "stranger@example.com").result;
    const api = await run("/api/admin/tryouts/1", "stranger@example.com").result;

    expect(page.allowed).toBe(false);
    expect(api.allowed).toBe(false);
    if (page.allowed || api.allowed) return;
    expect(page.response.status).toBe(302);
    expect(api.response.status).toBe(401);
  });

  it("lets an allowed email through and exposes it", async () => {
    const result = await run("/admin/tryouts", "boss@crow6.com").result;

    expect(result).toEqual({ allowed: true, adminEmail: "boss@crow6.com" });
  });

  it("verifies the session on every request", async () => {
    const getVerifiedEmail = vi.fn().mockResolvedValue("boss@crow6.com");

    await guardAdminRequest({ pathname: "/admin", getVerifiedEmail, allowedEmails });
    await guardAdminRequest({ pathname: "/admin", getVerifiedEmail, allowedEmails });

    expect(getVerifiedEmail).toHaveBeenCalledTimes(2);
  });

  it("does not expose an email on the public login page for non admins", async () => {
    const result = await run("/admin/login", "stranger@example.com").result;

    expect(result).toEqual({ allowed: true, adminEmail: null });
  });
});
