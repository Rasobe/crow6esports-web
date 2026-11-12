import { describe, expect, it } from "vitest";
import {
  articleData,
  breadcrumbData,
  clubGraphData,
  coachingServiceData,
  newsCollectionData,
} from "./structured-data";

const CLUB = {
  name: "Crow 6 eSports",
  url: "https://crow6esports.com",
  logo: "https://crow6esports.com/icon-512.png",
  sport: "Rocket League",
  email: "club@example.com",
  foundingYear: 2020,
  description: "Competitive Rocket League organization.",
  alternateName: ["Crow6", "Crow 6", "C6 eSports"],
  location: { city: "Huesca", country: "ES" },
  sameAs: ["https://x.com/crow6esports", "https://www.instagram.com/crow6esports"],
};

type Node = Record<string, unknown>;
const nodeOf = (data: Node, type: string) =>
  (data["@graph"] as Node[]).find((node) => node["@type"] === type)!;

describe("clubGraphData", () => {
  const data = clubGraphData(CLUB);
  const organization = nodeOf(data, "Organization");

  it("gives the organization every field the audit asks for", () => {
    expect(organization).toMatchObject({
      "@id": "https://crow6esports.com/#organization",
      name: "Crow 6 eSports",
      url: "https://crow6esports.com",
      logo: { "@type": "ImageObject", url: "https://crow6esports.com/icon-512.png" },
      description: "Competitive Rocket League organization.",
      foundingDate: "2020",
      address: { "@type": "PostalAddress", addressLocality: "Huesca", addressCountry: "ES" },
      sameAs: CLUB.sameAs,
    });
    expect((organization.logo as Node).url).toMatch(/^https:\/\//);
  });

  it("links the team and the website to the organization instead of repeating it", () => {
    const team = nodeOf(data, "SportsTeam");
    const website = nodeOf(data, "WebSite");

    expect(team).toMatchObject({
      sport: "Rocket League",
      parentOrganization: { "@id": organization["@id"] },
    });
    expect(team).not.toHaveProperty("address");
    expect(team).not.toHaveProperty("sameAs");
    expect(website).toMatchObject({ url: CLUB.url, publisher: { "@id": organization["@id"] } });
  });

  it("publishes no reviews or ratings and serialises to valid JSON", () => {
    const json = JSON.stringify(data);
    expect(json).not.toMatch(/Review|AggregateRating/);
    expect(JSON.parse(json)).toEqual(data);
  });
});

describe("newsCollectionData", () => {
  const data = newsCollectionData({
    name: "Noticias",
    description: "Las últimas noticias.",
    url: "https://crow6esports.com/es/news",
    inLanguage: "es",
    siteUrl: "https://crow6esports.com",
    articles: [
      { name: "Newest", url: "https://crow6esports.com/es/news/newest" },
      { name: "Older", url: "https://crow6esports.com/es/news/older" },
    ],
  });

  it("describes the list page as a collection of the site", () => {
    expect(data).toMatchObject({
      "@type": "CollectionPage",
      url: "https://crow6esports.com/es/news",
      name: "Noticias",
      inLanguage: "es",
      isPartOf: { "@type": "WebSite", "@id": "https://crow6esports.com/#website" },
    });
  });

  it("lists the articles in order with url, name and position", () => {
    expect(data.mainEntity).toEqual({
      "@type": "ItemList",
      numberOfItems: 2,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          url: "https://crow6esports.com/es/news/newest",
          name: "Newest",
        },
        {
          "@type": "ListItem",
          position: 2,
          url: "https://crow6esports.com/es/news/older",
          name: "Older",
        },
      ],
    });
  });
});

describe("coachingServiceData", () => {
  it("summarises the packs as a price range", () => {
    const data = coachingServiceData({
      name: "Coaching",
      description: "Rocket League coaching",
      url: "https://crow6esports.com/es/coaching",
      provider: { name: "Crow 6 eSports", url: "https://crow6esports.com" },
      currency: "EUR",
      prices: [40, 219],
    });

    expect(data.offers).toEqual({
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: 40,
      highPrice: 219,
      offerCount: 2,
    });
  });
});

describe("articleData", () => {
  const data = articleData({
    headline: "Nueva temporada",
    description: "Resumen de la noticia.",
    url: "https://crow6esports.com/es/news/nueva-temporada",
    image: "https://crow6esports.com/images/news/portada.webp",
    datePublished: new Date("2026-11-07T00:00:00Z"),
    dateModified: new Date("2026-11-09T00:00:00Z"),
    inLanguage: "es",
    publisher: {
      name: "Crow 6 eSports",
      url: "https://crow6esports.com",
      logo: "https://crow6esports.com/icon-512.png",
    },
  });

  it("is a schema.org Article with every field search engines ask for", () => {
    expect(data).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Nueva temporada",
      description: "Resumen de la noticia.",
      image: ["https://crow6esports.com/images/news/portada.webp"],
      datePublished: "2026-11-07T00:00:00.000Z",
      dateModified: "2026-11-09T00:00:00.000Z",
      inLanguage: "es",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "https://crow6esports.com/es/news/nueva-temporada",
      },
      author: { "@type": "Organization", name: "Crow 6 eSports" },
      publisher: {
        "@type": "Organization",
        name: "Crow 6 eSports",
        logo: { "@type": "ImageObject", url: "https://crow6esports.com/icon-512.png" },
      },
    });
  });

  it("serializes to valid JSON without losing the dates", () => {
    const parsed = JSON.parse(JSON.stringify(data));

    expect(parsed.datePublished).toBe("2026-11-07T00:00:00.000Z");
    expect(parsed.dateModified).toBe("2026-11-09T00:00:00.000Z");
  });
});

describe("breadcrumbData", () => {
  it("lists the path from the home to the page with position, name and absolute url", () => {
    const data = breadcrumbData([
      { name: "Crow 6 eSports", url: "https://crow6esports.com/es" },
      { name: "Noticias", url: "https://crow6esports.com/es/news" },
      { name: "Artículo", url: "https://crow6esports.com/es/news/articulo" },
    ]);

    expect(data).toEqual({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Crow 6 eSports",
          item: "https://crow6esports.com/es",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Noticias",
          item: "https://crow6esports.com/es/news",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Artículo",
          item: "https://crow6esports.com/es/news/articulo",
        },
      ],
    });
  });
});
