import { describe, expect, it, vi } from "vitest";
import type { TryoutApplication } from "@/domain/tryouts/tryout-application";
import type { TryoutNotifier } from "@/domain/tryouts/tryout-notifier";
import type { TryoutRepository } from "@/domain/tryouts/tryout-repository";
import { submitTryoutApplication } from "./submit-tryout-application";

const application: TryoutApplication = {
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
  hasCompetitiveExp: "no",
  reactionToMistakes: "I stay calm and talk it through",
  reactionToLosses: "calm",
  lookingFor: "A serious competitive environment",
  openToCoaching: "yes",
};

function setup({
  save = vi.fn().mockResolvedValue(undefined),
  notify = vi.fn().mockResolvedValue(undefined),
} = {}) {
  const repository: TryoutRepository = { save };
  const notifier: TryoutNotifier = { notify };
  const onNotificationFailure = vi.fn();
  const deps = { repository, notifier, onNotificationFailure };
  return { deps, save, notify, onNotificationFailure };
}

describe("submitTryoutApplication", () => {
  it("stores the application and then notifies", async () => {
    const { deps, save, notify } = setup();

    await submitTryoutApplication(deps, application, "en");

    expect(save).toHaveBeenCalledWith(application, "en");
    expect(notify).toHaveBeenCalledWith(application);
    expect(save.mock.invocationCallOrder[0]).toBeLessThan(notify.mock.invocationCallOrder[0]);
  });

  it("propagates storage failures without notifying", async () => {
    const { deps, notify } = setup({ save: vi.fn().mockRejectedValue(new Error("db down")) });

    await expect(submitTryoutApplication(deps, application, "es")).rejects.toThrow("db down");
    expect(notify).not.toHaveBeenCalled();
  });

  it("reports notification failures without failing the submission", async () => {
    const error = new Error("boom");
    const { deps, onNotificationFailure } = setup({ notify: vi.fn().mockRejectedValue(error) });

    await expect(submitTryoutApplication(deps, application, "es")).resolves.toBeUndefined();
    expect(onNotificationFailure).toHaveBeenCalledWith(error);
  });
});
