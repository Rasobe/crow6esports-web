export type CoachingMode = "individual" | "teams";
export type CoachingTier = "basic" | "pro" | "elite";

export interface CoachingPlan {
  tier: CoachingTier;
  price: number;
  originalPrice: number;
  weeklySessions: number;
  featured?: boolean;
}

export function getStartingPlan(plans: readonly CoachingPlan[]): CoachingPlan {
  return plans.reduce((cheapest, plan) => (plan.price < cheapest.price ? plan : cheapest));
}
