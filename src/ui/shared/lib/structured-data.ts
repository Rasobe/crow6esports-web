export type StructuredData = Record<string, unknown>;

interface Club {
  name: string;
  url: string;
  /** URL absoluta del logotipo. */
  logo: string;
  sport: string;
  email: string;
  foundingYear: number;
  description: string;
  alternateName: readonly string[];
  location: { city: string; country: string };
  sameAs: readonly string[];
}

/** Identificadores estables de los nodos, para enlazarlos entre sí sin repetir datos. */
export const clubNodeIds = (url: string) => ({
  organization: `${url}/#organization`,
  team: `${url}/#team`,
  website: `${url}/#website`,
});

/**
 * El club en un solo grafo: la organización lleva todos los datos (logo, dirección, perfiles),
 * el equipo de Rocket League forma parte de ella y la web la tiene como editora.
 */
export function clubGraphData(club: Club): StructuredData {
  const ids = clubNodeIds(club.url);
  const organizationRef = { "@id": ids.organization };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ids.organization,
        name: club.name,
        alternateName: [...club.alternateName],
        url: club.url,
        logo: { "@type": "ImageObject", url: club.logo },
        description: club.description,
        foundingDate: String(club.foundingYear),
        email: club.email,
        address: {
          "@type": "PostalAddress",
          addressLocality: club.location.city,
          addressCountry: club.location.country,
        },
        sameAs: [...club.sameAs],
      },
      {
        "@type": "SportsTeam",
        "@id": ids.team,
        name: club.name,
        url: club.url,
        sport: club.sport,
        parentOrganization: organizationRef,
      },
      {
        "@type": "WebSite",
        "@id": ids.website,
        name: club.name,
        alternateName: [...club.alternateName],
        url: club.url,
        publisher: organizationRef,
      },
    ],
  };
}

interface NewsCollection {
  name: string;
  description: string;
  /** URL absoluta del listado. */
  url: string;
  inLanguage: string;
  siteUrl: string;
  /** Artículos en el orden del listado (el más reciente primero). */
  articles: readonly { name: string; url: string }[];
}

/** El listado de noticias como colección, con sus artículos en orden. */
export function newsCollectionData(collection: NewsCollection): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": collection.url,
    url: collection.url,
    name: collection.name,
    description: collection.description,
    inLanguage: collection.inLanguage,
    isPartOf: {
      "@type": "WebSite",
      "@id": clubNodeIds(collection.siteUrl).website,
      url: collection.siteUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: collection.articles.length,
      itemListElement: collection.articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: article.url,
        name: article.name,
      })),
    },
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

interface Breadcrumb {
  name: string;
  /** URL absoluta de la página. */
  url: string;
}

/** La ruta de una página desde la portada, de la más general a la propia página. */
export function breadcrumbData(crumbs: readonly Breadcrumb[]): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}
