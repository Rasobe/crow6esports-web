import "./tryouts-success.scss";
import { useEffect, useRef } from "react";
import { localizePath, type Locale, type Translate } from "@/ui/i18n";

interface TryoutsSuccessProps {
  t: Translate;
  locale: Locale;
}

const NEXT_STEPS = ["received", "review", "contact"] as const;

export function TryoutsSuccess({ t, locale }: TryoutsSuccessProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Mueve el foco al título para que el lector de pantalla anuncie el resultado y la
  // vista suba al inicio, ya que el formulario desaparece y la página se acorta.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section className="tryouts-success" aria-labelledby="tryouts-success-title">
      <div className="tryouts-success__main">
        <div className="tryouts-success__mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" strokeLinecap="square" strokeLinejoin="miter" />
          </svg>
        </div>

        <h2
          ref={headingRef}
          id="tryouts-success-title"
          tabIndex={-1}
          className="tryouts-success__title"
        >
          {t("success.title")}
        </h2>

        <p className="tryouts-success__desc">{t("success.desc")}</p>

        <a href={localizePath(locale, "/")} className="btn btn--outline btn--md">
          {t("success.home")}
        </a>
      </div>

      <div className="tryouts-success__next">
        <h3 className="tryouts-success__next-title">{t("success.next.title")}</h3>
        <ol className="tryouts-success__list">
          {NEXT_STEPS.map((key, index) => (
            <li key={key} className="tryouts-success__item">
              <span className="tryouts-success__index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="tryouts-success__text">
                <strong>{t(`success.next.${key}.title`)}</strong>
                <span>{t(`success.next.${key}.desc`)}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="tryouts-success__note">{t("success.note")}</p>
      </div>
    </section>
  );
}
