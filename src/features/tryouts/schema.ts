import { z } from "zod";
import {
    PLAYSTYLE_VALUES,
    COMPETITIVE_EXP_VALUES,
    REACTION_TO_LOSSES_VALUES,
    OPEN_TO_COACHING_VALUES,
} from "./types";

// ── Schemas por paso ───────────────────────────────────────────
export const stepProfileSchema = z.object({
    discord: z.string().min(1, "validation.discord_required"),
    birthDate: z.string().min(1, "validation.birth_date_required"),
    country: z.string().min(1, "validation.country_required"),
    availabilityWeekdays: z.string().min(1, "validation.availability_weekdays_required"),
    availabilityWeekends: z.string().min(1, "validation.availability_weekends_required"),
    availabilityScrims: z.string().min(1, "validation.availability_scrims_required"),
});

export const stepTechnicalSchema = z.object({
    rltracker: z.string().min(1, "validation.rltracker_required").url("validation.rltracker_invalid"),
    rank: z.string().min(1, "validation.rank_required"),
    peak: z.string().min(1, "validation.peak_required"),
    hoursPlayed: z.coerce.number().min(1, "validation.hours_required"),
    playstyle: z.enum(PLAYSTYLE_VALUES, {
        error: () => ({ message: "validation.playstyle_required" }),
    }),
    highlights: z
        .union([z.literal(""), z.url("validation.highlights_invalid")])
        .optional(),
});

export const stepMindsetSchema = z.object({
    hasCompetitiveExp: z.enum(COMPETITIVE_EXP_VALUES, {
        error: () => ({ message: "validation.competitive_exp_required" }),
    }),
    previousTeams: z.string().optional(),
    reactionToMistakes: z.string().min(10, "validation.reaction_mistakes_required"),
    reactionToLosses: z.enum(REACTION_TO_LOSSES_VALUES, {
        error: () => ({ message: "validation.reaction_losses_required" }),
    }),
    lookingFor: z.string().min(10, "validation.looking_for_required"),
    openToCoaching: z.enum(OPEN_TO_COACHING_VALUES, {
        error: () => ({ message: "validation.coaching_required" }),
    }),
});

// ── Schema completo ────────────────────────────────────────────
export const tryoutsSchema = stepProfileSchema
    .merge(stepTechnicalSchema)
    .merge(stepMindsetSchema);

// ── Tipo derivado del schema (fuente de verdad) ─────────────────
export type TryoutsFormData = z.infer<typeof tryoutsSchema>;

// ── Default values ─────────────────────────────────────────────
export const defaultTryoutsFormValues: TryoutsFormData = {
    discord: "",
    birthDate: "",
    country: "",
    availabilityWeekdays: "",
    availabilityWeekends: "",
    availabilityScrims: "",

    rltracker: "",
    rank: "",
    peak: "",
    hoursPlayed: 0,
    playstyle: "calm",
    highlights: "",

    hasCompetitiveExp: "no",
    previousTeams: "",
    reactionToMistakes: "",
    reactionToLosses: "calm",
    lookingFor: "",
    openToCoaching: "maybe",
};

// ── Keys por paso para trigger parcial ────────────────────────
export const STEP_FIELDS: Record<number, (keyof TryoutsFormData)[]> = {
    0: ["discord", "birthDate", "country", "availabilityWeekdays", "availabilityWeekends", "availabilityScrims"],
    1: ["rltracker", "rank", "peak", "hoursPlayed", "playstyle", "highlights"],
    2: ["hasCompetitiveExp", "previousTeams", "reactionToMistakes", "reactionToLosses", "lookingFor", "openToCoaching"],
};