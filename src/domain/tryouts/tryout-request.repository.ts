import type {
  TryoutRequest,
  TryoutRequestPage,
  TryoutRequestQuery,
  TryoutReview,
} from "./tryout-request";

export interface TryoutRequestRepository {
  /** Newest first. */
  list(query: TryoutRequestQuery): Promise<TryoutRequestPage>;
  findById(id: string): Promise<TryoutRequest | null>;
  /** Only the review fields change, never the applicant's data. Resolves false if the id does not exist. */
  updateReview(id: string, review: TryoutReview): Promise<boolean>;
}
