import { describe, expect, it, vi } from "vitest";
import type { TryoutRequestRepository } from "@/domain/tryouts/tryout-request.repository";
import {
  NO_PAGE_LABEL,
  NO_UTM_LABEL,
  getAttributionSummary,
  type AttributionSummary,
} from "./attribution-summary";

const now = new Date("2026-11-07T12:00:00Z");

function summarize(samples: { sourcePage: string | null; utmSource: string | null }[]) {
  const listAttribution = vi.fn().mockResolvedValue(samples);
  const repository = { listAttribution } as unknown as TryoutRequestRepository;
  return {
    listAttribution,
    summary: getAttributionSummary(repository, now) as Promise<AttributionSummary>,
  };
}

describe("getAttributionSummary", () => {
  it("asks for the last 30 days", async () => {
    const { listAttribution, summary } = summarize([]);

    await summary;

    expect(listAttribution).toHaveBeenCalledWith(new Date("2026-10-08T12:00:00Z"));
  });

  it("counts by landing page and by utm_source, most frequent first", async () => {
    const { summary } = summarize([
      { sourcePage: "/es", utmSource: "instagram" },
      { sourcePage: "/es/tryouts", utmSource: "instagram" },
      { sourcePage: "/es", utmSource: null },
      { sourcePage: "/en", utmSource: "discord" },
      { sourcePage: "/es", utmSource: "instagram" },
    ]);

    const result = await summary;

    expect(result.total).toBe(5);
    expect(result.bySourcePage).toEqual([
      { label: "/es", count: 3 },
      { label: "/en", count: 1 },
      { label: "/es/tryouts", count: 1 },
    ]);
    expect(result.byUtmSource).toEqual([
      { label: "instagram", count: 3 },
      { label: "discord", count: 1 },
      { label: NO_UTM_LABEL, count: 1 },
    ]);
  });

  it("groups requests without data under a readable label", async () => {
    const { summary } = summarize([
      { sourcePage: null, utmSource: null },
      { sourcePage: "", utmSource: "" },
    ]);

    const result = await summary;

    expect(result.bySourcePage).toEqual([{ label: NO_PAGE_LABEL, count: 2 }]);
    expect(result.byUtmSource).toEqual([{ label: NO_UTM_LABEL, count: 2 }]);
  });

  it("keeps only the ten most frequent entries", async () => {
    const { summary } = summarize(
      Array.from({ length: 15 }, (_, i) => ({ sourcePage: `/page-${i}`, utmSource: null })),
    );

    expect((await summary).bySourcePage).toHaveLength(10);
  });
});
