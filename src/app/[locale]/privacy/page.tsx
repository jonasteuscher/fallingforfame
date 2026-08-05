import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PrivacyPolicyPage } from "@/components/legal/PrivacyPolicyPage";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedPrivacyPath } from "@/i18n/navigation";

type PrivacyPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const sharedOgImage = {
  url: "/og/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Falling for Fame?",
};

export function generateStaticParams() {
  return [{ locale: "de" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const metadata = getDictionary(locale).site.privacy.metadata;

  return {
    ...metadata,
    alternates: {
      canonical: localizedPrivacyPath(locale),
      languages: {
        en: localizedPrivacyPath("en"),
        de: localizedPrivacyPath("de"),
      },
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: localizedPrivacyPath(locale),
      siteName: "Falling for Fame?",
      images: [sharedOgImage],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: [sharedOgImage],
    },
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  return <PrivacyPolicyPage content={getDictionary(rawLocale).site.privacy} />;
}
