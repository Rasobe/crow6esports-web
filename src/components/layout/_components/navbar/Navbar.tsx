import { Button } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { navigationConfig } from "@config/navigation";
import { ROUTES } from "@config/routes";
import { LocaleSwitcher, MobileMenu, NavLinks } from "./_components";

export async function Navbar() {
  const t = await getTranslations("nav");

  const links = navigationConfig.mainNav.map((link) => ({
    href: link.href,
    label: t(link.labelKey),
  }));

  return (
    <header className="navbar">
      <nav className="navbar__inner">
        <Link
          href="/"
          className="navbar__brand"
          aria-label={t("home_aria")}
        >
          <Image
            src="/images/brand/crow6-wordmark.svg"
            alt="Crow 6 Esports"
            width={80}
            height={28}
            style={{ height: "auto" }}
            priority
          />
        </Link>

        <NavLinks links={links} />

        <div className="navbar__actions">
          <LocaleSwitcher />
          <Button
            variant="brand-outline"
            size="sm"
            href={ROUTES.tryouts}
            className="navbar__cta"
          >
            {t("join")}
          </Button>
          <MobileMenu
            links={links}
            joinLabel={t("join")}
            menuAriaLabel={t("menu_aria")}
            openLabel={t("menu_open_aria")}
            closeLabel={t("menu_close_aria")}
          />
        </div>
      </nav>
    </header>
  );
}
