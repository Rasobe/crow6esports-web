import type { PlayerRepository } from "@/domain/team/player.repository";
import { getActivePlayers, getSubstitutePlayers } from "./get-players";

export interface RosterStats {
  playerCount: number;
  peakMmr: number;
}

export function getRosterStats(repository: PlayerRepository): RosterStats {
  const roster = [...getActivePlayers(repository), ...getSubstitutePlayers(repository)];

  return {
    playerCount: roster.length,
    peakMmr: roster.reduce((peak, { stats }) => Math.max(peak, stats.peak), 0),
  };
}
