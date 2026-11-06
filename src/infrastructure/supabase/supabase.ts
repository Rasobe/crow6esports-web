import { createClient, type SupabaseClient } from "@supabase/supabase-js";

interface SupabaseConfig {
  url: string;
  serviceRoleKey: string;
}

/**
 * Server-only client authenticated with the service role key, which bypasses RLS.
 * Import it solely from server code; the key must never reach the browser bundle.
 */
export function createSupabaseClient({ url, serviceRoleKey }: SupabaseConfig): SupabaseClient {
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
