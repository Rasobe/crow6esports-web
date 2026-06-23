import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlayerCard } from "./PlayerCard";
import type { Player } from "@/types/Player";

vi.mock("next/image", () => ({
  default: (props: { alt: string; src: string }) => <img alt={props.alt} src={props.src} />,
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "es",
}));

const basePlayer: Player = {
  id: "blazeon",
  nickname: "Blazeon",
  realName: "Raúl",
  birthYear: 2000,
  anonymous: false,
  country: "ES",
  type: "player",
  status: "active",
  game: "rocket-league",
  joinedYear: 2023,
  stats: { mmr: 1847, peak: 1900, rank: "Grand Champion IF" },
  socials: {
    twitter: "https://x.com/blazeon_rl",
    instagram: null,
    twitch: null,
    tiktok: null,
    youtube: null,
    rltracker: "https://rocketleague.tracker.network/profile/blazeon",
  },
  image: null,
};

describe("PlayerCard", () => {
  it("renders the player's rank badge", () => {
    render(<PlayerCard player={basePlayer} />);
    expect(screen.getByText("Grand Champion IF")).toBeInTheDocument();
  });

  it("renders an RLTracker link when socials.rltracker is set", () => {
    render(<PlayerCard player={basePlayer} />);
    const link = screen.getByLabelText("RLTracker");
    expect(link).toHaveAttribute("href", basePlayer.socials.rltracker);
  });

  it("does not render an RLTracker link when socials.rltracker is null", () => {
    render(
      <PlayerCard
        player={{ ...basePlayer, socials: { ...basePlayer.socials, rltracker: null } }}
      />,
    );
    expect(screen.queryByLabelText("RLTracker")).not.toBeInTheDocument();
  });

  it("formats MMR using the active locale", () => {
    render(<PlayerCard player={{ ...basePlayer, stats: { ...basePlayer.stats, mmr: 12345 } }} />);
    expect(screen.getByText("12.345")).toBeInTheDocument();
  });
});
