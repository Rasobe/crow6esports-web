import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { siteConfig } from "@config/site";
import { routing } from "@/i18n/routing";
import { Footer, Navbar } from "@/components/layout";
import { buildMetadata } from "@/components/seo";
import { QueryProvider } from "@/components/providers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  return {
    ...buildMetadata({ description: t("description"), locale }),
    title: {
      default: siteConfig.name,
      template: `%s`,
    },
    metadataBase: new URL(siteConfig.url),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <QueryProvider>
        <Navbar />
        <div className="content-offset flex flex-1 flex-col">
          {children}
        </div>
        <Footer />
      </QueryProvider>
    </NextIntlClientProvider>
  );
}
