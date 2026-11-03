import type { TryoutApplication } from "@/domain/tryouts/tryout-application";

const CONTACT_ENDPOINT = "/api/contact";
const TOO_MANY_REQUESTS = 429;

export type TryoutSubmissionFailure = "rate_limited" | "submit_failed";

export class TryoutSubmissionError extends Error {
  constructor(readonly reason: TryoutSubmissionFailure) {
    super(`Tryout submission failed: ${reason}`);
  }
}

export async function submitTryoutApplication(application: TryoutApplication): Promise<void> {
  const response = await fetch(CONTACT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(application),
  });

  if (!response.ok) {
    throw new TryoutSubmissionError(
      response.status === TOO_MANY_REQUESTS ? "rate_limited" : "submit_failed",
    );
  }
}
