/** Datos estructurados de schema.org que los buscadores leen del JSON-LD de la página. */
export type StructuredData = Record<string, unknown>;

interface Club {
  name: string;
  url: string;
  logo: string;
  sport: string;
  email: string;
  foundingYear: number;
  description: string;
  alternateName: readonly string[];
  location: { city: string; country: string };
  sameAs: readonly string[];
}

export function sportsTeamData(club: Club): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: club.name,
    url: club.url,
    logo: club.logo,
    sport: club.sport,
    email: club.email,
    foundingDate: String(club.foundingYear),
    description: club.description,
    alternateName: [...club.alternateName],
    location: {
      "@type": "PostalAddress",
      addressLocality: club.location.city,
      addressCountry: club.location.country,
    },
    sameAs: [...club.sameAs],
  };
}

interface Website {
  name: string;
  url: string;
  alternateName: readonly string[];
  sameAs?: readonly string[];
}

export function websiteData(site: Website): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    alternateName: [...site.alternateName],
    url: site.url,
    ...(site.sameAs?.length ? { sameAs: [...site.sameAs] } : {}),
  };
}

interface CoachingService {
  name: string;
  description: string;
  url: string;
  provider: { name: string; url: string };
  currency: string;
  prices: readonly number[];
}

/** El servicio de coaching con el rango de precios de sus packs mensuales. */
export function coachingServiceData(service: CoachingService): StructuredData {
  const { prices } = service;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Coaching",
    name: service.name,
    description: service.description,
    url: service.url,
    provider: { "@type": "SportsTeam", ...service.provider },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: service.currency,
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: prices.length,
    },
  };
}

interface Publisher {
  name: string;
  url: string;
  logo: string;
}

interface ArticleInput {
  headline: string;
  description: string;
  url: string;
  /** URL absoluta de la portada. */
  image: string;
  datePublished: Date;
  dateModified: Date;
  inLanguage: string;
  /** El club firma sus noticias: autor y editor son la misma organización. */
  publisher: Publisher;
}

/** Schema.org Article de una noticia, con las fechas en ISO 8601 completas. */
export function articleData(article: ArticleInput): StructuredData {
  const organization = {
    "@type": "Organization",
    name: article.publisher.name,
    url: article.publisher.url,
  };

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    image: [article.image],
    datePublished: article.datePublished.toISOString(),
    dateModified: article.dateModified.toISOString(),
    inLanguage: article.inLanguage,
    mainEntityOfPage: { "@type": "WebPage", "@id": article.url },
    author: organization,
    publisher: {
      ...organization,
      logo: { "@type": "ImageObject", url: article.publisher.logo },
    },
  };
}
