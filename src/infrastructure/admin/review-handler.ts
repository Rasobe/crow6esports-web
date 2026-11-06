import type { TryoutRequestRepository } from "@/domain/tryouts/tryout-request.repository";
import { reviewTryoutRequest } from "@/application/admin/tryout-requests";
import { isSameOriginStrict, jsonError, readFormFields, redirectTo } from "./admin-request";
import { requestIdSchema, reviewSchema } from "./admin-schemas";

interface ReviewHandlerDeps {
  getRepository: () => TryoutRequestRepository;
}

const detailPath = (id: string) => `/admin/tryouts/${id}`;

/** The session was already checked by the middleware: this only validates and writes. */
export function createReviewHandler({ getRepository }: ReviewHandlerDeps) {
  return async (request: Request, rawId: string | undefined): Promise<Response> => {
    if (!isSameOriginStrict(request)) return jsonError("forbidden", 403);

    const id = requestIdSchema.safeParse(rawId);
    if (!id.success) return jsonError("not_found", 404);

    const parsed = reviewSchema.safeParse(await readFormFields(request));
    if (!parsed.success) return redirectTo(`${detailPath(id.data)}?error=invalid`);

    try {
      const found = await reviewTryoutRequest(getRepository(), id.data, parsed.data);
      return redirectTo(found ? `${detailPath(id.data)}?saved=1` : "/admin/tryouts");
    } catch (error) {
      console.error("Tryout review could not be saved", error);
      return redirectTo(`${detailPath(id.data)}?error=failed`);
    }
  };
}
