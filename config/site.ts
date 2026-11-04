export const siteConfig = {
  name: "Crow 6 eSports",
  url: "https://crow6esports.com",
} as const;

export const socialLinks = [
  { platform: "x", href: "https://x.com/crow6esports", label: "X" },
  { platform: "instagram", href: "https://instagram.com/crow6esports", label: "Instagram" },
  { platform: "discord", href: "https://discord.gg/jEpNsWaMP3", label: "Discord" },
  { platform: "twitch", href: "https://twitch.tv/crow6esports", label: "Twitch" },
  { platform: "tiktok", href: "https://tiktok.com/@crow6esports", label: "TikTok" },
  { platform: "youtube", href: "https://youtube.com/@crow6esports", label: "YouTube" },
] as const;

/** URLs de todos los perfiles oficiales, para `sameAs` en los datos estructurados. */
export const socialUrls: readonly string[] = socialLinks.map(({ href }) => href);

export const DISCORD_URL = socialLinks.find(({ platform }) => platform === "discord")!.href;

export type SiteConfig = typeof siteConfig;
