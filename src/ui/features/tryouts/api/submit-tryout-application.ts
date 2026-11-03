import type { TryoutApplication } from "@/domain/tryouts/tryout-application";

const CONTACT_ENDPOINT = "/api/contact";
const TOO_MANY_REQUESTS = 429;

export type TryoutSubmissionFailure = "rate_limited" | "submit_failed";

export class TryoutSubmissionError extends Error {
  constructor(readonly reason: TryoutSubmissionFailure) {
    super(`Tryout submission failed: ${reason}`);
  }
}

/** Nombre del campo trampa; debe coincidir con el que comprueba el endpoint. */
export const HONEYPOT_FIELD = "website";

export async function submitTryoutApplication(
  application: TryoutApplication,
  honeypot = "",
): Promise<void> {
  const response = await fetch(CONTACT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...application, [HONEYPOT_FIELD]: honeypot }),
  });

  if (!response.ok) {
    throw new TryoutSubmissionError(
      response.status === TOO_MANY_REQUESTS ? "rate_limited" : "submit_failed",
    );
  }
}
