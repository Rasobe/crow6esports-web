export function yearsSince(startYear: number, now: Date = new Date()): number {
  return Math.max(0, now.getFullYear() - startYear);
}
