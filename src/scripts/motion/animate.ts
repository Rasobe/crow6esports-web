import { EASE_OUT, REVEALED_CLASS } from "./config";

interface FadeUpOptions {
  distance: number;
  duration: number;
  delay?: number;
}

export function fadeUp(element: HTMLElement, { distance, duration, delay = 0 }: FadeUpOptions) {
  const animation = element.animate(
    [
      { opacity: 0, transform: `translateY(${distance}px)` },
      { opacity: 1, transform: "translateY(0)" },
    ],
    { duration, delay, easing: EASE_OUT, fill: "backwards" },
  );

  const markRevealed = () => element.classList.add(REVEALED_CLASS);
  animation.addEventListener("finish", markRevealed, { once: true });
  animation.addEventListener("cancel", markRevealed, { once: true });
  return animation;
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
