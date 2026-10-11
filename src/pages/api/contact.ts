import type { APIRoute } from "astro";
import { submitTryoutApplication } from "@/application/tryouts/submit-tryout-application";
import { container } from "@/infrastructure/container";
import { tryoutApplicationSchema } from "@/infrastructure/tryouts/tryout-application.schema";

const jsonResponse = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  const payload = await request.json().catch(() => null);
  const parsed = tryoutApplicationSchema.safeParse(payload);

  if (!parsed.success) {
    return jsonResponse({ error: "invalid_payload", issues: parsed.error.issues }, 400);
  }

  try {
    await submitTryoutApplication(container.tryoutNotifier, parsed.data);
    return jsonResponse({ success: true }, 200);
  } catch (error) {
    console.error("Tryout application could not be delivered", error);
    return jsonResponse({ error: "delivery_failed" }, 502);
  }
};
