import {
  getPlanPricing,
  getStartingPlan,
  isLaunchActive,
  type CoachingMode,
  type CoachingPlan,
  type PlanPricing,
} from "@/domain/coaching/coaching-plan";

export type PricedPlan = CoachingPlan & PlanPricing;

export interface CoachingPricing {
  launchActive: boolean;
  launchEndsAt: Date;
  plans: Record<CoachingMode, readonly PricedPlan[]>;
  /** Precio mensual más bajo que se cobra ahora, por modalidad. */
  startingPrice: Record<CoachingMode, number>;
  /** Todos los precios mensuales vigentes, para el JSON-LD. */
  currentPrices: readonly number[];
}

/**
 * Los precios de los packs a una fecha dada. Con el lanzamiento vigente se cobra el precio de
 * lanzamiento; pasada `launchEndsAt` solo existe el regular.
 */
export function getCoachingPricing(
  plans: Record<CoachingMode, readonly CoachingPlan[]>,
  launchEndsAt: Date,
  now: Date = new Date(),
): CoachingPricing {
  const launchActive = isLaunchActive(launchEndsAt, now);
  const priced = (mode: CoachingMode): PricedPlan[] =>
    plans[mode].map((plan) => ({ ...plan, ...getPlanPricing(plan, launchActive) }));

  const individual = priced("individual");
  const teams = priced("teams");

  return {
    launchActive,
    launchEndsAt,
    plans: { individual, teams },
    startingPrice: {
      individual: getPlanPricing(getStartingPlan(plans.individual, launchActive), launchActive)
        .current,
      teams: getPlanPricing(getStartingPlan(plans.teams, launchActive), launchActive).current,
    },
    currentPrices: [...individual, ...teams].map((plan) => plan.current),
  };
}
