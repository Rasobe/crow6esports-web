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
}

export function websiteData(site: Website): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    alternateName: [...site.alternateName],
    url: site.url,
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
