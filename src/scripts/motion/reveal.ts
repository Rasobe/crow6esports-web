import { fadeUp } from "./animate";
import { REVEAL, REVEAL_SELECTOR, REVEALED_CLASS } from "./config";

export function initReveals(): () => void {
  const targets = document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR);

  const observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach(({ target }, index) => {
          observer.unobserve(target);
          fadeUp(target as HTMLElement, { ...REVEAL, delay: index * REVEAL.stagger });
        });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
  );

  targets.forEach((target) => {
    if (!target.classList.contains(REVEALED_CLASS)) observer.observe(target);
  });

  return () => observer.disconnect();
}
