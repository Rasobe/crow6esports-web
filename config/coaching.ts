export interface CoachingPrice {
  id: "individual" | "teams";
  from: number;
  original: number;
}

export interface CoachingConfig {
  coach: { name: string; photo: string | null; hoursPlayed: number };
  progress: { start: number; current: number };
  pricing: readonly CoachingPrice[];
}

export const COACHING: CoachingConfig = {
  coach: { name: "Rasobe", photo: null, hoursPlayed: 6000 },
  progress: { start: 1550, current: 2000 },
  pricing: [
    { id: "individual", from: 28, original: 55 },
    { id: "teams", from: 50, original: 68 },
  ],
};
