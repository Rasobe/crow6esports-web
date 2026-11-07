import { describe, expect, it, vi } from "vitest";
import type { TryoutRequest } from "@/domain/tryouts/tryout-request";
import type { TryoutRequestRepository } from "@/domain/tryouts/tryout-request.repository";
import { getAdminOverview, listTryoutRequests } from "./tryout-requests";

const request = { id: "1", discord: "player" } as TryoutRequest;

function fakeRepository(): TryoutRequestRepository {
  return {
    list: vi.fn(async ({ status, pageSize, page }) => ({
      items: status === "new" ? [] : [request],
      total: status === "new" ? 7 : 42,
      page,
      pageSize,
    })),
    findById: vi.fn(),
    updateReview: vi.fn(),
  };
}

describe("admin use cases", () => {
  it("lists with the default page size", async () => {
    const repository = fakeRepository();

    await listTryoutRequests(repository, { status: "contacted", page: 2 });

    expect(repository.list).toHaveBeenCalledWith({ status: "contacted", page: 2, pageSize: 20 });
  });

  it("summarizes new requests and the latest ten", async () => {
    const repository = fakeRepository();

    const overview = await getAdminOverview(repository);

    expect(overview).toEqual({ newTryouts: 7, latestTryouts: [request] });
    expect(repository.list).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
  });
});
