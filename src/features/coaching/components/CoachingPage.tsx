import { Button, PageHeader } from "@/components/ui";
import { useTranslations } from "next-intl";
import "./coaching-page.scss";
import { CoachSection } from "./coach-section";

export function CoachingPage() {
    const t = useTranslations("coaching.header.actions");

    return (
        <>
            <PageHeader namespace="coaching">
                <div className="coaching-page__header-actions">
                    <Button variant="primary" href="/coaching#book">
                        {t("book")}
                    </Button>
                    <Button variant="outline" href="/coaching#contact">
                        {t("contact")}
                    </Button>
                </div>
            </PageHeader>

            <CoachSection />
        </>
    )
}