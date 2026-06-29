import { useTranslations } from "next-intl";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui";

export function CoachSidebar() {
    const t = useTranslations("coaching.coach");
    const ta = useTranslations("coaching.coach.achievements");
    const tc = useTranslations("coaching");

    return (
        <aside className="coach-profile__right">
            <div className="coach-profile__case">
                <span className="coach-profile__case-eyebrow">
                    {ta("case.eyebrow")}
                </span>
                <div className="coach-profile__case-mmr">
                    <span className="coach-profile__mmr-from">{ta("case.from")}</span>
                    <ArrowRight size={20} className="coach-profile__mmr-arrow" aria-hidden="true" />
                    <span className="coach-profile__mmr-to">{ta("case.to")}</span>
                </div>
                <p className="coach-profile__case-desc">{ta("case.description")}</p>
            </div>

            <div className="coach-profile__availability">
                <span className="coach-profile__avail-eyebrow">
                    {t("availability.eyebrow")}
                </span>
                <div className="coach-profile__avail-time">
                    <Clock size={16} aria-hidden="true" />
                    {t("availability.schedule")}
                </div>
                <div className="coach-profile__avail-cta">
                    <Button variant="primary" href="/coaching#book">
                        {tc("book")}
                    </Button>
                    <Button
                        variant="outline"
                        href="https://discord.gg/crow6"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Discord
                    </Button>
                </div>
            </div>
        </aside>
    );
}
