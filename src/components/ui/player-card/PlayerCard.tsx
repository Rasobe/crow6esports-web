"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Player, PlayerType, PlayerStatus } from "@/types/Player";
import {
  IconX,
  IconInstagram,
  IconTwitch,
  IconTikTok,
  IconYouTube,
} from "@/components/ui/icons";
import "./player-card.scss";

interface PlayerCardProps {
  player: Player;
}

function getAge(birthYear: number | null): number | null {
  if (!birthYear) return null;
  return new Date().getFullYear() - birthYear;
}

const ROLE_KEY: Record<PlayerType, string> = {
  player: "role_player",
  coach: "role_coach",
  analyst: "role_analyst",
  manager: "role_manager",
};

const STATUS_KEY: Record<PlayerStatus, string | null> = {
  active: null,
  substitute: "status_substitute",
  retired: "status_retired",
  former: "status_former",
};

export function PlayerCard({ player }: PlayerCardProps) {
  const t = useTranslations("home.playerCard");
  const age = getAge(player.birthYear);
  const { socials, stats } = player;

  const roleLabel = t(ROLE_KEY[player.type]);
  const statusKey = STATUS_KEY[player.status];

  const socialLinks = [
    { href: socials.twitter, icon: <IconX size={16} />, label: "Twitter / X" },
    {
      href: socials.instagram,
      icon: <IconInstagram size={16} />,
      label: "Instagram",
    },
    { href: socials.twitch, icon: <IconTwitch size={16} />, label: "Twitch" },
    { href: socials.tiktok, icon: <IconTikTok size={16} />, label: "TikTok" },
    {
      href: socials.youtube,
      icon: <IconYouTube size={16} />,
      label: "YouTube",
    },
  ].filter((s) => s.href && !s.href.includes("..."));

  return (
    <article className="player-card">
      {/* ── Background image / placeholder ── */}
      <div className="player-card__bg">
        {player.image ? (
          <Image
            src={player.image}
            alt={player.nickname}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className="player-card__img"
            priority={false}
          />
        ) : (
          <div className="player-card__no-image" aria-hidden="true">
            <span className="player-card__no-image-icon">?</span>
          </div>
        )}
        <div className="player-card__overlay" />
      </div>

      {/* ── Top badges ── */}
      <div className="player-card__top">
        <span className="player-card__role">{roleLabel}</span>
        {statusKey && (
          <span className="player-card__status">{t(statusKey)}</span>
        )}
      </div>

      {/* ── Main info ── */}
      <div className="player-card__body">
        <div className="player-card__identity">
          <h3 className="player-card__nickname">{player.nickname}</h3>
          {!player.anonymous && (
            <p className="player-card__realname">{player.realName}</p>
          )}
        </div>

        {/* Stats row */}
        <div className="player-card__stats">
          <div className="player-card__stat">
            <span className="player-card__stat-value">
              {stats.mmr.toLocaleString("en-US")}
            </span>
            <span className="player-card__stat-label">{t("stat_mmr")}</span>
          </div>
          <div className="player-card__stat-divider" />
          <div className="player-card__stat">
            <span className="player-card__stat-value">
              {stats.peak.toLocaleString("en-US")}
            </span>
            <span className="player-card__stat-label">{t("stat_peak")}</span>
          </div>
          {!!age && (
            <>
              <div className="player-card__stat-divider" />
              <div className="player-card__stat">
                <span className="player-card__stat-value">{age}</span>
                <span className="player-card__stat-label">{t("stat_age")}</span>
              </div>
            </>
          )}
        </div>

        {/* Social links */}
        {socialLinks.length > 0 && (
          <div className="player-card__socials">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="player-card__social-link"
                aria-label={s.label}
                title={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* ── Decorative corner accent ── */}
      <div className="player-card__corner" aria-hidden="true" />
    </article>
  );
}
