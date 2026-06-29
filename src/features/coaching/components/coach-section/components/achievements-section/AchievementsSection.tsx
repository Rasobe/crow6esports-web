import { Badge } from "@/components/ui";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import "./achievements-section.scss";

export function AchievementsSection() {
    const t = useTranslations("coaching.coach.achievements");
    const orgs = t.raw("orgs.list") as string[];

    return (
        <aside className="achievements-section">
            <div className="achievements-section__case">
                <span className="achievements-section__eyebrow">{t("case.eyebrow")}</span>
                <div className="achievements-section__mmr">
                    <span className="achievements-section__mmr-from">{t("case.from")}</span>
                    <ArrowRight size={20} className="achievements-section__mmr-arrow" />
                    <span className="achievements-section__mmr-to">{t("case.to")}</span>
                </div>
                <p className="achievements-section__case-desc">{t("case.description")}</p>
            </div>

            <div className="achievements-section__orgs">
                <span className="achievements-section__eyebrow">{t("orgs.label")}</span>
                <div className="achievements-section__orgs-list">
                    {orgs.map((org) => (
                        <Badge
                            key={org}
                            label={org}
                            variant={org === "Crow 6 Esports" ? "brand" : "default"}
                        />
                    ))}
                </div>
            </div>
        </aside>
    );
}
