import { getTranslations } from "next-intl/server";
import { siteConfig } from "@config/site";

export async function FooterBottom() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <div
      className="border-t pt-6 text-xs"
      style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
    >
      © {year} {siteConfig.name} — {t("rights")}
    </div>
  );
}
