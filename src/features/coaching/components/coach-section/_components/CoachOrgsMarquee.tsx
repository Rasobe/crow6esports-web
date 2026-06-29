import { useTranslations } from "next-intl";
import Image from "next/image";

type Org = { name: string; slug: string };

export function CoachOrgsMarquee() {
    const t = useTranslations("coaching.coach.achievements");
    const orgs = t.raw("orgs.list") as Org[];

    return (
        <div className="coach-profile__orgs">
            <span className="coach-profile__orgs-label">{t("orgs.label")}</span>
            <div className="coach-profile__orgs-items">
                {orgs.map((org) => (
                    <div key={org.slug} className="coach-profile__org-item">
                        <div className="coach-profile__org-img">
                            <Image
                                src={`/images/orgs/${org.slug}.png`}
                                alt={org.name}
                                width={72}
                                height={64}
                            />
                        </div>
                        <span className="coach-profile__org-name">{org.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
