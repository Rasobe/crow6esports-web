import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";
import {
  createSupabaseTryoutRequestRepository,
  toTryoutRequest,
  type TryoutRequestRow,
} from "./tryout-request.supabase-repository";

const row: TryoutRequestRow = {
  id: "0b6d5f0e-8f3b-4c43-9a55-6f2a3d8d5c11",
  created_at: "2026-11-06T21:00:00Z",
  status: "new",
  locale: "es",
  notes: null,
  discord: "player_one",
  birth_date: "2005-06-15",
  country: "España",
  available_days: ["mon"],
  schedule_type: "flexible",
  schedule_from: null,
  schedule_to: null,
  availability_notes: null,
  time_zone: "Europe/Madrid",
  rltracker: "https://rocketleague.tracker.network/profile/1",
  rank: "1800",
  peak: "2000",
  hours_played: 3000,
  playstyle: "calm",
  highlights: null,
  has_competitive_exp: "no",
  previous_teams: null,
  reaction_to_mistakes: "Calma",
  reaction_to_losses: "calm",
  looking_for: "Competir",
  open_to_coaching: "yes",
};

/** Chainable stand in for the query builder that resolves to `result` when awaited. */
function fakeClient(result: unknown) {
  const calls: Record<string, unknown[]> = {};
  const builder: Record<string, unknown> = {
    then: (resolve: (value: unknown) => unknown) => resolve(result),
  };
  for (const method of ["select", "order", "range", "eq", "update", "maybeSingle"]) {
    builder[method] = vi.fn((...args: unknown[]) => {
      calls[method] = args;
      return builder;
    });
  }
  return { client: { from: vi.fn(() => builder) } as unknown as SupabaseClient, calls };
}

describe("toTryoutRequest", () => {
  it("maps columns to the domain model, turning nulls into missing values", () => {
    const request = toTryoutRequest(row);

    expect(request).toMatchObject({
      id: row.id,
      createdAt: row.created_at,
      hoursPlayed: 3000,
      birthDate: "2005-06-15",
      notes: null,
    });
    expect(request.scheduleFrom).toBeUndefined();
    expect(request.highlights).toBeUndefined();
  });
});

describe("supabase tryout request repository", () => {
  it("lists newest first with the requested range and status filter", async () => {
    const { client, calls } = fakeClient({ data: [row], count: 41, error: null });

    const page = await createSupabaseTryoutRequestRepository(client).list({
      status: "new",
      page: 2,
      pageSize: 20,
    });

    expect(calls.order).toEqual(["created_at", { ascending: false }]);
    expect(calls.range).toEqual([20, 39]);
    expect(calls.eq).toEqual(["status", "new"]);
    expect(page).toMatchObject({ total: 41, page: 2, pageSize: 20 });
    expect(page.items[0].discord).toBe("player_one");
  });

  it("only updates status and notes, and reports whether the row existed", async () => {
    const { client, calls } = fakeClient({ data: [{ id: row.id }], error: null });
    const repository = createSupabaseTryoutRequestRepository(client);

    await expect(
      repository.updateReview(row.id, { status: "accepted", notes: "ok" }),
    ).resolves.toBe(true);
    expect(calls.update).toEqual([{ status: "accepted", notes: "ok" }]);
    expect(calls.eq).toEqual(["id", row.id]);

    const missing = fakeClient({ data: [], error: null });
    await expect(
      createSupabaseTryoutRequestRepository(missing.client).updateReview(row.id, {
        status: "new",
        notes: null,
      }),
    ).resolves.toBe(false);
  });

  it("throws when Supabase fails", async () => {
    const { client } = fakeClient({ data: null, count: null, error: { message: "boom" } });

    await expect(
      createSupabaseTryoutRequestRepository(client).list({ page: 1, pageSize: 20 }),
    ).rejects.toThrow("boom");
  });
});
