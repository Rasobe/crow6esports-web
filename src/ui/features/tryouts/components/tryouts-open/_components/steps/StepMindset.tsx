import { useFormContext } from "react-hook-form";
import {
  COACHING_OPENNESS,
  COMPETITIVE_EXPERIENCES,
  LONG_TEXT_MAX,
  LOSS_REACTIONS,
  SHORT_TEXT_MAX,
} from "@/domain/tryouts/tryout-application";
import type { Translate } from "@/ui/i18n";
import { ChoiceField } from "@/ui/shared/components/choice-field";
import { TextField } from "@/ui/shared/components/text-field";
import { TextareaField } from "@/ui/shared/components/textarea-field";
import { getFieldError } from "@/ui/features/tryouts/lib/field-error";
import { toOptions } from "@/ui/features/tryouts/lib/options";
import type { TryoutsFormValues } from "@/ui/features/tryouts/schemas/tryouts-form.schema";
import { StepGroup } from "./StepGroup";

interface StepProps {
  t: Translate;
}

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
      <StepGroup title={t("groups.experience")}>
        <ChoiceField
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
            maxLength={SHORT_TEXT_MAX}
            error={error("previousTeams")}
            {...register("previousTeams")}
          />
        )}
      </StepGroup>

      <StepGroup title={t("groups.team_play")}>
        <TextareaField
          label={t("fields.reaction_mistakes.label")}
          placeholder={t("fields.reaction_mistakes.placeholder")}
          hint={t("fields.long_text_hint")}
          maxLength={LONG_TEXT_MAX}
          error={error("reactionToMistakes")}
          required
          {...register("reactionToMistakes")}
        />

        <ChoiceField
          label={t("fields.reaction_losses.label")}
          options={toOptions(LOSS_REACTIONS, "fields.reaction_losses", t)}
          error={error("reactionToLosses")}
          required
          {...register("reactionToLosses")}
        />
      </StepGroup>

      <StepGroup title={t("groups.goals")}>
        <TextareaField
          label={t("fields.looking_for.label")}
          placeholder={t("fields.looking_for.placeholder")}
          hint={t("fields.long_text_hint")}
          maxLength={LONG_TEXT_MAX}
          error={error("lookingFor")}
          required
          {...register("lookingFor")}
        />

        <ChoiceField
          label={t("fields.open_to_coaching.label")}
          options={toOptions(COACHING_OPENNESS, "fields.open_to_coaching", t)}
          error={error("openToCoaching")}
          required
          {...register("openToCoaching")}
        />
      </StepGroup>
    </div>
  );
}
