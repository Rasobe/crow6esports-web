import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

export async function Navbar() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "nav" });

  const links = [
    { href: "/team", label: t("team") },
    { href: "/news", label: t("news") },
    { href: "/store", label: t("store") },
    { href: "/tryouts", label: t("tryouts") },
  ] as const;

  return (
    <header className="navbar">
      <nav className="navbar__inner">
        <Link
          href="/"
          className="navbar__brand"
          aria-label="Crow 6 Esports — Inicio"
        >
          <Image
            src="/images/brand/crow6-wordmark.svg"
            alt="Crow 6 Esports"
            width={80}
            height={28}
            priority
          />
        </Link>

        <NavLinks links={links} />

        <div className="navbar__actions">
          <LocaleSwitcher />
          <Link href="/tryouts" className="navbar__cta">
            {t("join")}
          </Link>
          <MobileMenu links={links} joinLabel={t("join")} />
        </div>
      </nav>
    </header>
  );
}
