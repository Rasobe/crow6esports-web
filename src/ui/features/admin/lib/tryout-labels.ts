import {
  REQUEST_STATUSES,
  type CoachingOpenness,
  type CompetitiveExperience,
  type LossReaction,
  type Playstyle,
  type RequestStatus,
  type ScheduleType,
  type Weekday,
} from "@/domain/tryouts/tryout-application";

export const STATUS_LABELS: Record<RequestStatus, string> = {
  new: "Nueva",
  contacted: "Contactada",
  accepted: "Aceptada",
  rejected: "Rechazada",
};

export const PLAYSTYLE_LABELS: Record<Playstyle, string> = {
  calm: "Calma y posicionamiento",
  intermediate: "Equilibrado",
  mechanical: "Mecánicas",
  aggressive: "Agresividad",
};

export const LOSS_REACTION_LABELS: Record<LossReaction, string> = {
  encourage: "Anima a sus compañeros",
  down: "Se viene abajo",
  calm: "Sigue adelante con calma",
};

export const COMPETITIVE_LABELS: Record<CompetitiveExperience, string> = { yes: "Sí", no: "No" };

export const COACHING_LABELS: Record<CoachingOpenness, string> = {
  yes: "Sí",
  no: "No",
  maybe: "Tal vez",
};

export const SCHEDULE_TYPE_LABELS: Record<ScheduleType, string> = {
  fixed: "Horario fijo",
  flexible: "Horario flexible",
};

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  mon: "Lun",
  tue: "Mar",
  wed: "Mié",
  thu: "Jue",
  fri: "Vie",
  sat: "Sáb",
  sun: "Dom",
};

export const LOCALE_LABELS = { es: "Español", en: "Inglés" } as const;

export const STATUS_OPTIONS = REQUEST_STATUSES.map((status) => ({
  value: status,
  label: STATUS_LABELS[status],
}));

const DATE_TIME = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Madrid",
});

const DATE_ONLY = new Intl.DateTimeFormat("es-ES", { dateStyle: "long", timeZone: "UTC" });

export const formatDateTime = (iso: string) => DATE_TIME.format(new Date(iso));

/** Birth dates are plain calendar dates: UTC avoids shifting them a day. */
export const formatBirthDate = (isoDate: string) => DATE_ONLY.format(new Date(isoDate));

/** Applicants type these links: only http(s) ones are ever rendered as clickable. */
export function safeHttpUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}
