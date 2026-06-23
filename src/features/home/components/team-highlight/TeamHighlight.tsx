"use client";

import { getPlayers } from "@/features/home/lib/players";
import { PlayerCard } from "@/components/ui/player-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui";
import { ROUTES } from "@config/routes";
import { useTranslations } from "next-intl";
import "./team-highlight.scss";

const players = getPlayers();

export function TeamHighlight() {
  const t = useTranslations("home.teamHighlight");

  return (
    <section className="team-highlight">
      <div className="team-highlight__inner">
        <SectionHeader namespace="home.teamHighlight" />

        <div className="team-highlight__grid">
          {players.slice(0, 4).map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>

        <div className="team-highlight__footer">
          <Button href={ROUTES.team} variant="outline">
            {t("cta_view_more")}
          </Button>
        </div>
      </div>
    </section>
  );
}
