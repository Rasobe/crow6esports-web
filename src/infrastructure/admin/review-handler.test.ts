import { describe, expect, it, vi } from "vitest";
import type { TryoutRequestRepository } from "@/domain/tryouts/tryout-request.repository";
import { createReviewHandler } from "./review-handler";

const ORIGIN = "https://crow6esports.com";
const ID = "0b6d5f0e-8f3b-4c43-9a55-6f2a3d8d5c11";

const reviewRequest = (fields: Record<string, string>, headers: Record<string, string> = {}) =>
  new Request(`${ORIGIN}/api/admin/tryouts/${ID}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Origin: ORIGIN, ...headers },
    body: new URLSearchParams(fields),
  });

function setup(updateReview = vi.fn().mockResolvedValue(true)) {
  const repository = { updateReview } as unknown as TryoutRequestRepository;
  return { handle: createReviewHandler({ getRepository: () => repository }), updateReview };
}

describe("review handler", () => {
  it("saves the status and notes and goes back to the request", async () => {
    const { handle, updateReview } = setup();

    const response = await handle(reviewRequest({ status: "contacted", notes: "  Hablado  " }), ID);

    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toBe(`/admin/tryouts/${ID}?saved=1`);
    expect(updateReview).toHaveBeenCalledWith(ID, { status: "contacted", notes: "Hablado" });
  });

  it("stores empty notes as null", async () => {
    const { handle, updateReview } = setup();

    await handle(reviewRequest({ status: "new", notes: "   " }), ID);

    expect(updateReview).toHaveBeenCalledWith(ID, { status: "new", notes: null });
  });

  it("only passes the review fields, never the applicant's data", async () => {
    const { handle, updateReview } = setup();

    await handle(reviewRequest({ status: "new", notes: "", discord: "hacker", rank: "9999" }), ID);

    expect(Object.keys(updateReview.mock.calls[0][1]).sort()).toEqual(["notes", "status"]);
  });

  it("rejects invalid statuses and oversized notes without writing", async () => {
    const { handle, updateReview } = setup();

    const status = await handle(reviewRequest({ status: "banned", notes: "" }), ID);
    const notes = await handle(reviewRequest({ status: "new", notes: "x".repeat(4001) }), ID);

    expect(status.headers.get("Location")).toBe(`/admin/tryouts/${ID}?error=invalid`);
    expect(notes.headers.get("Location")).toBe(`/admin/tryouts/${ID}?error=invalid`);
    expect(updateReview).not.toHaveBeenCalled();
  });

  it("answers 404 for ids that are not uuids", async () => {
    const { handle, updateReview } = setup();

    const response = await handle(reviewRequest({ status: "new", notes: "" }), "1; drop table");

    expect(response.status).toBe(404);
    expect(updateReview).not.toHaveBeenCalled();
  });

  it("requires the request to come from the panel itself", async () => {
    const { handle, updateReview } = setup();

    const crossSite = await handle(
      reviewRequest({ status: "new", notes: "" }, { Origin: "https://evil.example" }),
      ID,
    );
    const noOrigin = await handle(
      new Request(`${ORIGIN}/api/admin/tryouts/${ID}`, {
        method: "POST",
        body: new URLSearchParams({ status: "new", notes: "" }),
      }),
      ID,
    );

    expect(crossSite.status).toBe(403);
    expect(noOrigin.status).toBe(403);
    expect(updateReview).not.toHaveBeenCalled();
  });

  it("reports a storage failure without exposing details", async () => {
    const { handle } = setup(vi.fn().mockRejectedValue(new Error("db password leaked")));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await handle(reviewRequest({ status: "new", notes: "" }), ID);

    expect(response.headers.get("Location")).toBe(`/admin/tryouts/${ID}?error=failed`);
  });
});
