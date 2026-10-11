import "./tryouts-success.scss";
import type { Translate } from "@/ui/i18n";

interface TryoutsSuccessProps {
  t: Translate;
}

export function TryoutsSuccess({ t }: TryoutsSuccessProps) {
  return (
    <div className="tryouts-success">
      <div className="tryouts-success__icon" aria-hidden="true">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>

      <p className="tryouts-success__eyebrow">
        <span aria-hidden="true" />
        {t("success.eyebrow")}
        <span aria-hidden="true" />
      </p>

      <h2 className="tryouts-success__title">{t("success.title")}</h2>

      <div className="tryouts-success__divider" aria-hidden="true" />

      <p className="tryouts-success__desc">{t("success.desc")}</p>

      <p className="tryouts-success__note">{t("success.note")}</p>
    </div>
  );
}
