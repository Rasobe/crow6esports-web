import type { APIRoute } from "astro";
import { container } from "@/infrastructure/container";
import { createRateLimiter } from "@/infrastructure/http/rate-limiter";
import { createContactHandler } from "@/infrastructure/tryouts/contact-handler";

const SUBMISSIONS_PER_WINDOW = 5;
const SUBMISSION_WINDOW_MS = 10 * 60 * 1000;

const handleContact = createContactHandler({
  limiter: createRateLimiter({ limit: SUBMISSIONS_PER_WINDOW, windowMs: SUBMISSION_WINDOW_MS }),
  getRepository: () => container.tryoutRepository,
  getNotifier: () => container.tryoutNotifier,
});

export const POST: APIRoute = ({ request, clientAddress }) => handleContact(request, clientAddress);

export const ALL: APIRoute = () =>
  new Response(null, { status: 405, headers: { Allow: "POST", "Cache-Control": "no-store" } });
