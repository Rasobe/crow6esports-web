"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTransition } from "react";

const LOCALES = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
] as const;

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return;
    startTransition(() => {
      router.push(pathname, { locale: newLocale });
      router.refresh();
    });
  };

  return (
    <fieldset className="locale-switcher" aria-label="Seleccionar idioma">
      {LOCALES.map(({ code, label }, i) => (
        <span key={code} className="locale-switcher__item">
          <button
            onClick={() => switchLocale(code)}
            disabled={isPending}
            aria-pressed={locale === code}
            className={`locale-switcher__btn ${
              locale === code ? "locale-switcher__btn--active" : ""
            }`}
          >
            {label}
          </button>
          {i < LOCALES.length - 1 && (
            <span className="locale-switcher__sep" aria-hidden>
              |
            </span>
          )}
        </span>
      ))}
    </fieldset>
  );
}
