import type { Testimonial } from "@/domain/testimonials/testimonial";

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: "jerry",
    author: "Jerry",
    affiliation: "Prodigy Five",
    quote: {
      es: "La experiencia con Rasobe ha sido fantástica. Me ha venido muy bien para progresar en el competitivo de Rocket League con sus sesiones de análisis y consejos. Gracias a eso he cumplido uno de mis sueños: llegar a 2000 MMR en 2s y a 1700 MMR en 3s. Es muy buen coach y, además, una persona espectacular.",
      en: "Working with Rasobe has been fantastic. His analysis sessions and advice helped me a lot to progress in competitive Rocket League. Thanks to that, I achieved one of my dreams: reaching 2000 MMR in 2s and 1700 MMR in 3s. He's a great coach and an outstanding person too.",
    },
    highlight: { key: "reached_ranks", params: { mmr2s: 2000, mmr3s: 1700 } },
  },
  {
    id: "tesus",
    author: "Tesus",
    affiliation: "Prodigy Five",
    quote: {
      es: "Siempre agradecido con Rasobe. Tuve la suerte de trabajar con él en Prodigy Five y, gracias a su trabajo y su conocimiento, ayudó a todo el equipo a mejorar bastante. Me dio varios consejos personales que me ayudaron a subir mucho de rango: en 3 meses pasé de 1500 a 1791 MMR.",
      en: "Always grateful to Rasobe. I was lucky to work with him at Prodigy Five, and thanks to his work and knowledge he helped the whole team improve a lot. He gave me several personal tips that helped me climb a lot: in 3 months I went from 1500 to 1791 MMR.",
    },
    highlight: { key: "climb", params: { from: 1500, to: 1791, months: 3 } },
  },
];
