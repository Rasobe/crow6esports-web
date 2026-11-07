import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";
import type { TryoutApplication } from "@/domain/tryouts/tryout-application";
import { createSupabaseTryoutRepository } from "./tryout.supabase-repository";

const application: TryoutApplication = {
  discord: "player_one",
  birthDate: "2005-06-15",
  country: "España",
  availableDays: ["mon", "wed"],
  scheduleType: "flexible",
  scheduleFrom: "",
  scheduleTo: "",
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
  openToCoaching: "yes",
};

function fakeClient(error: { message: string } | null = null) {
  const insert = vi.fn().mockResolvedValue({ error });
  const from = vi.fn().mockReturnValue({ insert });
  return { client: { from } as unknown as SupabaseClient, from, insert };
}

describe("supabase tryout repository", () => {
  it("inserts a snake_case row into tryout_requests with the locale", async () => {
    const { client, from, insert } = fakeClient();

    await createSupabaseTryoutRepository(client).save(application, "en", {});

    expect(from).toHaveBeenCalledWith("tryout_requests");
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: "en",
        discord: "player_one",
        birth_date: "2005-06-15",
        available_days: ["mon", "wed"],
        hours_played: 3000,
        open_to_coaching: "yes",
      }),
    );
  });

  it("stores empty optional text as null and never sets status or id", async () => {
    const { client, insert } = fakeClient();

    await createSupabaseTryoutRepository(client).save(application, "es", {});

    const row = insert.mock.calls[0][0];
    expect(row).toMatchObject({ schedule_from: null, schedule_to: null, highlights: null });
    expect(row).not.toHaveProperty("status");
    expect(row).not.toHaveProperty("id");
  });

  it("stores the attribution columns, empty ones as null", async () => {
    const { client, insert } = fakeClient();

    await createSupabaseTryoutRepository(client).save(application, "es", {
      sourcePage: "/es/coaching",
      referrer: "https://www.instagram.com/",
      utmSource: "instagram",
      utmMedium: "",
    });

    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        source_page: "/es/coaching",
        referrer: "https://www.instagram.com/",
        utm_source: "instagram",
        utm_medium: null,
        utm_campaign: null,
      }),
    );
  });

  it("rejects when Supabase returns an error", async () => {
    const { client } = fakeClient({ message: "permission denied" });

    await expect(
      createSupabaseTryoutRepository(client).save(application, "es", {}),
    ).rejects.toThrow("permission denied");
  });
});
