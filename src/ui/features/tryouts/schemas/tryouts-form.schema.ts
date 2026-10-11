import { z } from "zod";
import {
  COACHING_OPENNESS,
  COMPETITIVE_EXPERIENCES,
  LOSS_REACTIONS,
  PLAYSTYLES,
} from "@/domain/tryouts/tryout-application";

const required = (message: string) => z.string().trim().min(1, message);
const enumValue = <T extends readonly [string, ...string[]]>(values: T, message: string) =>
  z.enum(values, { error: () => ({ message }) });

export const stepProfileSchema = z.object({
  discord: required("validation.discord_required"),
  birthDate: required("validation.birth_date_required"),
  country: required("validation.country_required"),
  availabilityWeekdays: required("validation.availability_weekdays_required"),
  availabilityWeekends: required("validation.availability_weekends_required"),
  availabilityScrims: required("validation.availability_scrims_required"),
});

export const stepTechnicalSchema = z.object({
  rltracker: required("validation.rltracker_required").pipe(z.url("validation.rltracker_invalid")),
  rank: required("validation.rank_required"),
  peak: required("validation.peak_required"),
  hoursPlayed: z
    .number({ error: () => ({ message: "validation.hours_required" }) })
    .min(1, "validation.hours_required"),
  playstyle: enumValue(PLAYSTYLES, "validation.playstyle_required"),
  highlights: z.union([z.literal(""), z.url("validation.highlights_invalid")]).optional(),
});

export const stepMindsetSchema = z.object({
  hasCompetitiveExp: enumValue(COMPETITIVE_EXPERIENCES, "validation.competitive_exp_required"),
  previousTeams: z.string().optional(),
  reactionToMistakes: z.string().trim().min(10, "validation.reaction_mistakes_required"),
  reactionToLosses: enumValue(LOSS_REACTIONS, "validation.reaction_losses_required"),
  lookingFor: z.string().trim().min(10, "validation.looking_for_required"),
  openToCoaching: enumValue(COACHING_OPENNESS, "validation.coaching_required"),
});

export const tryoutsFormSchema = stepProfileSchema
  .extend(stepTechnicalSchema.shape)
  .extend(stepMindsetSchema.shape);

export type TryoutsFormValues = z.infer<typeof tryoutsFormSchema>;

export const defaultTryoutsFormValues: Partial<TryoutsFormValues> = {
  discord: "",
  birthDate: "",
  country: "",
  availabilityWeekdays: "",
  availabilityWeekends: "",
  availabilityScrims: "",
  rltracker: "",
  rank: "",
  peak: "",
  playstyle: "calm",
  highlights: "",
  hasCompetitiveExp: "no",
  previousTeams: "",
  reactionToMistakes: "",
  reactionToLosses: "calm",
  lookingFor: "",
  openToCoaching: "maybe",
};

export const STEP_FIELDS: readonly (readonly (keyof TryoutsFormValues)[])[] = [
  Object.keys(stepProfileSchema.shape) as (keyof TryoutsFormValues)[],
  Object.keys(stepTechnicalSchema.shape) as (keyof TryoutsFormValues)[],
  Object.keys(stepMindsetSchema.shape) as (keyof TryoutsFormValues)[],
];
