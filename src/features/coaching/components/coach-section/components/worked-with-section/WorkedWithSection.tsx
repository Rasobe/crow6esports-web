import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import "./worked-with-section.scss";

type Org = { name: string; slug: string };

export function WorkedWithSection() {
    const t = useTranslations("coaching.coach.achievements");
    const orgs = t.raw("orgs.list") as Org[];

    const renderSet = (suffix: string) => (
        <div key={suffix} className="worked-with__set" aria-hidden={suffix === "a" ? undefined : "true"}>
            {orgs.map((org) => (
                <div key={`${org.slug}-${suffix}`} className="worked-with__item">
                    <div className="worked-with__item-img">
                        <Image
                            src={`/images/orgs/${org.slug}.png`}
                            alt={org.name}
                            width={100}
                            height={100}
                        />
                    </div>
                    <span className="worked-with__item-name" aria-hidden="true">{org.name}</span>
                </div>
            ))}
        </div>
    );

    return (
        <aside className="worked-with">
            <div className="worked-with__case">
                <span className="worked-with__case-eyebrow">{t("case.eyebrow")}</span>
                <div className="worked-with__case-mmr">
                    <span className="worked-with__mmr-from">{t("case.from")}</span>
                    <ArrowRight size={18} className="worked-with__mmr-arrow" />
                    <span className="worked-with__mmr-to">{t("case.to")}</span>
                </div>
                <p className="worked-with__case-desc">{t("case.description")}</p>
            </div>

            <div className="worked-with__orgs">
                <span className="worked-with__label">{t("orgs.label")}</span>
                <div className="worked-with__track-wrapper">
                    <div className="worked-with__track">
                        {["a", "b", "c", "d"].map(renderSet)}
                    </div>
                </div>
            </div>
        </aside>
    );
}
