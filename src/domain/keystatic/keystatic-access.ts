const PAGE_PREFIX = "/keystatic";
const API_PREFIX = "/api/keystatic";

export const KEYSTATIC_GITHUB_LOGIN = "/api/keystatic/github/login";
export const KEYSTATIC_ACCESS_TOKEN_COOKIE = "keystatic-gh-access-token";
export const KEYSTATIC_REFRESH_TOKEN_COOKIE = "keystatic-gh-refresh-token";

const normalize = (pathname: string) => {
  const collapsed = pathname.toLowerCase().replace(/\/{2,}/g, "/");
  return collapsed.length > 1 ? collapsed.replace(/\/+$/, "") : collapsed;
};

const startsWithSegment = (path: string, prefix: string) =>
  path === prefix || path.startsWith(`${prefix}/`);

export function isKeystaticPath(pathname: string): boolean {
  const path = normalize(pathname);
  return startsWithSegment(path, PAGE_PREFIX) || startsWithSegment(path, API_PREFIX);
}

export const isKeystaticApiPath = (pathname: string) =>
  startsWithSegment(normalize(pathname), API_PREFIX);

/** El estado de la sesión de GitHub del visitante, ya comprobado contra GitHub. */
export type GithubSession =
  "none" | "refreshable" | "collaborator" | "not_collaborator" | "unavailable";

export type KeystaticAccess =
  | { kind: "allow" }
  | { kind: "login" }
  | { kind: "forbidden" }
  | { kind: "unavailable" }
  | { kind: "not_found" };

interface AccessInput {
  pathname: string;
  /** En desarrollo Keystatic guarda en local y no hay GitHub de por medio. */
  isDev: boolean;
  /** Las variables de la GitHub App de Keystatic están definidas. */
  configured: boolean;
  session: GithubSession;
}

/**
 * Acceso al panel de Keystatic. En producción solo entra quien tiene sesión de GitHub con
 * permiso de escritura en el repositorio. La API de Keystatic (login y callback de OAuth)
 * se deja pasar porque es la que da esa sesión. Sin configurar la GitHub App el panel no
 * existe: Keystatic mandaría a su asistente de instalación, que no debe verse en producción.
 */
export function decideKeystaticAccess({
  pathname,
  isDev,
  configured,
  session,
}: AccessInput): KeystaticAccess {
  if (isDev) return { kind: "allow" };
  if (!configured) return { kind: "not_found" };
  if (isKeystaticApiPath(pathname)) return { kind: "allow" };

  // "refreshable": el token de acceso caduca antes que el de refresco y el panel lo renueva solo
  switch (session) {
    case "collaborator":
    case "refreshable":
      return { kind: "allow" };
    case "not_collaborator":
      return { kind: "forbidden" };
    case "unavailable":
      return { kind: "unavailable" };
    case "none":
      return { kind: "login" };
  }
}
