import { useTranslations } from "next-intl";
import "./section-header.scss";

interface SectionHeaderProps {
  namespace: string;
}

export function SectionHeader({ namespace }: SectionHeaderProps) {
  const t = useTranslations(namespace);

  return (
    <header className="section-header">
      <span className="section-label">{t("eyebrow")}</span>
      <h2 className="section-header__title">{t("title")}</h2>
      <p className="section-header__subtitle">{t("subtitle")}</p>
    </header>
  );
}
