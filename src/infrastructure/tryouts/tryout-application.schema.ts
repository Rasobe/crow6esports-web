import { z } from "zod";
import { ATTRIBUTION_MAX } from "@/domain/tryouts/attribution";
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
  SUBMISSION_LOCALES,
  WEEKDAYS,
  isCompleteSchedule,
  isPlausibleBirthDate,
  isScheduleTime,
} from "@/domain/tryouts/tryout-application";

const TIME_ZONE_MAX = 64;

const shortText = z.string().trim().min(1).max(SHORT_TEXT_MAX);
const longText = z.string().trim().min(LONG_TEXT_MIN).max(LONG_TEXT_MAX);
const httpUrl = z.url({ protocol: /^https?$/ }).max(SHORT_TEXT_MAX);
const weekdays = z.array(z.enum(WEEKDAYS)).max(WEEKDAYS.length);
const scheduleTime = z.union([z.literal(""), z.string().refine(isScheduleTime)]).optional();

export const tryoutApplicationSchema = z
  .object({
    discord: z.string().trim().regex(DISCORD_USERNAME_PATTERN),
    birthDate: z.iso.date().refine((value) => isPlausibleBirthDate(value)),
    country: shortText,
    availableDays: weekdays.min(1),
    scheduleType: z.enum(SCHEDULE_TYPES),
    scheduleFrom: scheduleTime,
    scheduleTo: scheduleTime,
    availabilityNotes: z.string().trim().max(SHORT_TEXT_MAX).optional(),
    timeZone: z.string().trim().max(TIME_ZONE_MAX).optional(),
    rltracker: z
      .url({ protocol: /^https?$/, hostname: RLTRACKER_HOSTNAME_PATTERN })
      .max(SHORT_TEXT_MAX),
    rank: shortText,
    peak: shortText,
    hoursPlayed: z.number().int().min(1).max(HOURS_PLAYED_MAX),
    playstyle: z.enum(PLAYSTYLES),
    highlights: z.union([z.literal(""), httpUrl]).optional(),
    hasCompetitiveExp: z.enum(COMPETITIVE_EXPERIENCES),
    previousTeams: z.string().trim().max(SHORT_TEXT_MAX).optional(),
    reactionToMistakes: longText,
    reactionToLosses: z.enum(LOSS_REACTIONS),
    lookingFor: longText,
    openToCoaching: z.enum(COACHING_OPENNESS),
  })
  .refine(isCompleteSchedule, { path: ["scheduleTo"] });

/** Optional and empty-as-missing: attribution must never block a real application. */
const attributionText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => value || undefined);

export const tryoutSubmissionSchema = tryoutApplicationSchema.safeExtend({
  locale: z.enum(SUBMISSION_LOCALES),
  sourcePage: attributionText(ATTRIBUTION_MAX.page),
  referrer: attributionText(ATTRIBUTION_MAX.referrer),
  utmSource: attributionText(ATTRIBUTION_MAX.utm),
  utmMedium: attributionText(ATTRIBUTION_MAX.utm),
  utmCampaign: attributionText(ATTRIBUTION_MAX.utm),
});
