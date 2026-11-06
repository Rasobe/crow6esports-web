import type { APIRoute } from "astro";
import { ADMIN_LOGIN_PAGE } from "@/domain/admin/admin-access";
import { isSameOriginStrict, redirectTo } from "@/infrastructure/admin/admin-request";

export const POST: APIRoute = async ({ request, locals }) => {
  if (isSameOriginStrict(request)) await locals.adminAuth?.signOut();
  return redirectTo(ADMIN_LOGIN_PAGE);
};

export const ALL: APIRoute = () =>
  new Response(null, { status: 405, headers: { Allow: "POST", "Cache-Control": "no-store" } });
