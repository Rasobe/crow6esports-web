import { describe, expect, it, vi } from "vitest";
import type { TryoutApplication } from "@/domain/tryouts/tryout-application";
import type { TryoutNotifier } from "@/domain/tryouts/tryout-notifier";
import { submitTryoutApplication } from "./submit-tryout-application";

const application: TryoutApplication = {
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
  hasCompetitiveExp: "no",
  reactionToMistakes: "I stay calm and talk it through",
  reactionToLosses: "calm",
  lookingFor: "A serious competitive environment",
  openToCoaching: "yes",
};

describe("submitTryoutApplication", () => {
  it("delivers the application through the notifier", async () => {
    const notifier: TryoutNotifier = { notify: vi.fn().mockResolvedValue(undefined) };

    await submitTryoutApplication(notifier, application);

    expect(notifier.notify).toHaveBeenCalledWith(application);
  });

  it("propagates delivery failures", async () => {
    const notifier: TryoutNotifier = { notify: vi.fn().mockRejectedValue(new Error("boom")) };

    await expect(submitTryoutApplication(notifier, application)).rejects.toThrow("boom");
  });
});
