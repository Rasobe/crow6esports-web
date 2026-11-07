import type {
  Testimonial,
  TestimonialHighlight,
  TestimonialLocale,
} from "@/domain/testimonials/testimonial";

export interface TestimonialView {
  id: string;
  author: string;
  affiliation?: string;
  quote: string;
  highlight?: TestimonialHighlight;
}

export function getTestimonials(
  testimonials: readonly Testimonial[],
  locale: TestimonialLocale,
): TestimonialView[] {
  return testimonials.map(({ quote, ...rest }) => ({ ...rest, quote: quote[locale] }));
}
