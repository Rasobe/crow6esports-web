import { getTranslations } from "next-intl/server";
import { CTAButton, IconArrowLeft } from "@/components/ui";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <main className="not-found">
      <div className="not-found__bg-number" aria-hidden>404</div>

      <div className="not-found__inner">
        <p className="not-found__eyebrow">
          <span />
          {t("eyebrow")}
          <span />
        </p>

        <h1 className="not-found__title" dangerouslySetInnerHTML={{ __html: t.raw("title") }} />

        <div className="not-found__divider" aria-hidden />

        <p className="not-found__desc">{t("desc")}</p>

        <CTAButton
          href="/"
          className="not-found__cta"
          icon={<IconArrowLeft />}
        >
          {t("cta")}
        </CTAButton>
      </div>
    </main>
  );
}