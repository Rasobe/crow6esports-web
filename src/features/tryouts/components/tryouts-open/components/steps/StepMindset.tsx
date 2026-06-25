"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { SelectField, TextField } from "@/components/ui";
import type { TryoutsFormData } from "@/features/tryouts/schema";
import {
    COMPETITIVE_EXP_VALUES,
    REACTION_TO_LOSSES_VALUES,
    OPEN_TO_COACHING_VALUES,
} from "@/features/tryouts/types";

export function StepMindset() {
    const t = useTranslations("tryouts.open.form");
    const { register, watch, formState: { errors } } = useFormContext<TryoutsFormData>();

    const hasCompetitiveExp = watch("hasCompetitiveExp");

    const err = (key: keyof TryoutsFormData) =>
        errors[key]?.message ? t(errors[key].message as string) : undefined;

    return (
        <div className="tryouts-step">

            <SelectField
                label={t("fields.competitive_exp.label")}
                options={COMPETITIVE_EXP_VALUES.map(value => ({
                    value,
                    label: t(`fields.competitive_exp.options.${value}`),
                }))}
                error={err("hasCompetitiveExp")}
                required
                {...register("hasCompetitiveExp")}
            />

            {/* Solo visible si tiene experiencia competitiva */}
            {hasCompetitiveExp === "yes" && (
                <TextField
                    label={t("fields.previous_teams.label")}
                    placeholder={t("fields.previous_teams.placeholder")}
                    error={err("previousTeams")}
                    {...register("previousTeams")}
                />
            )}

            <TextField
                label={t("fields.reaction_mistakes.label")}
                placeholder={t("fields.reaction_mistakes.placeholder")}
                error={err("reactionToMistakes")}
                required
                {...register("reactionToMistakes")}
            />

            <SelectField
                label={t("fields.reaction_losses.label")}
                options={REACTION_TO_LOSSES_VALUES.map(value => ({
                    value,
                    label: t(`fields.reaction_losses.options.${value}`),
                }))}
                error={err("reactionToLosses")}
                required
                {...register("reactionToLosses")}
            />

            <TextField
                label={t("fields.looking_for.label")}
                placeholder={t("fields.looking_for.placeholder")}
                error={err("lookingFor")}
                required
                {...register("lookingFor")}
            />

            <SelectField
                label={t("fields.open_to_coaching.label")}
                options={OPEN_TO_COACHING_VALUES.map(value => ({
                    value,
                    label: t(`fields.open_to_coaching.options.${value}`),
                }))}
                error={err("openToCoaching")}
                required
                {...register("openToCoaching")}
            />

        </div>
    );
}