"use client";

import { getPlayers } from "@/features/home/lib/players";
import { PlayerCard } from "@/components/ui/player-card";
import { SectionHeader } from "@/components/ui/section-header";
import "./team-highlight.scss";

const players = getPlayers();

export function TeamHighlight() {
  return (
    <section className="team-highlight">
      <div className="team-highlight__inner">
        <SectionHeader namespace="home.teamHighlight" />

        <div className="team-highlight__grid">
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </div>
    </section>
  );
}
