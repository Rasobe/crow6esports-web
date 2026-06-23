"use client"

import { Button } from "@/components/ui";
import { ROUTES } from "@config/routes";
import { useTranslations } from "next-intl";
import { StatCard } from "./_components";
import { TEAM_STATS } from "@config/stats";

export function HeroSection() {
  const t = useTranslations("home.hero");

  return (
    <section className="hero">
      <div className="hero__bg-number" aria-hidden>C6</div>
      <div className="hero__line hero__line--left" aria-hidden />
      <div className="hero__line hero__line--right" aria-hidden />

      <div className="hero__content">
        <p className="hero__eyebrow">
          <span aria-hidden />
          {t("eyebrow")}
          <span aria-hidden />
        </p>

        <h1 className="hero__title">
          CROW<span>6</span>
        </h1>

        <div className="hero__divider" aria-hidden />

        <p className="hero__tagline">{t("tagline")}</p>

        <div className="hero__ctas">
          <Button href={ROUTES.team} variant="primary">
            {t('cta_team')}
          </Button>
          <Button href={ROUTES.tryouts} variant="ghost">
            {t('cta_join')}
          </Button>
        </div>

      </div>
      
      <div className="hero__stats">
        <StatCard value={TEAM_STATS.wins} label={t("stats.wins")} />
        <StatCard value={TEAM_STATS.tournaments} label={t("stats.tournaments")} />
        <StatCard value={TEAM_STATS.players} label={t("stats.players")} />
        <StatCard value={TEAM_STATS.championships} label={t("stats.championships")} />
      </div>
    </section>
  );
}
