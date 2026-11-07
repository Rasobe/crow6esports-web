import { describe, expect, it } from "vitest";
import { TESTIMONIALS } from "@config/testimonials";
import en from "@/ui/i18n/locales/en.json";
import es from "@/ui/i18n/locales/es.json";
import { getTestimonials } from "./get-testimonials";

describe("getTestimonials", () => {
  it.each(["es", "en"] as const)("returns every testimonial with its %s quote", (locale) => {
    const views = getTestimonials(TESTIMONIALS, locale);

    expect(views).toHaveLength(TESTIMONIALS.length);
    views.forEach((view, index) => {
      expect(view.quote).toBe(TESTIMONIALS[index]?.quote[locale]);
      expect(view.quote.trim()).not.toBe("");
    });
  });

  it("translates the quote without exposing the other language", () => {
    const [first] = getTestimonials(TESTIMONIALS, "en");

    expect(first).not.toHaveProperty("es");
    expect(first?.quote).toContain("Working with Rasobe");
  });
});

describe("getTestimonials without affiliation", () => {
  it("keeps the affiliation undefined when the testimonial has none", () => {
    const [view] = getTestimonials(
      [{ id: "x", author: "X", quote: { es: "uno", en: "one" } }],
      "es",
    );

    expect(view?.affiliation).toBeUndefined();
  });
});

describe("TESTIMONIALS config", () => {
  it("has unique ids and a quote in Spanish and English", () => {
    const ids = TESTIMONIALS.map(({ id }) => id);

    expect(new Set(ids).size).toBe(ids.length);
    for (const { author, affiliation, quote } of TESTIMONIALS) {
      expect(author).not.toBe("");
      if (affiliation !== undefined) expect(affiliation).not.toBe("");
      expect(quote.es.trim()).not.toBe("");
      expect(quote.en.trim()).not.toBe("");
    }
  });

  it.each([
    ["es", es],
    ["en", en],
  ] as const)("has a %s label for every highlight with its placeholders", (_, messages) => {
    const labels = messages.testimonials.highlight as Record<string, string>;

    for (const { highlight } of TESTIMONIALS) {
      if (!highlight) continue;
      const label = labels[highlight.key];
      expect(label).toBeTruthy();
      for (const param of Object.keys(highlight.params)) {
        expect(label).toContain(`{${param}}`);
      }
    }
  });
});
