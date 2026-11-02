import { describe, expect, it } from "vitest";
import { yearsSince } from "./years";

describe("yearsSince", () => {
  it("counts calendar years from the start year", () => {
    expect(yearsSince(2020, new Date("2026-03-01"))).toBe(6);
  });

  it("never returns a negative amount", () => {
    expect(yearsSince(2030, new Date("2026-03-01"))).toBe(0);
  });
});
