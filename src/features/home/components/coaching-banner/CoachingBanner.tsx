import { Button, SectionHeader } from "@/components/ui";
import { ROUTES } from "@config/routes";
import { useTranslations } from "next-intl";

interface CoachingPack {
  id: "pack_1" | "pack_2" | "pack_3";
  featured: boolean;
  featureCount: number;
}

const PACKS: CoachingPack[] = [
  { id: "pack_1", featured: false, featureCount: 3 },
  { id: "pack_2", featured: true, featureCount: 4 },
  { id: "pack_3", featured: false, featureCount: 4 },
];

export function CoachingBanner() {
  const t = useTranslations("home.coachingBanner");

  return (
    <section className="coaching-banner">
      <div className="coaching-banner__inner">
        <SectionHeader namespace="home.coachingBanner" />

        <p className="coaching-banner__credibility">{t("credibility")}</p>

        <div className="coaching-banner__packs">
          {PACKS.map(({ id, featured, featureCount }) => (
            <div
              key={id}
              className={
                featured ? "coaching-pack--featured" : "coaching-pack"
              }
            >
              {featured && (
                <span className="coaching-pack__badge">
                  {t("pack_2_badge")}
                </span>
              )}
              <h3 className="coaching-pack__title">{t(`${id}_title`)}</h3>
              <p className="coaching-pack__price">{t(`${id}_price`)}</p>
              <p className="coaching-pack__description">
                {t(`${id}_description`)}
              </p>
              <ul className="coaching-pack__features">
                {Array.from({ length: featureCount }, (_, index) => (
                  <li key={index}>
                    {t(`${id}_feature_${index + 1}`)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="coaching-banner__footer">
          <Button href={ROUTES.coaching} variant="primary">
            {t("cta_reserve")}
          </Button>
        </div>
      </div>
    </section>
  );
}