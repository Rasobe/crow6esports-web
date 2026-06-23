import type { Metadata } from "next";
import { siteConfig } from "@config/site";
import { getTranslations } from "next-intl/server";

interface BuildMetadataParams {
  title?: string;
  description: string;
  image?: string;
  path?: string;
  locale?: string;
}

export function buildMetadata({
  title,
  description,
  image = "/images/og-default.jpg",
  path = "",
  locale = "es",
}: BuildMetadataParams): Metadata {
  const pageTitle = title
    ? `${title} - ${siteConfig.name}`
    : siteConfig.name;

  const canonical = `${siteConfig.url}/${locale}${path}`;
  const ogImage = `${siteConfig.url}${image}`;

  return {
    title: pageTitle,
    description,
    openGraph: {
      title: pageTitle,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: pageTitle }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical,
      languages: {
        es: `${siteConfig.url}/es${path}`,
        en: `${siteConfig.url}/en${path}`,
      },
    },
  };
}

export function createGenerateMetadata(namespace: string, path: string) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace });

    return buildMetadata({
      title: t("meta.title"),
      description: t("meta.description"),
      path,
      locale,
    });
  };
}