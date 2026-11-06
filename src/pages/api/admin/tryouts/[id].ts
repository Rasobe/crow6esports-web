import type { APIRoute } from "astro";
import { container } from "@/infrastructure/container";
import { createReviewHandler } from "@/infrastructure/admin/review-handler";

const handleReview = createReviewHandler({
  getRepository: () => container.tryoutRequestRepository,
});

export const POST: APIRoute = ({ request, params }) => handleReview(request, params.id);

export const ALL: APIRoute = () =>
  new Response(null, { status: 405, headers: { Allow: "POST", "Cache-Control": "no-store" } });
