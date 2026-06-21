import { headers } from "next/headers";
import Link from "next/link";
import { IconArrowLeft } from "@/components/ui";
import esMessages from "../../messages/es.json";
import enMessages from "../../messages/en.json";

const MESSAGES_BY_LOCALE = { es: esMessages, en: enMessages } as const;

export default async function NotFound() {
  const acceptLanguage = (await headers()).get("accept-language") ?? "";
  const locale = acceptLanguage.startsWith("es") ? "es" : "en";
  const t = MESSAGES_BY_LOCALE[locale].notFound;

  return (
    <main className="not-found">
      <div className="not-found__bg-number" aria-hidden>
        404
      </div>

      <div className="not-found__inner">
        <p className="not-found__eyebrow">
          <span />
          {t.eyebrow}
          <span />
        </p>

        <h1
          className="not-found__title"
          dangerouslySetInnerHTML={{ __html: t.title }}
        />

        <div className="not-found__divider" aria-hidden />

        <p className="not-found__desc">{t.desc}</p>

        <Link href="/" className="not-found__cta">
          <span className="cta-button__icon" aria-hidden>
            <IconArrowLeft />
          </span>
          {t.cta}
        </Link>
      </div>
    </main>
  );
}
