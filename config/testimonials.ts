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
  {
    id: "gato",
    author: "Gato",
    affiliation: "Crow 6 eSports",
    quote: {
      es: "Es un coach que se preocupa de verdad de que lo entiendas y, si hace falta, lo repite hasta que consigues pulirlo. Las ganas con las que coachea y la energía que transmite son muy positivas y motivadoras. A mí me ayudó a pasar de 1717 a 1922. Estoy muy contento con Rasobe.",
      en: "He's a coach who genuinely cares whether you understand and will repeat things until you manage to polish them. The enthusiasm he coaches with and the energy he brings are very positive and motivating. He helped me go from 1717 to 1922. I'm very happy with Rasobe.",
    },
    highlight: { key: "climb_no_period", params: { from: 1717, to: 1922 } },
  },
  {
    id: "blackito",
    author: "Blackito",
    affiliation: "Crow 6 eSports",
    quote: {
      es: "La primera vez que entré al competitivo de Rocket League era un GC1 pelado (~1490). Hace unos meses llegué a GC3 (1763) sin problemas, con solo 3 días de grinding. Tener un coach a estos niveles, o cerca de ellos, es muy importante. Rasobe me ha estado enseñando desde los inicios de mi carrera competitiva: me ha hecho darme cuenta de cosas que nunca había hecho, he podido perfeccionarlas y, sobre todo, a tener química con el equipo. A día de hoy no tengo ningún problema con lo que nos pide este coach, porque se nota que tiene experiencia (y le sobra).",
      en: "The first time I entered competitive Rocket League, I was barely a GC1 (~1490). A few months ago I reached GC3 (1763) with no problems, in just 3 days of grinding. Having a coach at these levels, or close to them, is very important. Rasobe has been teaching me since the start of my competitive career: he made me notice things I had never done, I was able to perfect them and, above all, to build chemistry with the team. Today I have no problem with what this coach asks of us, because you can tell he has experience (and then some).",
    },
    highlight: { key: "climb_no_period", params: { from: 1490, to: 1763 } },
  },
  {
    id: "diaxz",
    author: "Diaxz",
    affiliation: "Crow 6 eSports",
    quote: {
      es: "Muy buen coach. Llevo casi 2 años con él y he aprendido y mejorado muchísimo gracias a él.",
      en: "Very good coach. I've been with him for almost 2 years and I've learned and improved a huge amount thanks to him.",
    },
  },
];
