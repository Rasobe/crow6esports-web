import type { RequestStatus, SubmissionLocale, TryoutApplication } from "./tryout-application";

/** An application as stored: the applicant's data (read only) plus the team's review. */
export type TryoutRequest = TryoutApplication & {
  id: string;
  createdAt: string;
  status: RequestStatus;
  locale: SubmissionLocale;
  notes: string | null;
};

export interface TryoutRequestPage {
  items: TryoutRequest[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TryoutRequestQuery {
  status?: RequestStatus;
  page: number;
  pageSize: number;
}

export interface TryoutReview {
  status: RequestStatus;
  notes: string | null;
}
