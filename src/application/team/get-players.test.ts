import { describe, expect, it } from "vitest";
import type { Player } from "@/domain/team/player";
import type { PlayerRepository } from "@/domain/team/player.repository";
import { getActivePlayers, getStaffMembers, getSubstitutePlayers } from "./get-players";

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

const repository: PlayerRepository = {
  findAll: () => [
    buildPlayer({ id: "active" }),
    buildPlayer({ id: "sub", status: "substitute" }),
    buildPlayer({ id: "coach", type: "coach" }),
  ],
};

describe("player queries", () => {
  it("returns only active players", () => {
    expect(getActivePlayers(repository).map((p) => p.id)).toEqual(["active"]);
  });

  it("returns only substitute players", () => {
    expect(getSubstitutePlayers(repository).map((p) => p.id)).toEqual(["sub"]);
  });

  it("returns staff members regardless of status", () => {
    expect(getStaffMembers(repository).map((p) => p.id)).toEqual(["coach"]);
  });
});
