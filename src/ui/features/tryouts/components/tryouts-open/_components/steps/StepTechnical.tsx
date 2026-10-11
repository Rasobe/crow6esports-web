import { useFormContext } from "react-hook-form";
import { PLAYSTYLES } from "@/domain/tryouts/tryout-application";
import type { Translate } from "@/ui/i18n";
import { SelectField } from "@/ui/shared/components/select-field";
import { TextField } from "@/ui/shared/components/text-field";
import { getFieldError } from "@/ui/features/tryouts/lib/field-error";
import type { TryoutsFormValues } from "@/ui/features/tryouts/schemas/tryouts-form.schema";

interface StepProps {
  t: Translate;
}

export function StepTechnical({ t }: StepProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<TryoutsFormValues>();

  const error = (field: keyof TryoutsFormValues) => getFieldError(errors, field, t);

  return (
    <div className="tryouts-step">
      <TextField
        label={t("fields.rltracker.label")}
        placeholder={t("fields.rltracker.placeholder")}
        type="url"
        error={error("rltracker")}
        required
        {...register("rltracker")}
      />

      <div className="tryouts-step__row">
        <TextField
          label={t("fields.rank.label")}
          placeholder={t("fields.rank.placeholder")}
          error={error("rank")}
          required
          {...register("rank")}
        />

        <TextField
          label={t("fields.peak.label")}
          placeholder={t("fields.peak.placeholder")}
          error={error("peak")}
          required
          {...register("peak")}
        />
      </div>

      <div className="tryouts-step__row">
        <TextField
          label={t("fields.hours_played.label")}
          placeholder={t("fields.hours_played.placeholder")}
          type="number"
          min={1}
          error={error("hoursPlayed")}
          required
          {...register("hoursPlayed", { valueAsNumber: true })}
        />

        <SelectField
          label={t("fields.playstyle.label")}
          placeholder={t("fields.playstyle.placeholder")}
          options={PLAYSTYLES.map((value) => ({
            value,
            label: t(`fields.playstyle.options.${value}`),
          }))}
          error={error("playstyle")}
          required
          {...register("playstyle")}
        />
      </div>

      <TextField
        label={t("fields.highlights.label")}
        placeholder={t("fields.highlights.placeholder")}
        hint={t("fields.highlights.hint")}
        type="url"
        error={error("highlights")}
        {...register("highlights")}
      />
    </div>
  );
}
