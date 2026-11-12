export const siteConfig = {
  name: "Crow 6 eSports",
  url: "https://crow6esports.com",
} as const;

export const socialLinks = [
  { platform: "x", href: "https://x.com/crow6esports", label: "X" },
  { platform: "instagram", href: "https://www.instagram.com/crow6esports", label: "Instagram" },
  { platform: "discord", href: "https://discord.com/invite/jEpNsWaMP3", label: "Discord" },
  { platform: "twitch", href: "https://www.twitch.tv/crow6esports", label: "Twitch" },
  { platform: "tiktok", href: "https://www.tiktok.com/@crow6esports", label: "TikTok" },
  { platform: "youtube", href: "https://www.youtube.com/@crow6esports", label: "YouTube" },
] as const;

export const socialUrls: readonly string[] = socialLinks.map(({ href }) => href);

export const DISCORD_URL = socialLinks.find(({ platform }) => platform === "discord")!.href;

export const INSTAGRAM_URL = socialLinks.find(({ platform }) => platform === "instagram")!.href;

export type SiteConfig = typeof siteConfig;
