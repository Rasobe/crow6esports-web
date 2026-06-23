import { Player } from "@/types";
import playersData from "@content/players.json";

export function getPlayers(): Player[] {
  return playersData as Player[];
}

export function getActivePlayers(): Player[] {
  return getPlayers().filter((p) => p.status === "active");
}
