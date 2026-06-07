import type { Metadata } from "next";
import { siteConfig } from "@config/site";

interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
}

/**
 * Generates a metadata object for use in Next.js App Router pages.
 * Pass the result to `export const metadata` or `generateMetadata`.
 */
export function buildMetadata({
  title,
  description = siteConfig.description,
  image = "/images/og-default.jpg",
  path = "",
}: MetaTagsProps = {}): Metadata {
  const pageTitle = title ? `${title} — ${siteConfig.name}` : siteConfig.name;
  const url = `${siteConfig.url}${path}`;

  return {
    title: pageTitle,
    description,
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: `${siteConfig.url}${image}`, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [`${siteConfig.url}${image}`],
    },
    alternates: { canonical: url },
  };
}
