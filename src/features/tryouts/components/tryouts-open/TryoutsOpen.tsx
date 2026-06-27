import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/ui";
import { TryoutsForm } from "./components";

export async function TryoutsOpen() {
    const t = await getTranslations("tryouts.open");

    return (
        <main className="tryouts-open">
            <PageHeader
                eyebrow={t("eyebrow")}
                title={t("title")}
                description={t("desc")}
            />
            <div className="tryouts-open__content">
                <TryoutsForm />
            </div>
        </main>
    );
}