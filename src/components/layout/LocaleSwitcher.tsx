// components/layout/LocaleSwitcher.tsx
"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
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
    // Reemplaza el segmento de locale en la URL actual
    // /es/team → /en/team
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    startTransition(() => {
      router.push(newPath);
    });
  };

  return (
    <fieldset
      className="locale-switcher"
      aria-label="Seleccionar idioma"
    >
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
