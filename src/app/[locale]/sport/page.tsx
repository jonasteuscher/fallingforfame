import type { Metadata } from "next";

import { SportPage as SportPageContent } from "@/components/sport/SportPage";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, type Locale } from "@/i18n/config";

type SportPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: SportPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const dictionary = getDictionary(locale);

  return {
    title: dictionary.site.sport.title,
    description: dictionary.site.sport.body,
  };
}

export default async function SportPage({ params }: SportPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const dictionary = getDictionary(locale);

  return <SportPageContent content={dictionary.site.sport} />;
}
