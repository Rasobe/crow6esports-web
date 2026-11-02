import { fadeUp } from "./animate";
import { HERO, HERO_SELECTOR, REVEALED_CLASS } from "./config";

/** Sequential entrance: elements animate in DOM order, one step after the other. */
export function playHeroEntrance(): void {
  document.querySelectorAll<HTMLElement>(HERO_SELECTOR).forEach((element, index) => {
    if (element.classList.contains(REVEALED_CLASS)) return;
    fadeUp(element, { distance: HERO.distance, duration: HERO.duration, delay: index * HERO.step });
  });
}
