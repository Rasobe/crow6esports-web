import {
  decideAdminAccess,
  isAllowedAdminEmail,
  ADMIN_LOGIN_PAGE,
} from "@/domain/admin/admin-access";

interface AdminGuardInput {
  pathname: string;
  /** Verifies the session on the server. Called on every request, never cached. */
  getVerifiedEmail: () => Promise<string | null>;
  allowedEmails: readonly string[];
}

export type AdminGuardResult =
  { allowed: true; adminEmail: string | null } | { allowed: false; response: Response };

const NO_STORE = { "Cache-Control": "no-store" };

export async function guardAdminRequest({
  pathname,
  getVerifiedEmail,
  allowedEmails,
}: AdminGuardInput): Promise<AdminGuardResult> {
  const email = await getVerifiedEmail();
  const access = decideAdminAccess({ pathname, email, allowedEmails });

  if (access.kind === "login_redirect") {
    return {
      allowed: false,
      response: new Response(null, {
        status: 302,
        headers: { ...NO_STORE, Location: ADMIN_LOGIN_PAGE },
      }),
    };
  }

  if (access.kind === "unauthorized") {
    return {
      allowed: false,
      response: new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...NO_STORE, "Content-Type": "application/json" },
      }),
    };
  }

  return { allowed: true, adminEmail: isAllowedAdminEmail(email, allowedEmails) ? email : null };
}
