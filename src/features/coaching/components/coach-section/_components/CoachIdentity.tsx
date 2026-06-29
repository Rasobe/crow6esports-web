import { useTranslations } from "next-intl";
import Image from "next/image";
import { MapPin, Languages } from "lucide-react";

interface CoachIdentityProps {
    /** Si se proporciona, muestra la foto del coach en lugar de las iniciales RS */
    imageSrc?: string;
}

export function CoachIdentity({ imageSrc }: CoachIdentityProps) {
    const t = useTranslations("coaching.coach");
    const tm = useTranslations("coaching.coach.bio.meta");

    return (
        <div className="coach-profile__identity-group">
            <div className="coach-profile__identity">
                <div className="coach-profile__avatar">
                    {imageSrc ? (
                        <Image
                            src={imageSrc}
                            alt={t("meta.title")}
                            width={88}
                            height={88}
                            style={{ objectFit: "cover", width: "100%", height: "100%" }}
                        />
                    ) : (
                        <span aria-hidden="true">RS</span>
                    )}
                </div>
                <div className="coach-profile__name-group">
                    <h2 className="coach-profile__name">{t("meta.title")}</h2>
                    <span className="coach-profile__subtitle">{t("meta.subtitle")}</span>
                </div>
            </div>

            <div className="coach-profile__meta">
                <div className="coach-profile__meta-item">
                    <MapPin size={13} className="coach-profile__meta-icon" aria-hidden="true" />
                    <span className="coach-profile__meta-text">{tm("location")}</span>
                </div>
                <span className="coach-profile__meta-divider" aria-hidden="true" />
                <div className="coach-profile__meta-item">
                    <Languages size={13} className="coach-profile__meta-icon" aria-hidden="true" />
                    <span className="coach-profile__meta-text">{tm("languages")}</span>
                </div>
            </div>
        </div>
    );
}
