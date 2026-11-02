import { COUNTER_DURATION, COUNTER_SELECTOR } from "./config";

const easeOutCubic = (progress: number) => 1 - (1 - progress) ** 3;

function countUp(element: HTMLElement, target: number, locale: string): void {
  const start = performance.now();

  const step = (now: number) => {
    const progress = Math.min(1, (now - start) / COUNTER_DURATION);
    element.textContent = Math.round(target * easeOutCubic(progress)).toLocaleString(locale);
    if (progress < 1 && element.isConnected) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

export function initCounters(): () => void {
  const locale = document.documentElement.lang || undefined;

  const observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach(({ target }) => {
          observer.unobserve(target);
          const element = target as HTMLElement;
          const value = Number(element.dataset.countTo);
          if (Number.isFinite(value)) countUp(element, value, locale ?? "es");
        });
    },
    { threshold: 0.6 },
  );

  document.querySelectorAll<HTMLElement>(COUNTER_SELECTOR).forEach((element) => {
    element.textContent = "0";
    observer.observe(element);
  });

  return () => observer.disconnect();
}
