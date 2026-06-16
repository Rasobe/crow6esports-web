
import { IconDiscord, IconInstagram, IconTikTok, IconTwitch, IconX, IconYouTube } from "@/components/ui";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function FooterContact() {
    const t = await getTranslations("footer");

    const socials = [
        { icon: <IconX size={20} />, label: "X", href: "https://x.com/crow6esports" },
        { icon: <IconInstagram size={20} />, label: "Instagram", href: "https://instagram.com/crow6esports" },
        { icon: <IconDiscord size={20} />, label: "Discord", href: "https://discord.gg/crow6" },
        { icon: <IconTwitch size={20} />, label: "Twitch", href: "https://twitch.tv/crow6esports" },
        { icon: <IconTikTok size={20} />, label: "TikTok", href: "https://tiktok.com/@crow6esports" },
        { icon: <IconYouTube size={20} />, label: "YouTube", href: "https://youtube.com/@crow6esports" }
    ];

    return (
        <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                {t("contact.title")}
            </span>
            <ul className="flex flex-row gap-4">
                {socials.map((social) => (
                    <li key={social.href}>
                        <Link
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.label}
                            className="opacity-50 hover:opacity-100 transition-opacity"
                            style={{ color: "var(--text-primary)" }}
                        >
                            {social.icon}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}