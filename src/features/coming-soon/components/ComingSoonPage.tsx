import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { IconX, IconInstagram, IconDiscord, IconTwitch, IconTikTok, IconYouTube } from "@/components/ui/icons";
import { socialLinks } from "@config/site";
import "./coming-soon.scss";

const SOCIAL_ICONS: Record<(typeof socialLinks)[number]["platform"], ReactNode> = {
  x: <IconX size={20} />,
  instagram: <IconInstagram size={20} />,
  discord: <IconDiscord size={20} />,
  twitch: <IconTwitch size={20} />,
  tiktok: <IconTikTok size={20} />,
  youtube: <IconYouTube size={20} />,
};

export function ComingSoonPage() {
  return (
    <div className="coming-soon">
      <div className="coming-soon__bg-text" aria-hidden>C6</div>
      <div className="coming-soon__corner coming-soon__corner--tl" aria-hidden />
      <div className="coming-soon__corner coming-soon__corner--tr" aria-hidden />
      <div className="coming-soon__corner coming-soon__corner--bl" aria-hidden />
      <div className="coming-soon__corner coming-soon__corner--br" aria-hidden />

      <div className="coming-soon__inner">
        <div className="coming-soon__logo">
          <Image
            src="/images/brand/crow6-mascot-full.svg"
            alt="Crow 6 eSports"
            width={160}
            height={48}
            priority
          />
        </div>

        <p className="coming-soon__eyebrow">
          <span aria-hidden />
          Estamos preparando algo
          <span aria-hidden />
        </p>

        <h1 className="coming-soon__title">
          PRÓXI<span>MA</span>MENTE
        </h1>

        <div className="coming-soon__divider" aria-hidden />

        <p className="coming-soon__description">
          Estamos trabajando en una nueva experiencia para Crow 6 eSports. Vuelve pronto.
        </p>

        <div className="coming-soon__socials">
          {socialLinks.map((social) => (
            <Link
              key={social.href}
              href={social.href}
              className="coming-soon__social"
              aria-label={social.label}
              target="_blank"
              rel="noopener noreferrer"
            >
              {SOCIAL_ICONS[social.platform]}
            </Link>
          ))}
        </div>

        <span className="coming-soon__meta">
          EST. 2020 · HUESCA, ESPAÑA · ROCKET LEAGUE
        </span>
      </div>

      <p className="coming-soon__hashtag" aria-hidden>#GOCROWS</p>
    </div>
  );
}