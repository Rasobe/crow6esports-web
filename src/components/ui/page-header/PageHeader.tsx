"use client";

import { useTranslations } from "next-intl";
import "./page-header.scss";

interface PageHeaderProps {
  namespace: string;
  children?: React.ReactNode;
}

export function PageHeader({ namespace, children }: PageHeaderProps) {
  const t = useTranslations(namespace);

  const title = namespace ? t("meta.title") : "";
  const eyebrow = namespace ? t("meta.eyebrow") : "";
  const description = namespace ? t("meta.description") : "";

  return (
    <div className="page-header" data-title={title}>
      <div className="page-header__inner">
        {eyebrow && (
          <span className="page-header__eyebrow">{eyebrow}</span>
        )}
        <h1 className="page-header__title">{title}</h1>
        {description && (
          <p className="page-header__description">{description}</p>
        )}
        {children}
      </div>
    </div>
  );
}