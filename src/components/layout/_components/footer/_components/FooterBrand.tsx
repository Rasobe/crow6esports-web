import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { IconX, IconInstagram, IconDiscord, IconTwitch, IconTikTok, IconYouTube } from "@/components/ui";
import { socialLinks } from "@config/site";
import { ReactNode } from "react";

const SOCIAL_ICONS: Record<typeof socialLinks[number]["platform"], ReactNode> = {
    x: <IconX size={20} />,
    instagram: <IconInstagram size={20} />,
    discord: <IconDiscord size={20} />,
    twitch: <IconTwitch size={20} />,
    tiktok: <IconTikTok size={20} />,
    youtube: <IconYouTube size={20} />,
};

export async function FooterBrand() {
    const t = await getTranslations("footer");

    return (
        <div className="flex flex-col gap-4">
            <Image
                src="/images/brand/crow6-mascot-full.svg"
                alt="Crow6 mascot"
                width={72}
                height={72}
                loading="eager"
                style={{ width: "100px", height: "auto" }}
            />

            <div className="flex flex-col">
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {t("brand_description")}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {t("founded")}
                </p>
            </div>

            <ul className="flex flex-row gap-4">
                {socialLinks.map((social) => (
                    <li key={social.href}>
                        <Link
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.label}
                            className="opacity-50 hover:opacity-100 transition-opacity"
                            style={{ color: "var(--brand)" }}
                        >
                            {SOCIAL_ICONS[social.platform]}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}