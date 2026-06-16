import { navigationConfig } from "@config/navigation"
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function FooterNav() {
    const t = await getTranslations("footer");

    return (
        <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                {t("nav.title")}
            </span>
            <ul className="flex flex-col gap-2">
                {navigationConfig.mainNav.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className="text-sm transition-opacity hover:opacity-100 opacity-60"
                            style={{ color: "var(--text-primary)" }}
                        >
                            {t(`nav.${link.labelKey.toLowerCase()}`)}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}