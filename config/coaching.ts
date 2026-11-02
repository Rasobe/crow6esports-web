import type { CoachingMode, CoachingPlan } from "@/domain/coaching/coaching-plan";

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
  sessionDurationHours: number;
  availability: {
    days: { from: "mon"; to: "sat" };
    hours: { from: string; to: string };
    timezone: string;
  };
  policy: { postponeMaxDays: number; postponeMaxPerMonth: number };
  plans: Record<CoachingMode, readonly CoachingPlan[]>;
  teamsWorkedWith: readonly string[];
}

// TODO: validar — nombre del coach (aquí "Rasobe"; en players.json el staff es Kronos)
export const COACHING: CoachingConfig = {
  coach: { name: "Rasobe", photo: null, startYear: 2020, hoursPlayed: 6000 },
  results: { maxMmrReached: 2000, recentCase: { from: 1700, to: 2000 } },
  currency: "EUR",
  sessionDurationHours: 1,
  availability: {
    days: { from: "mon", to: "sat" },
    hours: { from: "16:00", to: "22:00" },
    timezone: "CEST",
  },
  policy: { postponeMaxDays: 2, postponeMaxPerMonth: 2 },
  plans: {
    individual: [
      { tier: "basic", price: 28, originalPrice: 55, weeklySessions: 1 },
      { tier: "pro", price: 55, originalPrice: 90, weeklySessions: 2, featured: true },
      { tier: "elite", price: 78, originalPrice: 120, weeklySessions: 3 },
    ],
    teams: [
      { tier: "basic", price: 26, originalPrice: 45, weeklySessions: 1 },
      { tier: "pro", price: 50, originalPrice: 75, weeklySessions: 2 },
      { tier: "elite", price: 68, originalPrice: 100, weeklySessions: 3 },
    ],
  },
  // TODO: validar — logos de los equipos (no hay assets en el repo; se muestran como texto)
  teamsWorkedWith: [
    "K8 eSports",
    "Crow 6 eSports",
    "VentuCorp eSports",
    "Prodigy Five",
    "Moonlab Gaming",
  ],
};
