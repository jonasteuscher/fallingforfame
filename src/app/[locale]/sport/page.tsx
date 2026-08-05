import type { Metadata } from "next";

import { SportPage as SportPageContent } from "@/components/sport/SportPage";
import { getDictionary } from "@/i18n/dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { createLocalizedMetadata } from "@/lib/metadata";

type SportPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: SportPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dictionary = getDictionary(locale);

  return createLocalizedMetadata({
    locale,
    path: "/sport",
    title: dictionary.site.sport.metadata.title,
    description: dictionary.site.sport.metadata.description,
  });
}

export default async function SportPage({ params }: SportPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dictionary = getDictionary(locale);

  return <SportPageContent content={dictionary.site.sport} />;
}
