/** `power3.out` expressed as a cubic bezier. */
export const EASE_OUT = "cubic-bezier(0.215, 0.61, 0.355, 1)";

export const REVEAL = { distance: 24, duration: 700, stagger: 80 } as const;
export const HERO = { distance: 28, duration: 800, step: 110 } as const;
export const COUNTER_DURATION = 1400;

export const MOTION_ATTRIBUTE = "data-motion";
export const REVEALED_CLASS = "is-revealed";
export const REVEAL_SELECTOR = "[data-reveal]";
export const HERO_SELECTOR = "[data-hero]";
export const COUNTER_SELECTOR = "[data-count-to]";
