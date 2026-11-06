import { describe, expect, it } from "vitest";
import {
  decideAdminAccess,
  isAdminPath,
  isAllowedAdminEmail,
  parseAllowedEmails,
} from "./admin-access";

const allowedEmails = ["boss@crow6.com", "coach@crow6.com"];

describe("parseAllowedEmails", () => {
  it("splits, trims and lowercases the list", () => {
    expect(parseAllowedEmails(" Boss@Crow6.com , coach@crow6.com,, ")).toEqual(allowedEmails);
  });

  it("allows nobody when the list is missing or empty", () => {
    expect(parseAllowedEmails(undefined)).toEqual([]);
    expect(parseAllowedEmails("")).toEqual([]);
    expect(isAllowedAdminEmail("boss@crow6.com", [])).toBe(false);
  });
});

describe("isAdminPath", () => {
  it("covers the panel, its API and path variants", () => {
    for (const path of [
      "/admin",
      "/admin/",
      "/admin/tryouts/1",
      "/api/admin/login",
      "/ADMIN",
      "//admin",
    ]) {
      expect(isAdminPath(path)).toBe(true);
    }
  });

  it("ignores public paths and look-alikes", () => {
    for (const path of [
      "/",
      "/es/tryouts",
      "/api/contact",
      "/administrator",
      "/api/administrator",
    ]) {
      expect(isAdminPath(path)).toBe(false);
    }
  });
});

describe("decideAdminAccess", () => {
  const decide = (pathname: string, email: string | null) =>
    decideAdminAccess({ pathname, email, allowedEmails });

  it("sends visitors without a session to the login (pages) or answers 401 (API)", () => {
    expect(decide("/admin", null).kind).toBe("login_redirect");
    expect(decide("/admin/tryouts/abc", null).kind).toBe("login_redirect");
    expect(decide("/api/admin/tryouts/abc", null).kind).toBe("unauthorized");
    expect(decide("/api/admin/logout", null).kind).toBe("unauthorized");
  });

  it("treats a session whose email is not allowed like no session", () => {
    expect(decide("/admin", "stranger@example.com").kind).toBe("login_redirect");
    expect(decide("/api/admin/tryouts/abc", "stranger@example.com").kind).toBe("unauthorized");
  });

  it("lets allowed emails in, whatever the letter case", () => {
    expect(decide("/admin", "boss@crow6.com").kind).toBe("allow");
    expect(decide("/api/admin/tryouts/abc", "COACH@crow6.com").kind).toBe("allow");
  });

  it("keeps only the login page and endpoint public", () => {
    expect(decide("/admin/login", null).kind).toBe("allow");
    expect(decide("/admin/login/", null).kind).toBe("allow");
    expect(decide("/api/admin/login", null).kind).toBe("allow");
    expect(decide("/admin/login/extra", null).kind).toBe("login_redirect");
  });

  it("blocks path variants that try to dodge the guard", () => {
    expect(decide("//admin/tryouts", null).kind).toBe("login_redirect");
    expect(decide("/ADMIN/tryouts", null).kind).toBe("login_redirect");
  });
});
