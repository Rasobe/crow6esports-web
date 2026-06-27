"use client";

import { useTranslations } from "next-intl";
import "./tryouts-success.scss";

export function TryoutsSuccess() {
    const t = useTranslations("tryouts.open.success");

    return (
        <div className="tryouts-success">
            <div className="tryouts-success__icon" aria-hidden>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                </svg>
            </div>

            <p className="tryouts-success__eyebrow">
                <span aria-hidden />
                {t("eyebrow")}
                <span aria-hidden />
            </p>

            <h2 className="tryouts-success__title">{t("title")}</h2>

            <div className="tryouts-success__divider" aria-hidden />

            <p className="tryouts-success__desc">{t("desc")}</p>

            <p className="tryouts-success__note">{t("note")}</p>
        </div>
    );
}