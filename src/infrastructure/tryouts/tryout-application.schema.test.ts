import { describe, expect, it } from "vitest";
import { tryoutApplicationSchema } from "./tryout-application.schema";

const valid = {
  discord: "user",
  birthDate: "2000-01-01",
  country: "ES",
  availabilityWeekdays: "L-V",
  availabilityWeekends: "S-D",
  availabilityScrims: "X",
  rltracker: "https://rocketleague.tracker.network/profile/1",
  rank: "1800",
  peak: "2000",
  hoursPlayed: 3000,
  playstyle: "calm",
  highlights: "",
  hasCompetitiveExp: "no",
  reactionToMistakes: "I stay calm and talk it through",
  reactionToLosses: "calm",
  lookingFor: "A serious competitive environment",
  openToCoaching: "maybe",
};

describe("tryoutApplicationSchema", () => {
  it("accepts a complete application", () => {
    expect(tryoutApplicationSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects non http(s) urls", () => {
    const result = tryoutApplicationSchema.safeParse({
      ...valid,
      rltracker: "javascript:alert(1)",
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown enum values and oversized text", () => {
    expect(tryoutApplicationSchema.safeParse({ ...valid, playstyle: "chaos" }).success).toBe(false);
    expect(
      tryoutApplicationSchema.safeParse({ ...valid, lookingFor: "x".repeat(2001) }).success,
    ).toBe(false);
  });
});
