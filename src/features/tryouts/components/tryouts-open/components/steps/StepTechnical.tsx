"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { SelectField, TextField } from "@/components/ui";
import type { TryoutsFormData } from "@/features/tryouts/schema";
import { PLAYSTYLE_VALUES } from "@/features/tryouts/types";

export function StepTechnical() {
    const t = useTranslations("tryouts.open.form");
    const { register, formState: { errors } } = useFormContext<TryoutsFormData>();

    const err = (key: keyof TryoutsFormData) =>
        errors[key]?.message ? t(errors[key].message as string) : undefined;

    return (
        <div className="tryouts-step">
            <TextField
                label={t("fields.rltracker.label")}
                placeholder={t("fields.rltracker.placeholder")}
                type="url"
                error={err("rltracker")}
                required
                {...register("rltracker")}
            />

            <TextField
                label={t("fields.rank.label")}
                placeholder={t("fields.rank.placeholder")}
                error={err("rank")}
                required
                {...register("rank")}
            />

            <TextField
                label={t("fields.peak.label")}
                placeholder={t("fields.peak.placeholder")}
                error={err("peak")}
                required
                {...register("peak")}
            />

            <TextField
                label={t("fields.hours_played.label")}
                placeholder={t("fields.hours_played.placeholder")}
                type="number"
                min={1}
                error={err("hoursPlayed")}
                required
                {...register("hoursPlayed")}
            />

            {/* Playstyle — select nativo */}
            <SelectField
                label={t("fields.playstyle.label")}
                placeholder={t("fields.playstyle.placeholder")}
                options={PLAYSTYLE_VALUES.map(value => ({
                    value,
                    label: t(`fields.playstyle.options.${value}`),
                }))}
                error={err("playstyle")}
                required
                {...register("playstyle")}
            />

            <TextField
                label={t("fields.highlights.label")}
                placeholder={t("fields.highlights.placeholder")}
                hint={t("fields.highlights.hint")}
                type="url"
                error={err("highlights")}
                {...register("highlights")}
            />
        </div>
    );
}