import { describe, expect, it, vi } from "vitest";
import type { GithubSession } from "@/domain/keystatic/keystatic-access";
import { guardKeystaticRequest } from "./keystatic-guard";

function run(
  pathname: string,
  session: GithubSession,
  overrides: { isDev?: boolean; configured?: boolean } = {},
) {
  const resolveSession = vi.fn().mockResolvedValue(session);
  const result = guardKeystaticRequest({
    pathname,
    isDev: false,
    configured: true,
    resolveSession,
    ...overrides,
  });
  return { resolveSession, result };
}

describe("keystatic guard", () => {
  it("redirects an anonymous visitor to the GitHub login", async () => {
    const response = await run("/keystatic", "none").result;

    expect(response?.status).toBe(302);
    expect(response?.headers.get("Location")).toBe("/api/keystatic/github/login");
  });

  it("answers 403 to a GitHub user who is not a collaborator", async () => {
    expect((await run("/keystatic", "not_collaborator").result)?.status).toBe(403);
  });

  it("answers 503 when GitHub cannot be checked", async () => {
    expect((await run("/keystatic", "unavailable").result)?.status).toBe(503);
  });

  it("answers 404 in production while the GitHub App is not configured", async () => {
    const { result, resolveSession } = run("/keystatic", "collaborator", { configured: false });

    expect((await result)?.status).toBe(404);
    expect(resolveSession).not.toHaveBeenCalled();
  });

  it("lets collaborators through", async () => {
    expect(await run("/keystatic", "collaborator").result).toBeNull();
  });

  it("only asks GitHub for the pages, not for the OAuth endpoints or in development", async () => {
    const api = run("/api/keystatic/github/login", "none");
    const dev = run("/keystatic", "none", { isDev: true, configured: false });

    expect(await api.result).toBeNull();
    expect(await dev.result).toBeNull();
    expect(api.resolveSession).not.toHaveBeenCalled();
    expect(dev.resolveSession).not.toHaveBeenCalled();
  });

  it("never marks its responses as cacheable", async () => {
    const response = await run("/keystatic", "none").result;

    expect(response?.headers.get("Cache-Control")).toBe("no-store");
  });
});
