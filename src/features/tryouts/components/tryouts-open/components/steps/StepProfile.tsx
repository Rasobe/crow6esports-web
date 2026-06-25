"use client";

import { TextField } from "@/components/ui";
import { TryoutsFormData } from "@/features/tryouts/schema";
import { useTranslations } from "next-intl"
import { useFormContext } from "react-hook-form";

export function StepProfile() {
    const t = useTranslations('tryouts.open.form');
    const { register, formState: { errors } } = useFormContext<TryoutsFormData>();

    const err = (key: keyof TryoutsFormData) =>
        errors[key]?.message ? t(errors[key].message as string) : undefined;

    return (
        <div className="tryouts-step">
            <TextField
                label={t("fields.discord.label")}
                placeholder={t("fields.discord.placeholder")}
                hint={t("fields.discord.hint")}
                error={err("discord")}
                required
                {...register("discord")}
            />

            <TextField
                label={t("fields.birth_date.label")}
                placeholder={t("fields.birth_date.placeholder")}
                type="date"
                error={err("birthDate")}
                required
                {...register("birthDate")}
            />

            <TextField
                label={t("fields.country.label")}
                placeholder={t("fields.country.placeholder")}
                error={err("country")}
                required
                {...register("country")}
            />

            <TextField
                label={t("fields.availability_weekdays.label")}
                placeholder={t("fields.availability_weekdays.placeholder")}
                error={err("availabilityWeekdays")}
                required
                {...register("availabilityWeekdays")}
            />

            <TextField
                label={t("fields.availability_weekends.label")}
                placeholder={t("fields.availability_weekends.placeholder")}
                error={err("availabilityWeekends")}
                required
                {...register("availabilityWeekends")}
            />

            <TextField
                label={t("fields.availability_scrims.label")}
                placeholder={t("fields.availability_scrims.placeholder")}
                error={err("availabilityScrims")}
                required
                {...register("availabilityScrims")}
            />
        </div>
    )
}