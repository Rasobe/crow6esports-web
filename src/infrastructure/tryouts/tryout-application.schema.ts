import { z } from "zod";
import {
  COACHING_OPENNESS,
  COMPETITIVE_EXPERIENCES,
  LOSS_REACTIONS,
  PLAYSTYLES,
} from "@/domain/tryouts/tryout-application";

const SHORT_TEXT_MAX = 200;
const LONG_TEXT_MAX = 2000;

const shortText = z.string().trim().min(1).max(SHORT_TEXT_MAX);
const longText = z.string().trim().min(10).max(LONG_TEXT_MAX);
const httpUrl = z.url({ protocol: /^https?$/ }).max(SHORT_TEXT_MAX);

export const tryoutApplicationSchema = z.object({
  discord: shortText,
  birthDate: shortText,
  country: shortText,
  availabilityWeekdays: shortText,
  availabilityWeekends: shortText,
  availabilityScrims: shortText,
  rltracker: httpUrl,
  rank: shortText,
  peak: shortText,
  hoursPlayed: z.number().min(1).max(1_000_000),
  playstyle: z.enum(PLAYSTYLES),
  highlights: z.union([z.literal(""), httpUrl]).optional(),
  hasCompetitiveExp: z.enum(COMPETITIVE_EXPERIENCES),
  previousTeams: z.string().trim().max(SHORT_TEXT_MAX).optional(),
  reactionToMistakes: longText,
  reactionToLosses: z.enum(LOSS_REACTIONS),
  lookingFor: longText,
  openToCoaching: z.enum(COACHING_OPENNESS),
});
