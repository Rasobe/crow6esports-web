import { describe, expect, it } from "vitest";
import {
  decideKeystaticAccess,
  isKeystaticPath,
  type GithubSession,
  type KeystaticAccess,
} from "./keystatic-access";

const production = { isDev: false, configured: true };
const decide = (
  pathname: string,
  session: GithubSession,
  overrides = {},
): KeystaticAccess["kind"] =>
  decideKeystaticAccess({ pathname, session, ...production, ...overrides }).kind;

describe("isKeystaticPath", () => {
  it("covers the panel, its API and path variants", () => {
    for (const path of [
      "/keystatic",
      "/keystatic/",
      "/keystatic/collection/news",
      "/api/keystatic/github/login",
      "/KEYSTATIC",
      "//keystatic",
    ]) {
      expect(isKeystaticPath(path)).toBe(true);
    }
  });

  it("ignores everything else", () => {
    for (const path of [
      "/",
      "/es/news",
      "/admin",
      "/api/admin/login",
      "/keystatics",
      "/api/contact",
    ]) {
      expect(isKeystaticPath(path)).toBe(false);
    }
  });
});

describe("decideKeystaticAccess", () => {
  it("sends visitors without a GitHub session to the GitHub login", () => {
    expect(decide("/keystatic", "none")).toBe("login");
    expect(decide("/keystatic/collection/news", "none")).toBe("login");
  });

  it("lets repository collaborators in", () => {
    expect(decide("/keystatic", "collaborator")).toBe("allow");
    expect(decide("/keystatic/collection/news/item/x", "collaborator")).toBe("allow");
  });

  it("lets the panel renew an expired access token", () => {
    expect(decide("/keystatic", "refreshable")).toBe("allow");
  });

  it("blocks GitHub users who cannot write to the repository", () => {
    expect(decide("/keystatic", "not_collaborator")).toBe("forbidden");
  });

  it("does not let anyone in when GitHub cannot be reached", () => {
    expect(decide("/keystatic", "unavailable")).toBe("unavailable");
  });

  it("keeps the OAuth endpoints reachable, as they are what creates the session", () => {
    expect(decide("/api/keystatic/github/login", "none")).toBe("allow");
    expect(decide("/api/keystatic/github/oauth/callback", "none")).toBe("allow");
  });

  it("hides the panel in production until the GitHub App is configured", () => {
    expect(decide("/keystatic", "collaborator", { configured: false })).toBe("not_found");
    expect(decide("/api/keystatic/github/login", "none", { configured: false })).toBe("not_found");
    expect(decide("/keystatic/setup", "none", { configured: false })).toBe("not_found");
  });

  it("does not ask for GitHub in development, where Keystatic stores locally", () => {
    expect(decide("/keystatic", "none", { isDev: true, configured: false })).toBe("allow");
  });
});
