export type AchievementResult = { kind: "winner" } | { kind: "placement"; place: number };

export interface ClubDate {
  year: number;
  month?: number;
  day?: number;
}

export interface Achievement {
  id: string;
  event: string;
  date: ClubDate;
  onsite: boolean;
  result: AchievementResult;
  lineup: readonly string[];
}

export type HistoricalRole = "manager_coach" | "captain" | "player";

export interface HistoricalMember {
  handle: string;
  role: HistoricalRole;
}

// TODO: validar — fecha exacta de Gamergy Amazon 2022 (solo se conoce el año) y alineaciones
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
];

export const ROSTER_2022_YEAR = 2022;

export const ROSTER_2022: readonly HistoricalMember[] = [
  { handle: "xTerazzz_", role: "manager_coach" },
  { handle: "StizzyRl", role: "captain" },
  { handle: "BoomRL", role: "player" },
  { handle: "TehQoz_RL", role: "player" },
  { handle: "Marvalz_", role: "player" },
  { handle: "AnyeeloRL", role: "player" },
  { handle: "zgarsen", role: "player" },
];
