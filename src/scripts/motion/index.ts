import { prefersReducedMotion } from "./animate";
import { MOTION_ATTRIBUTE } from "./config";
import { initCounters } from "./counters";
import { playHeroEntrance } from "./hero";
import { initReveals } from "./reveal";

let teardown: Array<() => void> = [];

function start(): void {
  if (prefersReducedMotion()) return;

  document.documentElement.setAttribute(MOTION_ATTRIBUTE, "ready");
  playHeroEntrance();
  teardown = [initReveals(), initCounters()];
}

function stop(): void {
  teardown.forEach((dispose) => dispose());
  teardown = [];
}

export function initMotion(): void {
  document.addEventListener("astro:page-load", start);
  document.addEventListener("astro:before-swap", (event) => {
    stop();
    if (!prefersReducedMotion()) {
      event.newDocument.documentElement.setAttribute(MOTION_ATTRIBUTE, "pending");
    }
  });
}
