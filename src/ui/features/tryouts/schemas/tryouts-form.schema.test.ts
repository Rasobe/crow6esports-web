import { describe, expect, it } from "vitest";
import {
  STEP_FIELDS,
  stepMindsetSchema,
  stepProfileSchema,
  stepTechnicalSchema,
  tryoutsFormSchema,
} from "./tryouts-form.schema";

describe("tryouts form schema", () => {
  it("reports translation keys as error messages", () => {
    const result = stepProfileSchema.safeParse({
      discord: "",
      birthDate: "",
      country: "",
      availabilityWeekdays: "",
      availabilityWeekends: "",
      availabilityScrims: "",
    });
    const messages = result.success ? [] : result.error.issues.map((issue) => issue.message);
    expect(messages).toContain("validation.discord_required");
  });

  it("requires a valid RLTracker url and at least one hour played", () => {
    const result = stepTechnicalSchema.safeParse({
      rltracker: "nope",
      rank: "1",
      peak: "1",
      hoursPlayed: 0,
      playstyle: "calm",
    });
    const messages = result.success ? [] : result.error.issues.map((issue) => issue.message);
    expect(messages).toEqual(
      expect.arrayContaining(["validation.rltracker_invalid", "validation.hours_required"]),
    );
  });

  it("requires meaningful free-text answers", () => {
    const result = stepMindsetSchema.safeParse({
      hasCompetitiveExp: "no",
      reactionToMistakes: "short",
      reactionToLosses: "calm",
      lookingFor: "short",
      openToCoaching: "yes",
    });
    expect(result.success).toBe(false);
  });

  it("covers every form field exactly once across steps", () => {
    const stepped = STEP_FIELDS.flat();
    expect(new Set(stepped).size).toBe(stepped.length);
    expect(stepped.sort()).toEqual(Object.keys(tryoutsFormSchema.shape).sort());
  });
});
