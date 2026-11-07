import type { TryoutRequestRepository } from "@/domain/tryouts/tryout-request.repository";

export const SUMMARY_DAYS = 30;
const TOP_ENTRIES = 10;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const NO_PAGE_LABEL = "Sin dato";
export const NO_UTM_LABEL = "Sin utm";

export interface CountEntry {
  label: string;
  count: number;
}

export interface AttributionSummary {
  days: number;
  total: number;
  bySourcePage: CountEntry[];
  byUtmSource: CountEntry[];
}

function countBy(values: (string | null)[], emptyLabel: string): CountEntry[] {
  const counts = new Map<string, number>();
  for (const value of values) {
    const label = value || emptyLabel;
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return [...counts]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, TOP_ENTRIES);
}

/** Requests of the last 30 days grouped by landing page and by utm_source. */
export async function getAttributionSummary(
  repository: TryoutRequestRepository,
  now: Date = new Date(),
): Promise<AttributionSummary> {
  const samples = await repository.listAttribution(
    new Date(now.getTime() - SUMMARY_DAYS * MS_PER_DAY),
  );

  return {
    days: SUMMARY_DAYS,
    total: samples.length,
    bySourcePage: countBy(
      samples.map((sample) => sample.sourcePage),
      NO_PAGE_LABEL,
    ),
    byUtmSource: countBy(
      samples.map((sample) => sample.utmSource),
      NO_UTM_LABEL,
    ),
  };
}
