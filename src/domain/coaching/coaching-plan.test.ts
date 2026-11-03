import { describe, expect, it } from "vitest";
import {
  getPricePerPlayer,
  getStartingPlan,
  includesFeature,
  type CoachingPlan,
} from "./coaching-plan";

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

describe("includesFeature", () => {
  it("is true only for the tiers listed in the feature", () => {
    const feature = { key: "progress_report", tiers: ["pro", "elite"] as const };
    expect(includesFeature(plans[0], feature)).toBe(true);
    expect(includesFeature(plans[1], feature)).toBe(false);
  });
});

describe("getPricePerPlayer", () => {
  it("splits the team price between its players, rounded", () => {
    expect(getPricePerPlayer(plans[0], 3)).toBe(18);
  });
});
