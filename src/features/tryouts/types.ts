export const PLAYSTYLE_VALUES = ["calm", "intermediate", "mechanical", "aggressive"] as const;
export type Playstyle = typeof PLAYSTYLE_VALUES[number];

export const COMPETITIVE_EXP_VALUES = ["yes", "no"] as const;
export type CompetitiveExp = typeof COMPETITIVE_EXP_VALUES[number];

export const REACTION_TO_LOSSES_VALUES = ["encourage", "down", "calm"] as const;
export type ReactionToLosses = typeof REACTION_TO_LOSSES_VALUES[number];

export const OPEN_TO_COACHING_VALUES = ["yes", "no", "maybe"] as const;
export type OpenToCoaching = typeof OPEN_TO_COACHING_VALUES[number];
