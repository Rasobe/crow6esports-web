export type PlayerType = "player" | "coach" | "analyst" | "manager";

export type PlayerStatus = "active" | "substitute" | "retired" | "former";

export type Game = "rocket-league" | "valorant" | "csgo";

export interface PlayerSocials {
  twitter: string | null;
  instagram: string | null;
  twitch: string | null;
  tiktok: string | null;
  youtube: string | null;
  rltracker: string | null;
}

export interface PlayerStats {
  mmr: number;
  peak: number;
  rank: string;
}

export interface Player {
  id: string;
  nickname: string;
  realName: string;
  birthYear: number | null;
  anonymous: boolean;
  country: string;
  type: PlayerType;
  status: PlayerStatus;
  game: Game;
  joinedYear: number;
  stats: PlayerStats;
  socials: PlayerSocials;
  image: string | null;
}
