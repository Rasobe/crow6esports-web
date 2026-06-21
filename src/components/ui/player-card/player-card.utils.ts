import type { PlayerSocials } from "@/types/Player";

export function getAge(birthYear: number | null): number | null {
  if (!birthYear) return null;
  return new Date().getFullYear() - birthYear;
}

export type SocialPlatform =
  | "twitter"
  | "instagram"
  | "twitch"
  | "tiktok"
  | "youtube"
  | "rltracker";

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
