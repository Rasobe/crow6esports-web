import { describe, expect, it } from "vitest";
import { tryoutApplicationSchema, tryoutSubmissionSchema } from "./tryout-application.schema";

const valid = {
  discord: "user",
  birthDate: "2000-01-01",
  country: "ES",
  availableDays: ["mon", "wed", "sat"],
  scheduleType: "fixed",
  scheduleFrom: "18:00",
  scheduleTo: "22:00",
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

  it("only accepts RLTracker profile links", () => {
    const result = tryoutApplicationSchema.safeParse({
      ...valid,
      rltracker: "https://example.com/profile/1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects malformed discord usernames and impossible birth dates", () => {
    expect(tryoutApplicationSchema.safeParse({ ...valid, discord: "a b#1234" }).success).toBe(
      false,
    );
    expect(tryoutApplicationSchema.safeParse({ ...valid, birthDate: "2999-01-01" }).success).toBe(
      false,
    );
    expect(tryoutApplicationSchema.safeParse({ ...valid, birthDate: "2000-02-30" }).success).toBe(
      false,
    );
  });

  it("requires complete fixed schedules and at least one training day", () => {
    const parse = (overrides: object) =>
      tryoutApplicationSchema.safeParse({ ...valid, ...overrides });
    expect(parse({ scheduleTo: "" }).success).toBe(false);
    expect(parse({ scheduleTo: "18:00" }).success).toBe(false);
    expect(parse({ scheduleFrom: "18:15" }).success).toBe(false);
    expect(parse({ scheduleType: "flexible", scheduleFrom: "", scheduleTo: "" }).success).toBe(
      true,
    );
    expect(parse({ availableDays: [] }).success).toBe(false);
  });

  it("rejects unknown enum values and oversized text", () => {
    expect(tryoutApplicationSchema.safeParse({ ...valid, playstyle: "chaos" }).success).toBe(false);
    expect(
      tryoutApplicationSchema.safeParse({ ...valid, lookingFor: "x".repeat(2001) }).success,
    ).toBe(false);
  });
});

describe("tryoutSubmissionSchema", () => {
  it("requires a supported locale", () => {
    expect(tryoutSubmissionSchema.safeParse({ ...valid, locale: "en" }).success).toBe(true);
    expect(tryoutSubmissionSchema.safeParse({ ...valid, locale: "fr" }).success).toBe(false);
    expect(tryoutSubmissionSchema.safeParse(valid).success).toBe(false);
  });
});
