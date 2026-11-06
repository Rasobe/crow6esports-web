import { DEFAULT_PAGE_SIZE } from "@/domain/admin/pagination";
import type {
  TryoutRequest,
  TryoutRequestPage,
  TryoutReview,
} from "@/domain/tryouts/tryout-request";
import type { TryoutRequestRepository } from "@/domain/tryouts/tryout-request.repository";
import type { RequestStatus } from "@/domain/tryouts/tryout-application";

const OVERVIEW_LATEST_COUNT = 10;

export interface AdminOverview {
  newTryouts: number;
  latestTryouts: TryoutRequest[];
}

export function listTryoutRequests(
  repository: TryoutRequestRepository,
  { status, page }: { status?: RequestStatus; page: number },
): Promise<TryoutRequestPage> {
  return repository.list({ status, page, pageSize: DEFAULT_PAGE_SIZE });
}

export function getTryoutRequest(
  repository: TryoutRequestRepository,
  id: string,
): Promise<TryoutRequest | null> {
  return repository.findById(id);
}

export function reviewTryoutRequest(
  repository: TryoutRequestRepository,
  id: string,
  review: TryoutReview,
): Promise<boolean> {
  return repository.updateReview(id, review);
}

export async function getAdminOverview(
  repository: TryoutRequestRepository,
): Promise<AdminOverview> {
  const [pending, latest] = await Promise.all([
    repository.list({ status: "new", page: 1, pageSize: 1 }),
    repository.list({ page: 1, pageSize: OVERVIEW_LATEST_COUNT }),
  ]);
  return { newTryouts: pending.total, latestTryouts: latest.items };
}
