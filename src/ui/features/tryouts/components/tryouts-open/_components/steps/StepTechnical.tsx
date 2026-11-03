import { useFormContext } from "react-hook-form";
import { HOURS_PLAYED_MAX, PLAYSTYLES } from "@/domain/tryouts/tryout-application";
import type { Translate } from "@/ui/i18n";
import { ChoiceField } from "@/ui/shared/components/choice-field";
import { TextField } from "@/ui/shared/components/text-field";
import { getFieldError } from "@/ui/features/tryouts/lib/field-error";
import { toOptions } from "@/ui/features/tryouts/lib/options";
import type { TryoutsFormValues } from "@/ui/features/tryouts/schemas/tryouts-form.schema";
import { StepGroup } from "./StepGroup";

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
      <StepGroup title={t("groups.level")}>
        <div className="tryouts-step__row tryouts-step__row--3">
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

          <TextField
            label={t("fields.hours_played.label")}
            placeholder={t("fields.hours_played.placeholder")}
            type="number"
            inputMode="numeric"
            min={1}
            max={HOURS_PLAYED_MAX}
            step={1}
            error={error("hoursPlayed")}
            required
            {...register("hoursPlayed", { valueAsNumber: true })}
          />
        </div>

        <ChoiceField
          label={t("fields.playstyle.label")}
          options={toOptions(PLAYSTYLES, "fields.playstyle", t)}
          error={error("playstyle")}
          required
          {...register("playstyle")}
        />
      </StepGroup>

      <StepGroup title={t("groups.links")}>
        <TextField
          label={t("fields.rltracker.label")}
          placeholder={t("fields.rltracker.placeholder")}
          type="url"
          inputMode="url"
          spellCheck={false}
          error={error("rltracker")}
          required
          {...register("rltracker")}
        />

        <TextField
          label={t("fields.highlights.label")}
          placeholder={t("fields.highlights.placeholder")}
          hint={t("fields.highlights.hint")}
          type="url"
          inputMode="url"
          spellCheck={false}
          error={error("highlights")}
          {...register("highlights")}
        />
      </StepGroup>
    </div>
  );
}
