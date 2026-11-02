export type AchievementResult =
  | { kind: "winner" }
  | { kind: "placement"; place: number }
  | { kind: "ranking"; place: number; scope: "europe" };

export interface ClubDate {
  year: number;
  month?: number;
  day?: number;
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
}

export const ACHIEVEMENTS: readonly Achievement[] = [
  {
    id: "sfl-master-series",
    event: "SFL Master Series",
    date: { year: 2022, month: 7, day: 16 },
    onsite: true,
    result: { kind: "winner" },
    lineup: ["Stizzy", "VKSailent", "Marvalz"],
  },
  {
    id: "gamergy-amazon",
    event: "Gamergy Amazon",
    date: { year: 2022 },
    onsite: false,
    result: { kind: "placement", place: 5 },
    lineup: ["TehQoz", "IvanRL", "alemnz"],
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
