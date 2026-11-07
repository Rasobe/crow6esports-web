import { submitTryoutApplication } from "@/application/tryouts/submit-tryout-application";
import type { TryoutNotifier } from "@/domain/tryouts/tryout-notifier";
import type { TryoutRepository } from "@/domain/tryouts/tryout-repository";
import type { RateLimiter } from "@/infrastructure/http/rate-limiter";
import { isJsonRequest, isSameOrigin, readJsonBody } from "@/infrastructure/http/request-guards";
import { tryoutSubmissionSchema } from "./tryout-application.schema";

/** Campo invisible para las personas: si llega relleno, lo ha enviado un bot. */
export const HONEYPOT_FIELD = "website";

const MS_PER_SECOND = 1000;

interface ContactHandlerDeps {
  limiter: RateLimiter;
  /** Se resuelven en cada envío para no exigir la configuración externa al arrancar. */
  getRepository: () => TryoutRepository;
  getNotifier: () => TryoutNotifier;
}

const jsonResponse = (body: unknown, status: number, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers },
  });

const isHoneypotFilled = (body: unknown) =>
  typeof body === "object" &&
  body !== null &&
  HONEYPOT_FIELD in body &&
  Boolean((body as Record<string, unknown>)[HONEYPOT_FIELD]);

export function createContactHandler({ limiter, getRepository, getNotifier }: ContactHandlerDeps) {
  return async (request: Request, clientAddress: string): Promise<Response> => {
    if (!isSameOrigin(request)) return jsonResponse({ error: "forbidden_origin" }, 403);
    if (!isJsonRequest(request)) return jsonResponse({ error: "unsupported_media_type" }, 415);

    const body = await readJsonBody(request);
    if (!body.ok) {
      return body.reason === "too_large"
        ? jsonResponse({ error: "payload_too_large" }, 413)
        : jsonResponse({ error: "invalid_payload" }, 400);
    }

    // Se responde como si todo fuera bien para que el bot no aprenda a evitarlo
    if (isHoneypotFilled(body.value)) return jsonResponse({ success: true }, 200);

    const parsed = tryoutSubmissionSchema.safeParse(body.value);
    if (!parsed.success) {
      return jsonResponse({ error: "invalid_payload", issues: parsed.error.issues }, 400);
    }

    const retryAfterMs = limiter.hit(clientAddress);
    if (retryAfterMs > 0) {
      const retryAfter = String(Math.ceil(retryAfterMs / MS_PER_SECOND));
      return jsonResponse({ error: "rate_limited" }, 429, { "Retry-After": retryAfter });
    }

    const { locale, sourcePage, referrer, utmSource, utmMedium, utmCampaign, ...application } =
      parsed.data;
    const attribution = { sourcePage, referrer, utmSource, utmMedium, utmCampaign };

    try {
      await submitTryoutApplication(
        {
          repository: getRepository(),
          // Resolución diferida: una configuración de correo ausente no debe impedir guardar
          notifier: { notify: (submitted) => getNotifier().notify(submitted) },
          onNotificationFailure: (error) =>
            console.error("Tryout application stored but the email could not be sent", error),
        },
        application,
        locale,
        attribution,
      );
      return jsonResponse({ success: true }, 200);
    } catch (error) {
      console.error("Tryout application could not be stored", error);
      return jsonResponse({ error: "persist_failed" }, 500);
    }
  };
}
