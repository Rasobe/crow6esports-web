export const PLAYSTYLES = ["calm", "intermediate", "mechanical", "aggressive"] as const;
export type Playstyle = (typeof PLAYSTYLES)[number];

export const COMPETITIVE_EXPERIENCES = ["yes", "no"] as const;
export type CompetitiveExperience = (typeof COMPETITIVE_EXPERIENCES)[number];

export const LOSS_REACTIONS = ["encourage", "down", "calm"] as const;
export type LossReaction = (typeof LOSS_REACTIONS)[number];

export const COACHING_OPENNESS = ["yes", "no", "maybe"] as const;
export type CoachingOpenness = (typeof COACHING_OPENNESS)[number];

export type TryoutApplication = {
  discord: string;
  birthDate: string;
  country: string;
  availabilityWeekdays: string;
  availabilityWeekends: string;
  availabilityScrims: string;
  rltracker: string;
  rank: string;
  peak: string;
  hoursPlayed: number;
  playstyle: Playstyle;
  highlights?: string;
  hasCompetitiveExp: CompetitiveExperience;
  previousTeams?: string;
  reactionToMistakes: string;
  reactionToLosses: LossReaction;
  lookingFor: string;
  openToCoaching: CoachingOpenness;
};
