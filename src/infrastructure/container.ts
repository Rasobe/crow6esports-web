import {
  ADMIN_EMAILS,
  KEYSTATIC_GITHUB_CLIENT_ID,
  KEYSTATIC_GITHUB_CLIENT_SECRET,
  KEYSTATIC_SECRET,
  RESEND_API_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL,
  TRYOUT_EMAIL_FROM,
  TRYOUT_EMAIL_TO,
} from "astro:env/server";
import type { AstroCookies } from "astro";
import type { SupabaseClient } from "@supabase/supabase-js";
import { parseAllowedEmails } from "@/domain/admin/admin-access";
import type { AdminAuth } from "@/domain/admin/admin-auth";
import type { TryoutRequestRepository } from "@/domain/tryouts/tryout-request.repository";
import type { TryoutNotifier } from "@/domain/tryouts/tryout-notifier";
import type { TryoutRepository } from "@/domain/tryouts/tryout-repository";
import { createContentArticleRepository } from "./news/article.content-repository";
import { createJsonProductRepository } from "./store/product.json-repository";
import { createJsonPlayerRepository } from "./team/player.json-repository";
import { createSupabaseAdminAuth } from "./admin/supabase-admin-auth";
import { createSupabaseClient } from "./supabase/supabase";
import { createSupabaseTryoutRequestRepository } from "./tryouts/tryout-request.supabase-repository";
import { createSupabaseTryoutRepository } from "./tryouts/tryout.supabase-repository";
import { createResendTryoutNotifier } from "./tryouts/tryout.resend-notifier";

let tryoutNotifier: TryoutNotifier | undefined;
let supabaseClient: SupabaseClient | undefined;
let tryoutRepository: TryoutRepository | undefined;
let tryoutRequestRepository: TryoutRequestRepository | undefined;

function resolveTryoutNotifier(): TryoutNotifier {
  if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");

  tryoutNotifier ??= createResendTryoutNotifier({
    apiKey: RESEND_API_KEY,
    from: TRYOUT_EMAIL_FROM,
    to: TRYOUT_EMAIL_TO,
  });

  return tryoutNotifier;
}

function resolveSupabaseClient(): SupabaseClient {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not configured");
  }

  supabaseClient ??= createSupabaseClient({
    url: SUPABASE_URL,
    serviceRoleKey: SUPABASE_SERVICE_ROLE_KEY,
  });

  return supabaseClient;
}

function resolveTryoutRepository(): TryoutRepository {
  tryoutRepository ??= createSupabaseTryoutRepository(resolveSupabaseClient());
  return tryoutRepository;
}

function resolveTryoutRequestRepository(): TryoutRequestRepository {
  tryoutRequestRepository ??= createSupabaseTryoutRequestRepository(resolveSupabaseClient());
  return tryoutRequestRepository;
}

function createAdminAuth(request: Request, cookies: AstroCookies): AdminAuth {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not configured");
  }

  return createSupabaseAdminAuth({
    url: SUPABASE_URL,
    key: SUPABASE_SERVICE_ROLE_KEY,
    request,
    cookies,
    secure: !import.meta.env.DEV,
  });
}

export const container = {
  playerRepository: createJsonPlayerRepository(),
  productRepository: createJsonProductRepository(),
  articleRepository: createContentArticleRepository(),
  get tryoutRepository(): TryoutRepository {
    return resolveTryoutRepository();
  },
  get tryoutRequestRepository(): TryoutRequestRepository {
    return resolveTryoutRequestRepository();
  },
  adminAllowedEmails: parseAllowedEmails(ADMIN_EMAILS),
  keystaticConfigured: Boolean(
    KEYSTATIC_GITHUB_CLIENT_ID && KEYSTATIC_GITHUB_CLIENT_SECRET && KEYSTATIC_SECRET,
  ),
  createAdminAuth,
  get tryoutNotifier(): TryoutNotifier {
    return resolveTryoutNotifier();
  },
};
