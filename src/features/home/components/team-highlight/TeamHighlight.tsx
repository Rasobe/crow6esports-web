"use client";

import { useTranslations } from "next-intl";
import { getPlayers } from "@/features/home/lib/players";
import { PlayerCard } from "@/components/ui/player-card";
import "./team-highlight.scss";

const players = getPlayers();

export function TeamHighlight() {
  const t = useTranslations("home.teamHighlight");

  return (
    <section className="team-highlight">
      <div className="team-highlight__inner">
        <header className="team-highlight__header">
          <span className="section-label">{t("eyebrow")}</span>
          <h2 className="team-highlight__title">{t("title")}</h2>
          <p className="team-highlight__subtitle">{t("subtitle")}</p>
        </header>

        <div className="team-highlight__grid">
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </div>
    </section>
  );
}
