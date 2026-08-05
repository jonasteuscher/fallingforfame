import type { Metadata } from "next";

import { FindingsPage as FindingsDocumentaryPage } from "@/components/findings";
import { getDictionary } from "@/i18n/dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { createLocalizedMetadata } from "@/lib/metadata";

type FindingsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: FindingsPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dictionary = getDictionary(locale);

  return createLocalizedMetadata({
    locale,
    path: "/findings",
    title: dictionary.site.findings.metadata.title,
    description: dictionary.site.findings.metadata.description,
  });
}

export default async function FindingsPage({ params }: FindingsPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dictionary = getDictionary(locale);

  return <FindingsDocumentaryPage content={dictionary.site.findings} locale={locale} />;
}
