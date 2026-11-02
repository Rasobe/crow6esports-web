import { describe, expect, it } from "vitest";
import { getStartingPlan, type CoachingPlan } from "./coaching-plan";

const plans: CoachingPlan[] = [
  { tier: "pro", price: 55, originalPrice: 90, weeklySessions: 2 },
  { tier: "basic", price: 28, originalPrice: 55, weeklySessions: 1 },
  { tier: "elite", price: 78, originalPrice: 120, weeklySessions: 3 },
];

describe("getStartingPlan", () => {
  it("returns the cheapest plan", () => {
    expect(getStartingPlan(plans).tier).toBe("basic");
  });
});
