import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { AstroCookies } from "astro";
import type { AdminAuth } from "@/domain/admin/admin-auth";

interface AdminAuthConfig {
  url: string;
  key: string;
  request: Request;
  cookies: AstroCookies;
  /** Cookies are Secure everywhere except plain http local development. */
  secure: boolean;
}

const SUPABASE_COOKIE_PREFIX = "sb-";

/**
 * Session handling on top of @supabase/ssr. The session lives in httpOnly cookies that only
 * the server reads, so no script on the page can ever see the tokens.
 */
export function createSupabaseAdminAuth({
  url,
  key,
  request,
  cookies,
  secure,
}: AdminAuthConfig): AdminAuth {
  const requestCookies = parseCookieHeader(request.headers.get("cookie") ?? "");
  const hasSessionCookie = requestCookies.some(({ name }) =>
    name.startsWith(SUPABASE_COOKIE_PREFIX),
  );

  const client = createServerClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: false, detectSessionInUrl: false },
    cookies: {
      getAll: () => requestCookies.map(({ name, value }) => ({ name, value: value ?? "" })),
      setAll: (cookiesToSet) => {
        for (const { name, value, options } of cookiesToSet) {
          cookies.set(name, value, {
            ...options,
            httpOnly: true,
            secure,
            sameSite: "lax",
            path: "/",
          });
        }
      },
    },
  });

  return {
    async getVerifiedEmail() {
      // Without Supabase cookies there is no session to verify: skip the network call
      if (!hasSessionCookie) return null;
      try {
        const { data, error } = await client.auth.getUser();
        return error ? null : (data.user?.email ?? null);
      } catch {
        return null;
      }
    },

    async signIn(email, password) {
      try {
        const { data, error } = await client.auth.signInWithPassword({ email, password });
        return !error && Boolean(data.session);
      } catch {
        return false;
      }
    },

    async signOut() {
      try {
        await client.auth.signOut();
      } catch {
        // Cookies are cleared by the client even if the auth server cannot be reached
      }
    },
  };
}
