import { z } from "zod/mini";
import {
  COACHING_OPENNESS,
  COMPETITIVE_EXPERIENCES,
  DISCORD_USERNAME_PATTERN,
  HOURS_PLAYED_MAX,
  LONG_TEXT_MAX,
  LONG_TEXT_MIN,
  LOSS_REACTIONS,
  PLAYSTYLES,
  RLTRACKER_HOSTNAME_PATTERN,
  SCHEDULE_TYPES,
  SHORT_TEXT_MAX,
  WEEKDAYS,
  isPlausibleBirthDate,
} from "@/domain/tryouts/tryout-application";

// zod/mini: misma validación con un tercio del peso en el cliente. Las comprobaciones se
// encadenan con `.check()` y se ejecutan en orden, así que el primer error es el que se muestra.
const TOO_LONG = "validation.too_long";

const text = (minimum: number, maximum: number, message: string) =>
  z.string().check(z.trim(), z.minLength(minimum, message), z.maxLength(maximum, TOO_LONG));
const required = (message: string) => text(1, SHORT_TEXT_MAX, message);
const longText = (message: string) => text(LONG_TEXT_MIN, LONG_TEXT_MAX, message);
const optionalText = () =>
  z.optional(z.string().check(z.trim(), z.maxLength(SHORT_TEXT_MAX, TOO_LONG)));
const enumValue = <T extends readonly [string, ...string[]]>(values: T, message: string) =>
  z.enum(values, { error: () => ({ message }) });
const weekdays = (message: string) => z.array(z.enum(WEEKDAYS)).check(z.minLength(1, message));
const httpUrl = (message: string, hostname?: RegExp) =>
  z
    .url({ protocol: /^https?$/, hostname, error: message })
    .check(z.maxLength(SHORT_TEXT_MAX, TOO_LONG));

export const stepProfileSchema = z.object({
  discord: required("validation.discord_required").check(
    z.regex(DISCORD_USERNAME_PATTERN, "validation.discord_invalid"),
  ),
  birthDate: required("validation.birth_date_required").check(
    z.refine((value) => isPlausibleBirthDate(value), "validation.birth_date_invalid"),
  ),
  country: required("validation.country_required"),
  availableDays: weekdays("validation.available_days_required"),
  scheduleType: enumValue(SCHEDULE_TYPES, "validation.schedule_type_required"),
  scheduleFrom: z.optional(z.string()),
  scheduleTo: z.optional(z.string()),
  availabilityNotes: optionalText(),
});

export const stepTechnicalSchema = z.object({
  rltracker: z.pipe(
    required("validation.rltracker_required"),
    httpUrl("validation.rltracker_invalid", RLTRACKER_HOSTNAME_PATTERN),
  ),
  rank: required("validation.rank_required"),
  peak: required("validation.peak_required"),
  hoursPlayed: z
    .number({ error: () => ({ message: "validation.hours_required" }) })
    .check(
      z.refine(Number.isInteger, "validation.hours_invalid"),
      z.minimum(1, "validation.hours_required"),
      z.maximum(HOURS_PLAYED_MAX, "validation.hours_invalid"),
    ),
  playstyle: enumValue(PLAYSTYLES, "validation.playstyle_required"),
  highlights: z.optional(z.union([z.literal(""), httpUrl("validation.highlights_invalid")])),
});

export const stepMindsetSchema = z.object({
  hasCompetitiveExp: enumValue(COMPETITIVE_EXPERIENCES, "validation.competitive_exp_required"),
  previousTeams: optionalText(),
  reactionToMistakes: longText("validation.reaction_mistakes_required"),
  reactionToLosses: enumValue(LOSS_REACTIONS, "validation.reaction_losses_required"),
  lookingFor: longText("validation.looking_for_required"),
  openToCoaching: enumValue(COACHING_OPENNESS, "validation.coaching_required"),
});

// Las horas solo son obligatorias con horario fijo, así que se comprueban sobre el
// formulario completo. Zod salta estas comprobaciones si otro campo ya falla (las
// preguntas de pasos posteriores siguen vacías), y `when` las fuerza a ejecutarse.
const alwaysCheck = { when: () => true };
const isFixed = (scheduleType: unknown) => scheduleType === "fixed";

type ScheduleFields = { scheduleType?: string; scheduleFrom?: string; scheduleTo?: string };

export const tryoutsFormSchema = z
  .extend(z.extend(stepProfileSchema, stepTechnicalSchema.shape), stepMindsetSchema.shape)
  .check(
    z.refine(
      ({ scheduleType, scheduleFrom }: ScheduleFields) =>
        !isFixed(scheduleType) || Boolean(scheduleFrom),
      { ...alwaysCheck, path: ["scheduleFrom"], message: "validation.schedule_from_required" },
    ),
    z.refine(
      ({ scheduleType, scheduleTo }: ScheduleFields) =>
        !isFixed(scheduleType) || Boolean(scheduleTo),
      { ...alwaysCheck, path: ["scheduleTo"], message: "validation.schedule_to_required" },
    ),
    z.refine(
      ({ scheduleType, scheduleFrom, scheduleTo }: ScheduleFields) =>
        !isFixed(scheduleType) || !scheduleTo || scheduleFrom !== scheduleTo,
      { ...alwaysCheck, path: ["scheduleTo"], message: "validation.schedule_same_time" },
    ),
  );

export type TryoutsFormValues = z.infer<typeof tryoutsFormSchema>;

// Las preguntas de opción no llevan valor por defecto: el candidato tiene que elegir.
export const defaultTryoutsFormValues: Partial<TryoutsFormValues> = {
  discord: "",
  birthDate: "",
  country: "",
  availableDays: [],
  scheduleFrom: "",
  scheduleTo: "",
  availabilityNotes: "",
  rltracker: "",
  rank: "",
  peak: "",
  highlights: "",
  previousTeams: "",
  reactionToMistakes: "",
  lookingFor: "",
};

export const STEP_FIELDS: readonly (readonly (keyof TryoutsFormValues)[])[] = [
  Object.keys(stepProfileSchema.shape) as (keyof TryoutsFormValues)[],
  Object.keys(stepTechnicalSchema.shape) as (keyof TryoutsFormValues)[],
  Object.keys(stepMindsetSchema.shape) as (keyof TryoutsFormValues)[],
];
