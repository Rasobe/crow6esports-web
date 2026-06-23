import players from "@content/players.json";
import { Player } from "@/types"

export function getPlayers(): Player[] {
    return players as Player[];
}

export function getActivePlayers(): Player[] {
    return getPlayers().filter(
        player => player.status === "active" && player.type === "player"
    );
}

export function getSubstitutePlayers(): Player[] {
    return getPlayers().filter(
        player => player.status === "substitute" && player.type === "player"
    );
}

export function getRetiredPlayers(): Player[] {
    return getPlayers().filter(player => player.status === "retired" && player.type === "player");
}

export function getStaffMembers(): Player[] {
    return getPlayers().filter(player => player.type !== "player");
}