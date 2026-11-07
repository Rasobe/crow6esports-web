export type TestimonialLocale = "es" | "en";
export type LocalizedText = Record<TestimonialLocale, string>;

/** Clave del texto en `testimonials.highlight` y los números que rellenan sus huecos. */
export interface TestimonialHighlight {
  key: "reached_ranks" | "climb" | "climb_no_period";
  params: Readonly<Record<string, number>>;
}

export interface Testimonial {
  id: string;
  author: string;
  affiliation?: string;
  quote: LocalizedText;
  highlight?: TestimonialHighlight;
}
