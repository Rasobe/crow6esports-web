import { useFormContext } from "react-hook-form";
import {
  COACHING_OPENNESS,
  COMPETITIVE_EXPERIENCES,
  LOSS_REACTIONS,
} from "@/domain/tryouts/tryout-application";
import type { Translate } from "@/ui/i18n";
import { SelectField } from "@/ui/shared/components/select-field/SelectField";
import { TextField } from "@/ui/shared/components/text-field/TextField";
import { getFieldError } from "@/ui/features/tryouts/lib/field-error";
import type { TryoutsFormValues } from "@/ui/features/tryouts/schemas/tryouts-form.schema";

interface StepProps {
  t: Translate;
}

const toOptions = (values: readonly string[], namespace: string, t: Translate) =>
  values.map((value) => ({ value, label: t(`${namespace}.options.${value}`) }));

export function StepMindset({ t }: StepProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<TryoutsFormValues>();

  const error = (field: keyof TryoutsFormValues) => getFieldError(errors, field, t);
  const hasCompetitiveExp = watch("hasCompetitiveExp") === "yes";

  return (
    <div className="tryouts-step">
      <div className="tryouts-step__row">
        <SelectField
          label={t("fields.competitive_exp.label")}
          options={toOptions(COMPETITIVE_EXPERIENCES, "fields.competitive_exp", t)}
          error={error("hasCompetitiveExp")}
          required
          {...register("hasCompetitiveExp")}
        />

        {hasCompetitiveExp && (
          <TextField
            label={t("fields.previous_teams.label")}
            placeholder={t("fields.previous_teams.placeholder")}
            error={error("previousTeams")}
            {...register("previousTeams")}
          />
        )}
      </div>

      <TextField
        label={t("fields.reaction_mistakes.label")}
        placeholder={t("fields.reaction_mistakes.placeholder")}
        error={error("reactionToMistakes")}
        required
        {...register("reactionToMistakes")}
      />

      <div className="tryouts-step__row">
        <SelectField
          label={t("fields.reaction_losses.label")}
          options={toOptions(LOSS_REACTIONS, "fields.reaction_losses", t)}
          error={error("reactionToLosses")}
          required
          {...register("reactionToLosses")}
        />

        <SelectField
          label={t("fields.open_to_coaching.label")}
          options={toOptions(COACHING_OPENNESS, "fields.open_to_coaching", t)}
          error={error("openToCoaching")}
          required
          {...register("openToCoaching")}
        />
      </div>

      <TextField
        label={t("fields.looking_for.label")}
        placeholder={t("fields.looking_for.placeholder")}
        error={error("lookingFor")}
        required
        {...register("lookingFor")}
      />
    </div>
  );
}
