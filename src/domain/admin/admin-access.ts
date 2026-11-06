const LOGIN_PAGE = "/admin/login";
const LOGIN_ENDPOINT = "/api/admin/login";
const ADMIN_PREFIXES = ["/admin", "/api/admin"] as const;
const API_PREFIX = "/api/";

export const ADMIN_LOGIN_PAGE = LOGIN_PAGE;
export const ADMIN_HOME_PAGE = "/admin";

const PUBLIC_ADMIN_PATHS: ReadonlySet<string> = new Set([LOGIN_PAGE, LOGIN_ENDPOINT]);

/** Lowercase, no repeated or trailing slashes: variants of a path must not slip past the guard. */
function normalizePath(pathname: string): string {
  const collapsed = pathname.toLowerCase().replace(/\/{2,}/g, "/");
  return collapsed.length > 1 ? collapsed.replace(/\/+$/, "") : collapsed;
}

export function isAdminPath(pathname: string): boolean {
  const path = normalizePath(pathname);
  return ADMIN_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

/** Comma separated list, case insensitive. An empty or missing list allows nobody. */
export function parseAllowedEmails(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdminEmail(
  email: string | null | undefined,
  allowedEmails: readonly string[],
): boolean {
  return Boolean(email) && allowedEmails.includes(email!.trim().toLowerCase());
}

export type AdminAccess = { kind: "allow" } | { kind: "login_redirect" } | { kind: "unauthorized" };

interface AccessInput {
  pathname: string;
  /** Email of the session verified on the server, or null when there is no valid session. */
  email: string | null;
  allowedEmails: readonly string[];
}

/**
 * What to do with a request to /admin/* or /api/admin/*. Only the login page and endpoint are
 * public; everything else needs a valid session whose email is in the allow list. Pages send
 * the visitor to the login, API calls get a 401.
 */
export function decideAdminAccess({ pathname, email, allowedEmails }: AccessInput): AdminAccess {
  const path = normalizePath(pathname);
  if (PUBLIC_ADMIN_PATHS.has(path)) return { kind: "allow" };
  if (isAllowedAdminEmail(email, allowedEmails)) return { kind: "allow" };
  return path.startsWith(API_PREFIX) ? { kind: "unauthorized" } : { kind: "login_redirect" };
}
