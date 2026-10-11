import type { Player } from "@/domain/team/player";
import type { PlayerRepository } from "@/domain/team/player.repository";

type PlayerFilter = (player: Player) => boolean;

function createPlayerQuery(filter: PlayerFilter) {
  return (repository: PlayerRepository): Player[] => repository.findAll().filter(filter);
}

export const getAllPlayers = createPlayerQuery(() => true);

export const getActivePlayers = createPlayerQuery(
  (player) => player.status === "active" && player.type === "player",
);

export const getSubstitutePlayers = createPlayerQuery(
  (player) => player.status === "substitute" && player.type === "player",
);

export const getStaffMembers = createPlayerQuery((player) => player.type !== "player");
