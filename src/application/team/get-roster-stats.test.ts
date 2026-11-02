import { describe, expect, it } from "vitest";
import type { Player } from "@/domain/team/player";
import type { PlayerRepository } from "@/domain/team/player.repository";
import { getRosterStats } from "./get-roster-stats";

const buildPlayer = (overrides: Partial<Player>): Player => ({
  id: "id",
  nickname: "nick",
  realName: "name",
  birthYear: null,
  anonymous: false,
  country: "ES",
  type: "player",
  status: "active",
  game: "rocket-league",
  joinedYear: 2023,
  stats: { mmr: 1, peak: 1, rank: "GC" },
  socials: {
    twitter: null,
    instagram: null,
    twitch: null,
    tiktok: null,
    youtube: null,
    rltracker: null,
  },
  image: null,
  ...overrides,
});

const withPeak = (peak: number) => ({ mmr: 1, peak, rank: "GC" });

describe("getRosterStats", () => {
  it("counts starters and substitutes and takes the highest peak among them", () => {
    const repository: PlayerRepository = {
      findAll: () => [
        buildPlayer({ stats: withPeak(1900) }),
        buildPlayer({ status: "substitute", stats: withPeak(1700) }),
        buildPlayer({ type: "coach", stats: withPeak(2500) }),
        buildPlayer({ status: "former", stats: withPeak(2400) }),
      ],
    };

    expect(getRosterStats(repository)).toEqual({ playerCount: 2, peakMmr: 1900 });
  });

  it("returns zeros for an empty roster", () => {
    expect(getRosterStats({ findAll: () => [] })).toEqual({ playerCount: 0, peakMmr: 0 });
  });
});
