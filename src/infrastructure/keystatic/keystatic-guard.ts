import {
  KEYSTATIC_GITHUB_LOGIN,
  decideKeystaticAccess,
  isKeystaticApiPath,
  type GithubSession,
} from "@/domain/keystatic/keystatic-access";

interface KeystaticGuardInput {
  pathname: string;
  isDev: boolean;
  configured: boolean;
  /** Solo se consulta a GitHub cuando hace falta: no en desarrollo ni en la API. */
  resolveSession: () => Promise<GithubSession>;
}

const NO_STORE = { "Cache-Control": "no-store" };

const text = (status: number, body: string) =>
  new Response(body, {
    status,
    headers: { ...NO_STORE, "Content-Type": "text/plain; charset=utf-8" },
  });

/** Una respuesta que corta la petición, o null si Keystatic puede atenderla. */
export async function guardKeystaticRequest({
  pathname,
  isDev,
  configured,
  resolveSession,
}: KeystaticGuardInput): Promise<Response | null> {
  const needsSession = !isDev && configured && !isKeystaticApiPath(pathname);
  const session = needsSession ? await resolveSession() : "none";
  const access = decideKeystaticAccess({ pathname, isDev, configured, session });

  switch (access.kind) {
    case "allow":
      return null;
    case "login":
      return new Response(null, {
        status: 302,
        headers: { ...NO_STORE, Location: KEYSTATIC_GITHUB_LOGIN },
      });
    case "forbidden":
      return text(403, "Forbidden");
    case "unavailable":
      return text(503, "Service Unavailable");
    case "not_found":
      return text(404, "Not Found");
  }
}
