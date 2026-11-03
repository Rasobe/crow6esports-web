export type AchievementResult =
  | { kind: "winner" }
  | { kind: "placement"; place: number }
  | { kind: "ranking"; place: number; scope: "europe" };

export interface ClubDate {
  year: number;
  month?: number;
  day?: number;
}

export interface AchievementLink {
  /** Qué enseña el enlace: define el texto y el icono. */
  kind: "video" | "liquipedia";
  href: string;
}

export interface Achievement {
  id: string;
  /** Nombre propio de la competición; si falta, se usa la clave i18n `about.achievements.events.<id>`. */
  event?: string;
  date: ClubDate;
  onsite: boolean;
  result: AchievementResult;
  lineup: readonly string[];
  substitutes?: readonly string[];
  link?: AchievementLink;
}

export const ACHIEVEMENTS: readonly Achievement[] = [
  {
    id: "sfl-master-series",
    event: "SFL Master Series",
    date: { year: 2022, month: 7, day: 16 },
    onsite: true,
    result: { kind: "winner" },
    lineup: ["Stizzy", "VKSailent", "Marvalz"],
    link: { kind: "video", href: "https://www.youtube.com/watch?v=zaoPw_G9aSc" },
  },
  {
    id: "gamergy-amazon",
    event: "Gamergy Amazon",
    date: { year: 2022 },
    onsite: false,
    result: { kind: "placement", place: 5 },
    lineup: ["TehQoz", "IvanRL", "alemnz"],
    link: {
      kind: "liquipedia",
      href: "https://liquipedia.net/rocketleague/Gamergy/Amazon_GAMERGY/2022/Liga_Road_to_Gamergy",
    },
  },
  {
    id: "european-ranking",
    date: { year: 2025 },
    onsite: false,
    result: { kind: "ranking", place: 172, scope: "europe" },
    lineup: ["Blazeon", "Bubet", "Desheyy"],
    substitutes: ["Ethan_Letal"],
  },
];
