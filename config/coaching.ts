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
  teamMinPlayers: number;
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
      { tier: "basic", price: 19, originalPrice: 29, weeklySessions: 1 },
      { tier: "pro", price: 35, originalPrice: 55, weeklySessions: 2, featured: true },
      { tier: "elite", price: 49, originalPrice: 79, weeklySessions: 3 },
    ],
    teams: [
      { tier: "basic", price: 49, originalPrice: 75, weeklySessions: 1 },
      { tier: "pro", price: 85, originalPrice: 135, weeklySessions: 2, featured: true },
      { tier: "elite", price: 119, originalPrice: 189, weeklySessions: 3 },
    ],
  },
  teamsWorkedWith: ["Crow 6 eSports", "VentuCorp eSports", "Prodigy Five"],
};
