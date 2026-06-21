import { describe, expect, it } from "vitest";
import { getAge, getActiveSocialLinks } from "./player-card.utils";
import type { PlayerSocials } from "@/types/Player";

describe("getAge", () => {
  it("returns null when birthYear is null", () => {
    expect(getAge(null)).toBeNull();
  });

  it("returns the difference between the current year and birthYear", () => {
    const currentYear = new Date().getFullYear();
    expect(getAge(currentYear - 25)).toBe(25);
  });
});

describe("getActiveSocialLinks", () => {
  const baseSocials: PlayerSocials = {
    twitter: null,
    instagram: null,
    twitch: null,
    tiktok: null,
    youtube: null,
    rltracker: null,
  };

  it("returns an empty array when no socials are set", () => {
    expect(getActiveSocialLinks(baseSocials)).toEqual([]);
  });

  it("returns only the socials that have a value, in a fixed order", () => {
    const socials: PlayerSocials = {
      ...baseSocials,
      youtube: "https://youtube.com/@blazeon",
      twitter: "https://x.com/blazeon_rl",
      rltracker: "https://rocketleague.tracker.network/profile/blazeon",
    };

    expect(getActiveSocialLinks(socials)).toEqual([
      { platform: "twitter", href: "https://x.com/blazeon_rl", label: "Twitter / X" },
      { platform: "youtube", href: "https://youtube.com/@blazeon", label: "YouTube" },
      { platform: "rltracker", href: "https://rocketleague.tracker.network/profile/blazeon", label: "RLTracker" },
    ]);
  });
});
