import type { Attribution } from "./attribution";
import type { SubmissionLocale, TryoutApplication } from "./tryout-application";

export interface TryoutRepository {
  /** Persists a new application with status `new`. Rejects if it could not be stored. */
  save(
    application: TryoutApplication,
    locale: SubmissionLocale,
    attribution: Attribution,
  ): Promise<void>;
}
