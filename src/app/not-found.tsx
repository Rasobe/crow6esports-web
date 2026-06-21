import { headers } from "next/headers";
import Link from "next/link";
import { IconArrowLeft } from "@/components/ui";

const COPY = {
  es: {
    eyebrow: "Página no encontrada",
    title: "PÁGINA <span>NO</span><br>ENCONTRADA",
    desc: "La página que buscas no existe o ha sido movida. Vuelve al inicio y sigue compitiendo.",
    cta: "Volver al inicio",
  },
  en: {
    eyebrow: "Page not found",
    title: "PAGE <span>NOT</span><br>FOUND",
    desc: "The page you are looking for does not exist or has been moved. Go back and keep competing.",
    cta: "Back to home",
  },
} as const;

// This boundary renders for routes outside the [locale] segment (e.g. no
// locale could be resolved yet), so it can't rely on next-intl's request
// context — see src/app/[locale]/not-found.tsx for the locale-aware 404.
export default async function NotFound() {
  const acceptLanguage = (await headers()).get("accept-language") ?? "";
  const locale = acceptLanguage.startsWith("es") ? "es" : "en";
  const t = COPY[locale];

  return (
    <main className="not-found">
      <div className="not-found__bg-number" aria-hidden>404</div>

      <div className="not-found__inner">
        <p className="not-found__eyebrow">
          <span />
          {t.eyebrow}
          <span />
        </p>

        <h1 className="not-found__title" dangerouslySetInnerHTML={{ __html: t.title }} />

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
