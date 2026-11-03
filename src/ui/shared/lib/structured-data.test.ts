import { describe, expect, it } from "vitest";
import { coachingServiceData, sportsTeamData } from "./structured-data";

describe("sportsTeamData", () => {
  it("describes the club as a sports team with its profiles", () => {
    const data = sportsTeamData({
      name: "Crow 6 Esports",
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
      provider: { name: "Crow 6 Esports", url: "https://crow6esports.com" },
      currency: "EUR",
      plans: [
        { tier: "basic", price: 39, originalPrice: 55, weeklySessions: 1 },
        { tier: "elite", price: 219, originalPrice: 309, weeklySessions: 3 },
      ],
    });

    expect(data.offers).toEqual({
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: 39,
      highPrice: 219,
      offerCount: 2,
    });
  });
});
