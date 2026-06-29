import { useTranslations } from "next-intl";
import { CoachIdentity, CoachStats, CoachOrgsMarquee, CoachSidebar } from "./_components";
import "./coach-profile.scss";

export function CoachSection() {
    const t = useTranslations("coaching.coach");

    return (
        <section className="coach-profile" aria-label={t("meta.eyebrow")}>
            <div className="coach-profile__inner">
                <div className="coach-profile__left">
                    <CoachIdentity />
                    <p className="coach-profile__bio">{t("bio.p1")}</p>
                    <CoachStats />
                    <CoachOrgsMarquee />
                </div>

                <CoachSidebar />
            </div>
        </section>
    );
}