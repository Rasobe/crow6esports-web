import {
  RESEND_API_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL,
  TRYOUT_EMAIL_FROM,
  TRYOUT_EMAIL_TO,
} from "astro:env/server";
import type { TryoutNotifier } from "@/domain/tryouts/tryout-notifier";
import type { TryoutRepository } from "@/domain/tryouts/tryout-repository";
import { createContentArticleRepository } from "./news/article.content-repository";
import { createJsonProductRepository } from "./store/product.json-repository";
import { createJsonPlayerRepository } from "./team/player.json-repository";
import { createSupabaseClient } from "./supabase/supabase";
import { createSupabaseTryoutRepository } from "./tryouts/tryout.supabase-repository";
import { createResendTryoutNotifier } from "./tryouts/tryout.resend-notifier";

let tryoutNotifier: TryoutNotifier | undefined;
let tryoutRepository: TryoutRepository | undefined;

function resolveTryoutNotifier(): TryoutNotifier {
  if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");

  tryoutNotifier ??= createResendTryoutNotifier({
    apiKey: RESEND_API_KEY,
    from: TRYOUT_EMAIL_FROM,
    to: TRYOUT_EMAIL_TO,
  });

  return tryoutNotifier;
}

function resolveTryoutRepository(): TryoutRepository {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not configured");
  }

  tryoutRepository ??= createSupabaseTryoutRepository(
    createSupabaseClient({ url: SUPABASE_URL, serviceRoleKey: SUPABASE_SERVICE_ROLE_KEY }),
  );

  return tryoutRepository;
}

export const container = {
  playerRepository: createJsonPlayerRepository(),
  productRepository: createJsonProductRepository(),
  articleRepository: createContentArticleRepository(),
  get tryoutRepository(): TryoutRepository {
    return resolveTryoutRepository();
  },
  get tryoutNotifier(): TryoutNotifier {
    return resolveTryoutNotifier();
  },
};
