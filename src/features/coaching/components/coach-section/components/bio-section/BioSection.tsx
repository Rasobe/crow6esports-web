import { SectionHeader } from "@/components/ui";
import { useTranslations } from "next-intl";
import { CoachMeta } from "./components";

export function BioSection() {
    const t = useTranslations("coaching.coach.bio");

    return (
        <section className="coach-section__bio">
            <SectionHeader namespace="coaching.coach.meta" />

            <CoachMeta />

            <p className="coach-section__bio-text">
                {t("p1")}
            </p>
        </section>
    )
}