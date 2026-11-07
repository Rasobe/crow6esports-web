export type CoachingMode = "individual" | "teams";
export type CoachingTier = "basic" | "pro" | "elite";

export interface CoachingPlan {
  tier: CoachingTier;
  launchPrice: number;
  regularPrice: number;
  weeklySessions: number;
  featured?: boolean;
}

/** Lo que paga hoy quien contrata un pack, y si el precio de lanzamiento sigue vigente. */
export interface PlanPricing {
  current: number;
  regular: number;
  launchActive: boolean;
}

/** Sesión o servicio que se contrata por unidad, fuera de los packs mensuales. */
export interface CoachingSingleSession {
  key: string;
  price: number;
}

export interface CoachingFeature {
  key: string;
  tiers: readonly CoachingTier[];
}

const WEEKS_PER_MONTH = 4;

export function includesFeature(plan: CoachingPlan, feature: CoachingFeature): boolean {
  return feature.tiers.includes(plan.tier);
}

/** El precio de lanzamiento vale hasta el instante `endsAt` incluido. */
export function isLaunchActive(endsAt: Date, now: Date = new Date()): boolean {
  return now.getTime() <= endsAt.getTime();
}

export function getPlanPricing(plan: CoachingPlan, launchActive: boolean): PlanPricing {
  return {
    current: launchActive ? plan.launchPrice : plan.regularPrice,
    regular: plan.regularPrice,
    launchActive,
  };
}

export function getStartingPlan(
  plans: readonly CoachingPlan[],
  launchActive: boolean,
): CoachingPlan {
  return plans.reduce((cheapest, plan) =>
    getPlanPricing(plan, launchActive).current < getPlanPricing(cheapest, launchActive).current
      ? plan
      : cheapest,
  );
}

export function getPricePerPlayer(price: number, players: number): number {
  return Math.round(price / players);
}

/** Horas de coaching al mes de un pack: sesiones por semana × 4 semanas × duración. */
export function getMonthlyHours(plan: CoachingPlan, sessionDurationHours: number): number {
  return plan.weeklySessions * WEEKS_PER_MONTH * sessionDurationHours;
}
