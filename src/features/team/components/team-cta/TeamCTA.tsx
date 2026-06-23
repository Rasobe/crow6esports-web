import { Button } from "@/components/ui";
import { ROUTES } from "@config/routes";
import { useTranslations } from "next-intl";
import './team-cta.scss';

export function TeamCTA() {
    const t = useTranslations("team.cta");

    return (
        <section className="team-cta">
            <div className="team-cta__inner">
                <p className="section-label">{t("eyebrow")}</p>
                <h2 className="team-cta__title">{t("title")}</h2>
                <p className="team-cta__description">{t("description")}</p>
                <Button href={ROUTES.tryouts}>
                    {t("join")}
                </Button>
            </div>
        </section>
    )
}