import { z } from "zod";
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

const TOO_LONG = "validation.too_long";

const required = (message: string) =>
  z.string().trim().min(1, message).max(SHORT_TEXT_MAX, TOO_LONG);
const longText = (message: string) =>
  z.string().trim().min(LONG_TEXT_MIN, message).max(LONG_TEXT_MAX, TOO_LONG);
const enumValue = <T extends readonly [string, ...string[]]>(values: T, message: string) =>
  z.enum(values, { error: () => ({ message }) });
const weekdays = (message: string) => z.array(z.enum(WEEKDAYS)).min(1, message);
const httpUrl = (message: string) =>
  z.url({ protocol: /^https?$/, error: message }).max(SHORT_TEXT_MAX, TOO_LONG);

export const stepProfileSchema = z.object({
  discord: required("validation.discord_required").regex(
    DISCORD_USERNAME_PATTERN,
    "validation.discord_invalid",
  ),
  birthDate: required("validation.birth_date_required").refine(
    (value) => isPlausibleBirthDate(value),
    "validation.birth_date_invalid",
  ),
  country: required("validation.country_required"),
  availableDays: weekdays("validation.available_days_required"),
  scheduleType: enumValue(SCHEDULE_TYPES, "validation.schedule_type_required"),
  scheduleFrom: z.string().optional(),
  scheduleTo: z.string().optional(),
  availabilityNotes: z.string().trim().max(SHORT_TEXT_MAX, TOO_LONG).optional(),
});

export const stepTechnicalSchema = z.object({
  rltracker: required("validation.rltracker_required").pipe(
    z
      .url({
        protocol: /^https?$/,
        hostname: RLTRACKER_HOSTNAME_PATTERN,
        error: "validation.rltracker_invalid",
      })
      .max(SHORT_TEXT_MAX, TOO_LONG),
  ),
  rank: required("validation.rank_required"),
  peak: required("validation.peak_required"),
  hoursPlayed: z
    .number({ error: () => ({ message: "validation.hours_required" }) })
    .int("validation.hours_invalid")
    .min(1, "validation.hours_required")
    .max(HOURS_PLAYED_MAX, "validation.hours_invalid"),
  playstyle: enumValue(PLAYSTYLES, "validation.playstyle_required"),
  highlights: z.union([z.literal(""), httpUrl("validation.highlights_invalid")]).optional(),
});

export const stepMindsetSchema = z.object({
  hasCompetitiveExp: enumValue(COMPETITIVE_EXPERIENCES, "validation.competitive_exp_required"),
  previousTeams: z.string().trim().max(SHORT_TEXT_MAX, TOO_LONG).optional(),
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

export const tryoutsFormSchema = stepProfileSchema
  .extend(stepTechnicalSchema.shape)
  .extend(stepMindsetSchema.shape)
  .refine(({ scheduleType, scheduleFrom }) => !isFixed(scheduleType) || Boolean(scheduleFrom), {
    ...alwaysCheck,
    path: ["scheduleFrom"],
    message: "validation.schedule_from_required",
  })
  .refine(({ scheduleType, scheduleTo }) => !isFixed(scheduleType) || Boolean(scheduleTo), {
    ...alwaysCheck,
    path: ["scheduleTo"],
    message: "validation.schedule_to_required",
  })
  .refine(
    ({ scheduleType, scheduleFrom, scheduleTo }) =>
      !isFixed(scheduleType) || !scheduleTo || scheduleFrom !== scheduleTo,
    { ...alwaysCheck, path: ["scheduleTo"], message: "validation.schedule_same_time" },
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
