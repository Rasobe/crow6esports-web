import { describe, expect, it } from "vitest";
import { isCompleteSchedule, isPlausibleBirthDate } from "./tryout-application";

describe("isPlausibleBirthDate", () => {
  const today = new Date("2026-11-03T12:00:00Z");

  it("accepts real past dates", () => {
    expect(isPlausibleBirthDate("2005-06-15", today)).toBe(true);
  });

  it("rejects future, ancient and non-existent dates", () => {
    expect(isPlausibleBirthDate("2027-01-01", today)).toBe(false);
    expect(isPlausibleBirthDate("1850-01-01", today)).toBe(false);
    expect(isPlausibleBirthDate("not-a-date", today)).toBe(false);
  });
});

describe("isCompleteSchedule", () => {
  it("accepts flexible schedules without hours", () => {
    expect(isCompleteSchedule({ scheduleType: "flexible" })).toBe(true);
  });

  it("needs two different half-hour slots for fixed schedules", () => {
    expect(
      isCompleteSchedule({ scheduleType: "fixed", scheduleFrom: "22:00", scheduleTo: "01:00" }),
    ).toBe(true);
    expect(isCompleteSchedule({ scheduleType: "fixed", scheduleFrom: "22:00" })).toBe(false);
    expect(
      isCompleteSchedule({ scheduleType: "fixed", scheduleFrom: "22:00", scheduleTo: "22:00" }),
    ).toBe(false);
    expect(
      isCompleteSchedule({ scheduleType: "fixed", scheduleFrom: "22:10", scheduleTo: "23:00" }),
    ).toBe(false);
  });
});
