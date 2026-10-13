import type { PlayerSocials, PlayerStatus, PlayerType } from "@/domain/team/player";
import type { IconName } from "../icons";

export function getAge(birthYear: number | null): number | null {
  if (!birthYear) return null;
  return new Date().getFullYear() - birthYear;
}

export type SocialPlatform =
  "twitter" | "instagram" | "twitch" | "tiktok" | "youtube" | "rltracker";

const SOCIAL_ORDER: SocialPlatform[] = [
  "twitter",
  "instagram",
  "twitch",
  "tiktok",
  "youtube",
  "rltracker",
];

const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  twitter: "Twitter / X",
  instagram: "Instagram",
  twitch: "Twitch",
  tiktok: "TikTok",
  youtube: "YouTube",
  rltracker: "RLTracker",
};

export interface ActiveSocialLink {
  platform: SocialPlatform;
  href: string;
  label: string;
}

export function getActiveSocialLinks(socials: PlayerSocials): ActiveSocialLink[] {
  return SOCIAL_ORDER.flatMap((platform) => {
    const href = socials[platform];
    if (!href) return [];
    return [{ platform, href, label: SOCIAL_LABELS[platform] }];
  });
}

export const ROLE_KEY: Record<PlayerType, string> = {
  player: "role_player",
  coach: "role_coach",
  analyst: "role_analyst",
  manager: "role_manager",
};

export const STATUS_KEY: Record<PlayerStatus, string | null> = {
  active: null,
  substitute: "status_substitute",
  retired: "status_retired",
  former: "status_former",
};

export const SOCIAL_ICONS: Record<SocialPlatform, IconName> = {
  twitter: "x",
  instagram: "instagram",
  twitch: "twitch",
  tiktok: "tiktok",
  youtube: "youtube",
  rltracker: "rltracker",
};

export function formatStat(value: number, locale: string): string {
  return value.toLocaleString(locale);
}
