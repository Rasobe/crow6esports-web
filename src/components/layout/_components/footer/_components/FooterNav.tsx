import { navigationConfig } from "@config/navigation"
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FooterSectionTitle } from "./FooterSectionTitle";

export async function FooterNav() {
    const t = await getTranslations("footer");

    return (
        <div className="flex flex-col gap-4">
            <FooterSectionTitle value="nav.title" />

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