import { describe, expect, it } from "vitest";
import {
  getMonthlyHours,
  getPlanPricing,
  getPricePerPlayer,
  getStartingPlan,
  includesFeature,
  isLaunchActive,
  type CoachingPlan,
} from "./coaching-plan";

const plans: CoachingPlan[] = [
  { tier: "pro", launchPrice: 75, regularPrice: 110, weeklySessions: 2 },
  { tier: "basic", launchPrice: 40, regularPrice: 60, weeklySessions: 1 },
  { tier: "elite", launchPrice: 105, regularPrice: 150, weeklySessions: 3 },
];

describe("getStartingPlan", () => {
  it("returns the cheapest plan", () => {
    expect(getStartingPlan(plans, true).tier).toBe("basic");
    expect(getStartingPlan(plans, false).tier).toBe("basic");
  });
});

describe("isLaunchActive", () => {
  const endsAt = new Date("2026-12-31T23:59:59+01:00");

  it("is true up to and including the end date", () => {
    expect(isLaunchActive(endsAt, new Date("2026-11-04T00:00:00Z"))).toBe(true);
    expect(isLaunchActive(endsAt, endsAt)).toBe(true);
  });

  it("is false afterwards", () => {
    expect(isLaunchActive(endsAt, new Date("2027-01-01T00:00:00+01:00"))).toBe(false);
  });
});

describe("getPlanPricing", () => {
  it("picks the launch or the regular price", () => {
    expect(getPlanPricing(plans[0], true)).toEqual({
      current: 75,
      regular: 110,
      launchActive: true,
    });
    expect(getPlanPricing(plans[0], false)).toEqual({
      current: 110,
      regular: 110,
      launchActive: false,
    });
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
    expect(getPricePerPlayer(55, 3)).toBe(18);
  });
});

describe("getMonthlyHours", () => {
  it("turns weekly sessions into 4, 8 and 12 hours a month", () => {
    expect(plans.map((plan) => getMonthlyHours(plan, 1)).sort((a, b) => a - b)).toEqual([4, 8, 12]);
  });
});
