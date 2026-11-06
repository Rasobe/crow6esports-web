import type { APIRoute } from "astro";
import { container } from "@/infrastructure/container";
import { createLoginHandler } from "@/infrastructure/admin/login-handler";
import { createRateLimiter } from "@/infrastructure/http/rate-limiter";
import { signInAdmin } from "@/application/admin/sign-in-admin";

const ATTEMPTS_PER_WINDOW = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

const loginLimiter = createRateLimiter({ limit: ATTEMPTS_PER_WINDOW, windowMs: ATTEMPT_WINDOW_MS });

export const POST: APIRoute = ({ request, clientAddress, locals }) => {
  const { adminAuth } = locals;

  return createLoginHandler({
    limiter: loginLimiter,
    signIn: async (email, password) =>
      adminAuth ? signInAdmin(adminAuth, container.adminAllowedEmails, email, password) : false,
  })(request, clientAddress);
};

export const ALL: APIRoute = () =>
  new Response(null, { status: 405, headers: { Allow: "POST", "Cache-Control": "no-store" } });
