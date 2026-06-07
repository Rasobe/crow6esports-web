export const siteConfig = {
  name: "Crow 6 eSports",
  url: "https://crow6esports.com",
  description: "Equipo competitivo de Rocket League",
  socials: {
    twitter: "https://twitter.com/crow6esports",
    instagram: "https://instagram.com/crow6esports",
    twitch: "https://twitch.tv/crow6esports",
    discord: "https://discord.gg/crow6esports",
    youtube: "https://youtube.com/@crow6esports",
  },
} as const;

export type SiteConfig = typeof siteConfig;
