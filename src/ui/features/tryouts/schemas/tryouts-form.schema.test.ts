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
      availableDays: ["mon", "wed", "sat"],
      scheduleType: "fixed",
      scheduleFrom: "18:00",
      scheduleTo: "22:00",
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

  it("explains invalid discord usernames and birth dates", () => {
    const result = stepProfileSchema.safeParse({
      discord: "user#1234",
      birthDate: "2999-01-01",
      country: "ES",
      availableDays: ["sat"],
      scheduleType: "flexible",
    });
    const messages = result.success ? [] : result.error.issues.map((issue) => issue.message);
    expect(messages).toEqual(
      expect.arrayContaining(["validation.discord_invalid", "validation.birth_date_invalid"]),
    );
  });

  it("requires at least one training day and a schedule type", () => {
    const result = stepProfileSchema.safeParse({ availableDays: [] });
    const messages = result.success ? [] : result.error.issues.map((issue) => issue.message);
    expect(messages).toEqual(
      expect.arrayContaining([
        "validation.available_days_required",
        "validation.schedule_type_required",
      ]),
    );
  });

  it("asks for both times only with a fixed schedule", () => {
    const issuesFor = (schedule: object) => {
      const result = tryoutsFormSchema.safeParse(schedule);
      return result.success ? [] : result.error.issues.map((issue) => issue.message);
    };

    expect(issuesFor({ scheduleType: "fixed", scheduleFrom: "", scheduleTo: "" })).toEqual(
      expect.arrayContaining([
        "validation.schedule_from_required",
        "validation.schedule_to_required",
      ]),
    );
    expect(
      issuesFor({ scheduleType: "fixed", scheduleFrom: "20:00", scheduleTo: "20:00" }),
    ).toContain("validation.schedule_same_time");
    expect(issuesFor({ scheduleType: "flexible" })).not.toContain(
      "validation.schedule_from_required",
    );
  });

  it("requires the choice questions to be answered", () => {
    const result = stepMindsetSchema.safeParse({
      reactionToMistakes: "I stay calm and talk it through",
      lookingFor: "A serious competitive environment",
    });
    const messages = result.success ? [] : result.error.issues.map((issue) => issue.message);
    expect(messages).toEqual(
      expect.arrayContaining([
        "validation.competitive_exp_required",
        "validation.reaction_losses_required",
        "validation.coaching_required",
      ]),
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
