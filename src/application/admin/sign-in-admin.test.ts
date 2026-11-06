import { describe, expect, it, vi } from "vitest";
import type { AdminAuth } from "@/domain/admin/admin-auth";
import { signInAdmin } from "./sign-in-admin";

const auth = (signIn = vi.fn().mockResolvedValue(true)): AdminAuth => ({
  getVerifiedEmail: vi.fn(),
  signIn,
  signOut: vi.fn(),
});

describe("signInAdmin", () => {
  it("signs in allowed emails", async () => {
    const admin = auth();

    await expect(signInAdmin(admin, ["boss@crow6.com"], " Boss@crow6.com ", "pw")).resolves.toBe(
      true,
    );
    expect(admin.signIn).toHaveBeenCalledWith("Boss@crow6.com", "pw");
  });

  it("never reaches the auth server for emails outside the allow list", async () => {
    const admin = auth();

    await expect(signInAdmin(admin, ["boss@crow6.com"], "fan@example.com", "pw")).resolves.toBe(
      false,
    );
    await expect(signInAdmin(admin, [], "boss@crow6.com", "pw")).resolves.toBe(false);
    expect(admin.signIn).not.toHaveBeenCalled();
  });
});
