export type CoachingMode = "individual" | "teams";
export type CoachingTier = "basic" | "pro" | "elite";

export interface CoachingPlan {
  tier: CoachingTier;
  price: number;
  originalPrice: number;
  weeklySessions: number;
  featured?: boolean;
}

/** Sesión o servicio que se contrata por unidad, fuera de los packs mensuales. */
export interface CoachingSingleSession {
  key: string;
  price: number;
}

/** Una ventaja de los packs y los niveles que la incluyen. */
export interface CoachingFeature {
  key: string;
  tiers: readonly CoachingTier[];
}

export function includesFeature(plan: CoachingPlan, feature: CoachingFeature): boolean {
  return feature.tiers.includes(plan.tier);
}

export function getStartingPlan(plans: readonly CoachingPlan[]): CoachingPlan {
  return plans.reduce((cheapest, plan) => (plan.price < cheapest.price ? plan : cheapest));
}

export function getPricePerPlayer(plan: CoachingPlan, players: number): number {
  return Math.round(plan.price / players);
}
