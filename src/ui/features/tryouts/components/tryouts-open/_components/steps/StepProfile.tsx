import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  SCHEDULE_TIMES,
  SCHEDULE_TYPES,
  SHORT_TEXT_MAX,
  WEEKDAYS,
  type Weekday,
} from "@/domain/tryouts/tryout-application";
import type { Locale, Translate } from "@/ui/i18n";
import { ChipGroupField } from "@/ui/shared/components/chip-group-field";
import { ChoiceField } from "@/ui/shared/components/choice-field";
import { DateField } from "@/ui/shared/components/date-field";
import { SelectField } from "@/ui/shared/components/select-field";
import { TextField } from "@/ui/shared/components/text-field";
import { getFieldError } from "@/ui/features/tryouts/lib/field-error";
import { toOptions } from "@/ui/features/tryouts/lib/options";
import type { TryoutsFormValues } from "@/ui/features/tryouts/schemas/tryouts-form.schema";
import { StepGroup } from "./StepGroup";

interface StepProfileProps {
  t: Translate;
  locale: Locale;
}

// Rango de años del selector de fecha de nacimiento, contado desde el año actual
const YOUNGEST_AGE = 10;
const OLDEST_AGE = 70;

const DAY_PRESETS: Record<string, readonly Weekday[]> = {
  weekdays: ["mon", "tue", "wed", "thu", "fri"],
  weekend: ["sat", "sun"],
  all: WEEKDAYS,
};

const TIME_OPTIONS = SCHEDULE_TIMES.map((time) => ({ value: time, label: time }));

export function StepProfile({ t, locale }: StepProfileProps) {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<TryoutsFormValues>();

  const error = (field: keyof TryoutsFormValues) => getFieldError(errors, field, t);
  const currentYear = new Date().getFullYear();
  const isFixedSchedule = watch("scheduleType") === "fixed";
  const [scheduleFrom, scheduleTo] = watch(["scheduleFrom", "scheduleTo"]);
  const endsNextDay = Boolean(scheduleFrom && scheduleTo && scheduleTo < scheduleFrom);

  // La zona horaria solo se conoce en el navegador; se lee tras hidratar
  const [timeZone, setTimeZone] = useState<string>();
  useEffect(() => setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone), []);

  const dayOptions = WEEKDAYS.map((day) => ({
    value: day,
    label: t(`weekdays.short.${day}`),
    ariaLabel: t(`weekdays.long.${day}`),
  }));

  return (
    <div className="tryouts-step">
      <StepGroup title={t("groups.contact")}>
        <TextField
          label={t("fields.discord.label")}
          placeholder={t("fields.discord.placeholder")}
          hint={t("fields.discord.hint")}
          autoComplete="username"
          spellCheck={false}
          error={error("discord")}
          required
          {...register("discord")}
        />

        <div className="tryouts-step__row">
          <Controller
            control={control}
            name="birthDate"
            render={({ field }) => (
              <DateField
                ref={field.ref}
                label={t("fields.birth_date.label")}
                value={field.value ?? ""}
                onChange={field.onChange}
                locale={locale}
                minYear={currentYear - OLDEST_AGE}
                maxYear={currentYear - YOUNGEST_AGE}
                partLabels={{
                  day: t("fields.birth_date.day"),
                  month: t("fields.birth_date.month"),
                  year: t("fields.birth_date.year"),
                }}
                error={error("birthDate")}
                required
              />
            )}
          />

          <TextField
            label={t("fields.country.label")}
            placeholder={t("fields.country.placeholder")}
            autoComplete="country-name"
            error={error("country")}
            required
            {...register("country")}
          />
        </div>
      </StepGroup>

      <StepGroup title={t("groups.availability")}>
        <Controller
          control={control}
          name="availableDays"
          render={({ field }) => (
            <ChipGroupField
              ref={field.ref}
              name={field.name}
              label={t("fields.available_days.label")}
              options={dayOptions}
              value={field.value ?? []}
              onChange={field.onChange}
              error={error("availableDays")}
              required
              actions={Object.entries(DAY_PRESETS).map(([preset, days]) => (
                <button
                  key={preset}
                  type="button"
                  className="tryouts-preset"
                  onClick={() => field.onChange([...days])}
                >
                  {t(`fields.available_days.presets.${preset}`)}
                </button>
              ))}
            />
          )}
        />

        <ChoiceField
          label={t("fields.schedule_type.label")}
          options={toOptions(SCHEDULE_TYPES, "fields.schedule_type", t)}
          error={error("scheduleType")}
          required
          {...register("scheduleType")}
        />

        {isFixedSchedule && (
          <div className="tryouts-schedule">
            <div className="tryouts-step__row">
              <SelectField
                label={t("fields.schedule_from.label")}
                placeholder="--:--"
                options={TIME_OPTIONS}
                error={error("scheduleFrom")}
                required
                {...register("scheduleFrom")}
              />

              <SelectField
                label={t("fields.schedule_to.label")}
                placeholder="--:--"
                options={TIME_OPTIONS}
                error={error("scheduleTo")}
                required
                {...register("scheduleTo")}
              />
            </div>

            {(timeZone || endsNextDay) && (
              <p className="tryouts-schedule__note">
                {timeZone && t("fields.schedule_from.time_zone", { timeZone })}
                {endsNextDay && ` ${t("fields.schedule_to.next_day")}`}
              </p>
            )}
          </div>
        )}

        <TextField
          label={t("fields.availability_notes.label")}
          placeholder={t("fields.availability_notes.placeholder")}
          hint={t("fields.availability_notes.hint")}
          maxLength={SHORT_TEXT_MAX}
          error={error("availabilityNotes")}
          {...register("availabilityNotes")}
        />
      </StepGroup>
    </div>
  );
}
