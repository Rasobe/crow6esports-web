import { Button } from "@/components/ui";
import { ROUTES } from "@config/routes";
import { useTranslations } from "next-intl";

export function TeamCTA() {
    const t = useTranslations("team");

    return (
        <section className="team-cta">
            <div className="team-cta__inner">
                <p className="section-label"></p>
                <h2 className="team-cta__title"></h2>
                <p className="team-cta__description"></p>
                <Button href={ROUTES.tryouts}>
                    {t("cta_join")}
                </Button>
            </div>
        </section>
    )
}