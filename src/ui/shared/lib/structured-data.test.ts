import { describe, expect, it } from "vitest";
import { coachingServiceData, sportsTeamData } from "./structured-data";

describe("sportsTeamData", () => {
  it("describes the club as a sports team with its profiles", () => {
    const data = sportsTeamData({
      name: "Crow 6 eSports",
      url: "https://crow6esports.com",
      logo: "https://crow6esports.com/icon-512.png",
      sport: "Rocket League",
      email: "club@example.com",
      foundingYear: 2020,
      sameAs: ["https://x.com/crow6esports"],
    });

    expect(data).toMatchObject({
      "@type": "SportsTeam",
      sport: "Rocket League",
      foundingDate: "2020",
      sameAs: ["https://x.com/crow6esports"],
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
