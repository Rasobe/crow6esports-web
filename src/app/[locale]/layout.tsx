import type { Metadata } from "next";
import { Anton_SC, Barlow_Condensed, Barlow } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@config/site";
import "../globals.css";

const locales = ["es", "en"] as const;

const antonSC = Anton_SC({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-ui",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const barlow = Barlow({
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Navbar />
      <div className={`${antonSC.variable} ${barlowCondensed.variable} ${barlow.variable} content-offset flex flex-1 flex-col`}>
        {children}
      </div>
      <Footer />
    </NextIntlClientProvider>
  );
}
