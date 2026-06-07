export type Role = "top" | "jungle" | "mid" | "adc" | "support" | "coach" | "substitute";

export type SocialLinks = {
  twitter?: string;
  instagram?: string;
  twitch?: string;
};

export type Stats = {
  mmr: number;
  winRate: number;
  kda: number;
};

export type Player = {
  id: string;
  name: string;
  gamertag: string;
  role: Role;
  photo: string;
  stats: Stats;
  socials: SocialLinks;
  isStarter: boolean;
};
