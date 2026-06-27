import { getTranslations } from "next-intl/server";
import { Mail, MapPin } from "lucide-react";
import { FooterSectionTitle } from "./FooterSectionTitle";

export async function FooterContact() {
    const t = await getTranslations("footer");

    return (
        <div className="flex flex-col gap-4">
            <FooterSectionTitle value="contact.title" />

            <ul className="flex flex-col gap-3">
                <li className="flex items-center gap-3 text-sm">
                    <Mail size={16} style={{ color: "var(--brand)" }} className="shrink-0" />
                    <a
                        href={`mailto:${t("contact.email")}`}
                        className="transition-colors hover:text-brand"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        {t("contact.email")}
                    </a>
                </li>
                <li className="flex items-center gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <MapPin size={16} style={{ color: "var(--brand)" }} className="shrink-0" />
                    <span>{t("contact.location")}</span>
                </li>
            </ul>
        </div>
    );
}