import type { AdminAuth } from "@/domain/admin/admin-auth";
import { isAllowedAdminEmail } from "@/domain/admin/admin-access";

/**
 * Only emails in the allow list ever reach the auth server, so a valid account that is not an
 * admin can never obtain a session through this panel.
 */
export async function signInAdmin(
  auth: AdminAuth,
  allowedEmails: readonly string[],
  email: string,
  password: string,
): Promise<boolean> {
  if (!isAllowedAdminEmail(email, allowedEmails)) return false;
  return auth.signIn(email.trim(), password);
}
