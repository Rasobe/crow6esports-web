import { RESEND_API_KEY, TRYOUT_EMAIL_FROM, TRYOUT_EMAIL_TO } from "astro:env/server";
import type { TryoutNotifier } from "@/domain/tryouts/tryout-notifier";
import { createContentArticleRepository } from "./news/article.content-repository";
import { createJsonProductRepository } from "./store/product.json-repository";
import { createJsonPlayerRepository } from "./team/player.json-repository";
import { createResendTryoutNotifier } from "./tryouts/tryout.resend-notifier";

let tryoutNotifier: TryoutNotifier | undefined;

function resolveTryoutNotifier(): TryoutNotifier {
  if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");

  tryoutNotifier ??= createResendTryoutNotifier({
    apiKey: RESEND_API_KEY,
    from: TRYOUT_EMAIL_FROM,
    to: TRYOUT_EMAIL_TO,
  });

  return tryoutNotifier;
}

export const container = {
  playerRepository: createJsonPlayerRepository(),
  productRepository: createJsonProductRepository(),
  articleRepository: createContentArticleRepository(),
  get tryoutNotifier(): TryoutNotifier {
    return resolveTryoutNotifier();
  },
};
