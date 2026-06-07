import playersData from "../../../../content/players.json";
import type { Player } from "../types";

export function getPlayers(): Player[] {
  return playersData as Player[];
}

export function getStartingRoster(): Player[] {
  return getPlayers().filter((p) => p.isStarter);
}
