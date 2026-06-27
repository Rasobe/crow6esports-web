"use client";

import { Button, IconLock, SectionHeader, TextField } from "@/components/ui";
import { useTranslations } from "next-intl";
import "./tryouts-closed.scss";

export function TryoutsClosed() {
    const t = useTranslations("tryouts.closed")

    return (
        <div className="tryouts-closed">
            <div className="tryouts-closed__inner">
                <span className="tryouts-closed__icon">
                    <IconLock />
                </span>
                <SectionHeader namespace={"tryouts.closed"} />
                <p className="tryouts-closed__desc">{t("desc")}</p>
                <div className="tryouts-closed__notify">
                    <TextField
                        label={t("notify_label")}
                        placeholder={t("notify_placeholder")}
                        className="tryouts-closed__input"
                    />
                    <Button onClick={() => { }}>
                        {t("notify_button")}
                    </Button>
                </div>
            </div>
        </div>
    )
}