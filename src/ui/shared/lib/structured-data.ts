import type { CoachingPlan } from "@/domain/coaching/coaching-plan";

/** Datos estructurados de schema.org que los buscadores leen del JSON-LD de la página. */
export type StructuredData = Record<string, unknown>;

interface Club {
  name: string;
  url: string;
  logo: string;
  sport: string;
  email: string;
  foundingYear: number;
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
    sameAs: [...club.sameAs],
  };
}

interface CoachingService {
  name: string;
  description: string;
  url: string;
  provider: { name: string; url: string };
  currency: string;
  plans: readonly CoachingPlan[];
}

/** El servicio de coaching con el rango de precios de sus packs mensuales. */
export function coachingServiceData(service: CoachingService): StructuredData {
  const prices = service.plans.map((plan) => plan.price);
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
