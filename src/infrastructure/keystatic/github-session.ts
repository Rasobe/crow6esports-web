import type { GithubSession } from "@/domain/keystatic/keystatic-access";

interface SessionInput {
  accessToken: string | undefined;
  hasRefreshToken: boolean;
  repository: { owner: string; name: string };
  fetchImpl?: typeof fetch;
}

interface RepositoryResponse {
  permissions?: { push?: boolean };
}

const GITHUB_API = "https://api.github.com";
const HTTP_UNAUTHORIZED = 401;

/**
 * Comprueba contra GitHub, en cada carga del panel, que el token es válido y que su dueño
 * puede escribir en el repositorio. El token nunca se da por bueno solo por existir.
 */
export async function resolveGithubSession({
  accessToken,
  hasRefreshToken,
  repository,
  fetchImpl = fetch,
}: SessionInput): Promise<GithubSession> {
  if (!accessToken) return hasRefreshToken ? "refreshable" : "none";

  try {
    const response = await fetchImpl(`${GITHUB_API}/repos/${repository.owner}/${repository.name}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (response.status === HTTP_UNAUTHORIZED) return hasRefreshToken ? "refreshable" : "none";
    if (!response.ok) return "not_collaborator";

    const { permissions } = (await response.json()) as RepositoryResponse;
    return permissions?.push === true ? "collaborator" : "not_collaborator";
  } catch {
    return "unavailable";
  }
}
