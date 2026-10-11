import { useFormContext } from "react-hook-form";
import type { Translate } from "@/ui/i18n";
import { TextField } from "@/ui/shared/components/text-field/TextField";
import { getFieldError } from "@/ui/features/tryouts/lib/field-error";
import type { TryoutsFormValues } from "@/ui/features/tryouts/schemas/tryouts-form.schema";

interface StepProps {
  t: Translate;
}

export function StepProfile({ t }: StepProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<TryoutsFormValues>();

  const error = (field: keyof TryoutsFormValues) => getFieldError(errors, field, t);

  return (
    <div className="tryouts-step">
      <div className="tryouts-step__row">
        <TextField
          label={t("fields.discord.label")}
          placeholder={t("fields.discord.placeholder")}
          hint={t("fields.discord.hint")}
          error={error("discord")}
          required
          {...register("discord")}
        />

        <TextField
          label={t("fields.birth_date.label")}
          placeholder={t("fields.birth_date.placeholder")}
          type="date"
          error={error("birthDate")}
          required
          {...register("birthDate")}
        />
      </div>

      <TextField
        label={t("fields.country.label")}
        placeholder={t("fields.country.placeholder")}
        error={error("country")}
        required
        {...register("country")}
      />

      <div className="tryouts-step__row">
        <TextField
          label={t("fields.availability_weekdays.label")}
          placeholder={t("fields.availability_weekdays.placeholder")}
          error={error("availabilityWeekdays")}
          required
          {...register("availabilityWeekdays")}
        />

        <TextField
          label={t("fields.availability_weekends.label")}
          placeholder={t("fields.availability_weekends.placeholder")}
          error={error("availabilityWeekends")}
          required
          {...register("availabilityWeekends")}
        />
      </div>

      <TextField
        label={t("fields.availability_scrims.label")}
        placeholder={t("fields.availability_scrims.placeholder")}
        error={error("availabilityScrims")}
        required
        {...register("availabilityScrims")}
      />
    </div>
  );
}
