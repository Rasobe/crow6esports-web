import { describe, expect, it } from "vitest";
import type { CoachingMode, CoachingPlan } from "@/domain/coaching/coaching-plan";
import { getCoachingPricing } from "./get-coaching-pricing";

const plans: Record<CoachingMode, readonly CoachingPlan[]> = {
  individual: [
    { tier: "pro", launchPrice: 75, regularPrice: 110, weeklySessions: 2 },
    { tier: "basic", launchPrice: 40, regularPrice: 60, weeklySessions: 1 },
  ],
  teams: [{ tier: "basic", launchPrice: 60, regularPrice: 90, weeklySessions: 1 }],
};
const endsAt = new Date("2026-12-31T23:59:59+01:00");

describe("getCoachingPricing", () => {
  it("charges the launch price while the launch is active", () => {
    const pricing = getCoachingPricing(plans, endsAt, new Date("2026-11-04T10:00:00Z"));

    expect(pricing.launchActive).toBe(true);
    expect(pricing.plans.individual.map((plan) => plan.current)).toEqual([75, 40]);
    expect(pricing.plans.individual[0].regular).toBe(110);
    expect(pricing.startingPrice).toEqual({ individual: 40, teams: 60 });
    expect(pricing.currentPrices).toEqual([75, 40, 60]);
  });

  it("keeps the launch price until the very last instant", () => {
    expect(getCoachingPricing(plans, endsAt, endsAt).launchActive).toBe(true);
  });

  it("switches to the regular price on its own once the date has passed", () => {
    const pricing = getCoachingPricing(plans, endsAt, new Date("2027-01-01T00:00:00+01:00"));

    expect(pricing.launchActive).toBe(false);
    expect(pricing.plans.individual.map((plan) => plan.current)).toEqual([110, 60]);
    expect(pricing.startingPrice).toEqual({ individual: 60, teams: 90 });
    expect(pricing.currentPrices).toEqual([110, 60, 90]);
  });
});
