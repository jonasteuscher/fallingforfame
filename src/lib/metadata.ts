import type { Metadata } from "next";

import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/navigation";

const siteName = "Falling for Fame?";
const sharedOgImage = {
  url: "/og/og-image.jpg",
  width: 1200,
  height: 630,
  alt: siteName,
};

type LocalizedMetadataOptions = {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
};

export function createLocalizedMetadata({
  locale,
  path = "",
  title,
  description,
}: LocalizedMetadataOptions): Metadata {
  const pageTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const canonical = localizedPath(locale, path);

  return {
    title: { absolute: pageTitle },
    description,
    alternates: {
      canonical,
      languages: {
        en: localizedPath("en", path),
        de: localizedPath("de", path),
        "x-default": localizedPath("en", path),
      },
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonical,
      siteName,
      images: [sharedOgImage],
      type: "website",
      locale: locale === "de" ? "de_CH" : "en_GB",
      alternateLocale: locale === "de" ? ["en_GB"] : ["de_CH"],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [sharedOgImage],
    },
  };
}
