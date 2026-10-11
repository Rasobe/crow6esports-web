import players from "@content/players.json";
import type { Player } from "@/domain/team/player";
import type { PlayerRepository } from "@/domain/team/player.repository";

export function createJsonPlayerRepository(): PlayerRepository {
  return { findAll: () => players as Player[] };
}
