export const PLAYSTYLES = ["calm", "intermediate", "mechanical", "aggressive"] as const;
export type Playstyle = (typeof PLAYSTYLES)[number];

export const COMPETITIVE_EXPERIENCES = ["yes", "no"] as const;
export type CompetitiveExperience = (typeof COMPETITIVE_EXPERIENCES)[number];

export const LOSS_REACTIONS = ["encourage", "down", "calm"] as const;
export type LossReaction = (typeof LOSS_REACTIONS)[number];

export const COACHING_OPENNESS = ["yes", "no", "maybe"] as const;
export type CoachingOpenness = (typeof COACHING_OPENNESS)[number];

export const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export const SCHEDULE_TYPES = ["fixed", "flexible"] as const;
export type ScheduleType = (typeof SCHEDULE_TYPES)[number];

/** Horas seleccionables (HH:MM) en tramos de media hora, de 00:00 a 23:30. */
export const SCHEDULE_TIMES = Array.from({ length: 48 }, (_, slot) => {
  const hours = String(Math.floor(slot / 2)).padStart(2, "0");
  return `${hours}:${slot % 2 === 0 ? "00" : "30"}`;
});

export type TryoutApplication = {
  discord: string;
  birthDate: string;
  country: string;
  availableDays: Weekday[];
  scheduleType: ScheduleType;
  /** Solo con horario fijo. Un fin anterior al inicio significa que pasa de medianoche. */
  scheduleFrom?: string;
  scheduleTo?: string;
  availabilityNotes?: string;
  /** Zona horaria IANA del navegador del candidato, para interpretar las horas. */
  timeZone?: string;
  rltracker: string;
  rank: string;
  peak: string;
  hoursPlayed: number;
  playstyle: Playstyle;
  highlights?: string;
  hasCompetitiveExp: CompetitiveExperience;
  previousTeams?: string;
  reactionToMistakes: string;
  reactionToLosses: LossReaction;
  lookingFor: string;
  openToCoaching: CoachingOpenness;
};

export const SHORT_TEXT_MAX = 200;
export const LONG_TEXT_MIN = 10;
export const LONG_TEXT_MAX = 2000;
export const HOURS_PLAYED_MAX = 100_000;

/** Nombre de usuario de Discord sin discriminador: de 2 a 32 de a-z, 0-9, "_" y ".". */
export const DISCORD_USERNAME_PATTERN = /^[a-z0-9_.]{2,32}$/i;

export const RLTRACKER_HOSTNAME_PATTERN = /(^|\.)tracker\.(network|gg)$/;

const OLDEST_BIRTH_YEAR = 1900;

export function isPlausibleBirthDate(value: string, today: Date = new Date()): boolean {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return false;
  return date.getUTCFullYear() >= OLDEST_BIRTH_YEAR && date <= today;
}

export const isScheduleTime = (value: string): boolean => SCHEDULE_TIMES.includes(value);

type Schedule = Pick<TryoutApplication, "scheduleType" | "scheduleFrom" | "scheduleTo">;

/** Un horario fijo necesita inicio y fin válidos y distintos; uno flexible no lleva horas. */
export function isCompleteSchedule({ scheduleType, scheduleFrom, scheduleTo }: Schedule): boolean {
  if (scheduleType === "flexible") return true;
  if (!scheduleFrom || !scheduleTo) return false;
  return isScheduleTime(scheduleFrom) && isScheduleTime(scheduleTo) && scheduleFrom !== scheduleTo;
}

export const SUBMISSION_LOCALES = ["es", "en"] as const;
export type SubmissionLocale = (typeof SUBMISSION_LOCALES)[number];

export const REQUEST_STATUSES = ["new", "contacted", "accepted", "rejected"] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const NOTES_MAX = 4000;
