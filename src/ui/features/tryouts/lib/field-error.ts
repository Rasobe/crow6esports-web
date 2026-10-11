import type { FieldErrors } from "react-hook-form";
import type { Translate } from "@/ui/i18n";
import type { TryoutsFormValues } from "../schemas/tryouts-form.schema";

export function getFieldError(
  errors: FieldErrors<TryoutsFormValues>,
  field: keyof TryoutsFormValues,
  t: Translate,
): string | undefined {
  const message = errors[field]?.message;
  return typeof message === "string" ? t(message) : undefined;
}
