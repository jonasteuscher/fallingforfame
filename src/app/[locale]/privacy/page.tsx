import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PrivacyPolicyPage } from "@/components/legal/PrivacyPolicyPage";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { createLocalizedMetadata } from "@/lib/metadata";

type PrivacyPageProps = {
  params: Promise<{
    locale: string;
  }>;
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

  return createLocalizedMetadata({
    locale,
    path: "/privacy",
    title: String(metadata.title),
    description: metadata.description ?? "",
  });
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  return <PrivacyPolicyPage content={getDictionary(rawLocale).site.privacy} />;
}
