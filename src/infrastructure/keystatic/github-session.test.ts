import { describe, expect, it, vi } from "vitest";
import { resolveGithubSession } from "./github-session";

const repository = { owner: "Rasobe", name: "crow6esports-web" };

const respond = (status: number, body: unknown = {}) =>
  vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));

const session = (
  accessToken: string | undefined,
  hasRefreshToken: boolean,
  fetchImpl = respond(200),
) => resolveGithubSession({ accessToken, hasRefreshToken, repository, fetchImpl });

describe("resolveGithubSession", () => {
  it("has no session without tokens and never calls GitHub", async () => {
    const fetchImpl = respond(200);

    await expect(session(undefined, false, fetchImpl)).resolves.toBe("none");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("relies on the refresh token when the access token has expired", async () => {
    await expect(session(undefined, true)).resolves.toBe("refreshable");
  });

  it("recognizes a collaborator by the push permission on the repository", async () => {
    const fetchImpl = respond(200, { permissions: { push: true } });

    await expect(session("token", true, fetchImpl)).resolves.toBe("collaborator");
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://api.github.com/repos/Rasobe/crow6esports-web",
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer token" }),
      }),
    );
  });

  it("rejects users who can only read the repository", async () => {
    await expect(
      session("token", true, respond(200, { permissions: { push: false } })),
    ).resolves.toBe("not_collaborator");
    await expect(session("token", true, respond(200, {}))).resolves.toBe("not_collaborator");
  });

  it("rejects tokens GitHub says cannot see the repository", async () => {
    await expect(session("token", true, respond(404))).resolves.toBe("not_collaborator");
    await expect(session("token", true, respond(403))).resolves.toBe("not_collaborator");
  });

  it("treats a rejected token as expired", async () => {
    await expect(session("stale", true, respond(401))).resolves.toBe("refreshable");
    await expect(session("stale", false, respond(401))).resolves.toBe("none");
  });

  it("reports GitHub as unavailable instead of letting anyone in", async () => {
    const failing = vi.fn().mockRejectedValue(new Error("network"));

    await expect(session("token", true, failing)).resolves.toBe("unavailable");
  });
});
