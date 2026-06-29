import { LanguagesIcon, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import "./coach-meta.scss";

export function CoachMeta() {
    const t = useTranslations("coaching.coach.bio.meta");

    return (
        <div className="coach-meta">
            <div className="coach-meta__item">
                <MapPin size={14} className="coach-meta__icon" />
                <span className="coach-meta__text">{t("location")}</span>
            </div>
            <span className="coach-meta__divider" aria-hidden="true" />
            <div className="coach-meta__item">
                <LanguagesIcon size={14} className="coach-meta__icon" />
                <span className="coach-meta__text">{t("languages")}</span>
            </div>
        </div>
    );
}