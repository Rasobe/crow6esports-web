"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Player, PlayerType, PlayerStatus } from "@/types/Player";
import {
  IconX,
  IconInstagram,
  IconTwitch,
  IconTikTok,
  IconYouTube,
  IconRLTracker,
} from "@/components/ui/icons";
import { getAge, getActiveSocialLinks, SocialPlatform } from "./player-card.utils";
import "./player-card.scss";

interface PlayerCardProps {
  player: Player;
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

const SOCIAL_ICONS: Record<SocialPlatform, typeof IconX> = {
  twitter: IconX,
  instagram: IconInstagram,
  twitch: IconTwitch,
  tiktok: IconTikTok,
  youtube: IconYouTube,
  rltracker: IconRLTracker,
};

export function PlayerCard({ player }: PlayerCardProps) {
  const t = useTranslations("home.playerCard");
  const locale = useLocale();
  const age = getAge(player.birthYear);
  const { stats } = player;

  const roleLabel = t(ROLE_KEY[player.type]);
  const statusKey = STATUS_KEY[player.status];
  const socialLinks = getActiveSocialLinks(player.socials);

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
        <span className="player-card__rank">
          <span className="player-card__rank-dot" aria-hidden="true" />
          {stats.rank}
        </span>
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
              {stats.mmr.toLocaleString(locale)}
            </span>
            <span className="player-card__stat-label">{t("stat_mmr")}</span>
          </div>
          <div className="player-card__stat-divider" />
          <div className="player-card__stat">
            <span className="player-card__stat-value">
              {stats.peak.toLocaleString(locale)}
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
            {socialLinks.map((s) => {
              const Icon = SOCIAL_ICONS[s.platform];
              return (
                <a
                  key={s.platform}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="player-card__social-link"
                  aria-label={s.label}
                  title={s.label}
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Decorative corner accent ── */}
      <div className="player-card__corner" aria-hidden="true" />
    </article>
  );
}
