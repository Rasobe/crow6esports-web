import type { APIRoute } from "astro";
import { submitTryoutApplication } from "@/application/tryouts/submit-tryout-application";
import { container } from "@/infrastructure/container";
import { createRateLimiter } from "@/infrastructure/http/rate-limiter";
import { isJsonRequest, isSameOrigin, readJsonBody } from "@/infrastructure/http/request-guards";
import { tryoutApplicationSchema } from "@/infrastructure/tryouts/tryout-application.schema";

const SUBMISSIONS_PER_WINDOW = 5;
const SUBMISSION_WINDOW_MS = 10 * 60 * 1000;
const MS_PER_SECOND = 1000;

const submissionLimiter = createRateLimiter({
  limit: SUBMISSIONS_PER_WINDOW,
  windowMs: SUBMISSION_WINDOW_MS,
});

const jsonResponse = (body: unknown, status: number, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers },
  });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!isSameOrigin(request)) return jsonResponse({ error: "forbidden_origin" }, 403);
  if (!isJsonRequest(request)) return jsonResponse({ error: "unsupported_media_type" }, 415);

  const body = await readJsonBody(request);
  if (!body.ok) {
    return body.reason === "too_large"
      ? jsonResponse({ error: "payload_too_large" }, 413)
      : jsonResponse({ error: "invalid_payload" }, 400);
  }

  const parsed = tryoutApplicationSchema.safeParse(body.value);
  if (!parsed.success) {
    return jsonResponse({ error: "invalid_payload", issues: parsed.error.issues }, 400);
  }

  const retryAfterMs = submissionLimiter.hit(clientAddress);
  if (retryAfterMs > 0) {
    const retryAfter = String(Math.ceil(retryAfterMs / MS_PER_SECOND));
    return jsonResponse({ error: "rate_limited" }, 429, { "Retry-After": retryAfter });
  }

  try {
    await submitTryoutApplication(container.tryoutNotifier, parsed.data);
    return jsonResponse({ success: true }, 200);
  } catch (error) {
    console.error("Tryout application could not be delivered", error);
    return jsonResponse({ error: "delivery_failed" }, 502);
  }
};
