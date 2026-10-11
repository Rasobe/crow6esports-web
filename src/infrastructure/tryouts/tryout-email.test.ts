import { describe, expect, it } from "vitest";
import type { TryoutApplication } from "@/domain/tryouts/tryout-application";
import { buildTryoutEmail } from "./tryout-email";

const application: TryoutApplication = {
  discord: "<script>alert(1)</script>",
  birthDate: "2000-01-01",
  country: "ES",
  availabilityWeekdays: "L-V",
  availabilityWeekends: "S-D",
  availabilityScrims: "X",
  rltracker: 'https://example.com/"onmouseover="x',
  rank: "1800",
  peak: "2000",
  hoursPlayed: 3000,
  playstyle: "mechanical",
  hasCompetitiveExp: "yes",
  previousTeams: "Team <b>A</b>",
  reactionToMistakes: "I stay calm and talk it through",
  reactionToLosses: "encourage",
  lookingFor: "A serious competitive environment",
  openToCoaching: "maybe",
};

describe("buildTryoutEmail", () => {
  const html = buildTryoutEmail(application);

  it("escapes user-provided content", () => {
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<b>A</b>");
    expect(html).not.toContain('"onmouseover="x');
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
  });

  it("renders human readable labels for enum values", () => {
    expect(html).toContain("Mecánicas");
    expect(html).toContain("Animo a mis compañeros");
    expect(html).toContain("Tal vez");
  });
});
