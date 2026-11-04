import type {
  CoachingFeature,
  CoachingMode,
  CoachingPlan,
  CoachingSingleSession,
} from "@/domain/coaching/coaching-plan";

export interface CoachingConfig {
  coach: {
    name: string;
    photo: string | null;
    startYear: number;
    hoursPlayed: number;
  };
  results: {
    maxMmrReached: number;
    recentCase: { from: number; to: number };
  };
  currency: "EUR";
  teamMinPlayers: number;
  sessionDurationHours: number;
  availability: {
    days: { from: "mon"; to: "sat" };
    hours: { from: string; to: string };
    timezone: string;
  };
  policy: { postponeMaxDays: number; postponeMaxPerMonth: number };
  plans: Record<CoachingMode, readonly CoachingPlan[]>;
  /** Lo que incluye cada pack, en el orden en que se muestra. Textos en `coaching.plans.features`. */
  features: Record<CoachingMode, readonly CoachingFeature[]>;
  /** Sesiones sueltas. Textos en `coaching.plans.single.items`. */
  singleSessions: readonly CoachingSingleSession[];
  /** Días para pasar a un pack y que se descuente lo pagado en una sesión suelta. */
  singleSessionCreditDays: number;
  teamsWorkedWith: readonly string[];
}

/**
 * Último instante del precio de lanzamiento. Pasada esta fecha la web muestra sola el precio
 * regular, sin badge ni texto de lanzamiento (se compara con la fecha actual en cada petición).
 */
// TODO: validar fecha
export const LAUNCH_PRICE_ENDS = new Date("2026-12-31T23:59:59+01:00");

// Estudio de mercado y razonamiento de los precios en docs/estudio-precios-coaching.md.
// Los precios de equipo son por equipo (mínimo `teamMinPlayers` jugadores), no por jugador.
export const COACHING: CoachingConfig = {
  coach: { name: "Rasobe", photo: null, startYear: 2020, hoursPlayed: 6000 },
  results: { maxMmrReached: 2000, recentCase: { from: 1700, to: 2000 } },
  currency: "EUR",
  teamMinPlayers: 3,
  sessionDurationHours: 1,
  availability: {
    days: { from: "mon", to: "sat" },
    hours: { from: "16:00", to: "22:00" },
    timezone: "CEST",
  },
  policy: { postponeMaxDays: 2, postponeMaxPerMonth: 2 },
  plans: {
    individual: [
      { tier: "basic", launchPrice: 40, regularPrice: 60, weeklySessions: 1 },
      { tier: "pro", launchPrice: 75, regularPrice: 110, weeklySessions: 2, featured: true },
      { tier: "elite", launchPrice: 105, regularPrice: 150, weeklySessions: 3 },
    ],
    teams: [
      { tier: "basic", launchPrice: 60, regularPrice: 90, weeklySessions: 1 },
      { tier: "pro", launchPrice: 110, regularPrice: 165, weeklySessions: 2, featured: true },
      { tier: "elite", launchPrice: 150, regularPrice: 230, weeklySessions: 3 },
    ],
  },
  features: {
    individual: [
      { key: "live_review", tiers: ["basic", "pro", "elite"] },
      { key: "weekly_goals", tiers: ["basic", "pro", "elite"] },
      { key: "training_routine", tiers: ["pro", "elite"] },
      { key: "offline_review", tiers: ["pro", "elite"] },
      { key: "discord_support", tiers: ["elite"] },
      { key: "progress_report", tiers: ["elite"] },
    ],
    teams: [
      { key: "rotations", tiers: ["basic", "pro", "elite"] },
      { key: "match_review", tiers: ["basic", "pro", "elite"] },
      { key: "roles_comms", tiers: ["pro", "elite"] },
      { key: "scrim_review", tiers: ["pro", "elite"] },
      { key: "tournament_prep", tiers: ["elite"] },
      { key: "discord_support", tiers: ["elite"] },
    ],
  },
  // La de presentación es gratis; las de pago son más caras por hora que cualquier pack,
  // para que el pack sea siempre la mejor opción
  singleSessions: [
    { key: "intro", price: 0 },
    { key: "live", price: 20 },
    { key: "replay_review", price: 10 },
    { key: "team_live", price: 35 },
  ],
  singleSessionCreditDays: 7,
  teamsWorkedWith: ["Crow 6 eSports", "VentuCorp eSports", "Prodigy Five"],
};
