import type { TryoutsFormValues } from "../schemas/tryouts-form.schema";

const CONTACT_ENDPOINT = "/api/contact";

export async function submitTryoutApplication(values: TryoutsFormValues): Promise<void> {
  const response = await fetch(CONTACT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error(`Tryout submission failed with status ${response.status}`);
  }
}
