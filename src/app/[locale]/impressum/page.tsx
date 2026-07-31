import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ImprintPage as ImprintPageContent } from "@/components/legal/ImprintPage";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type ImpressumPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: ImpressumPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const dictionary = getDictionary(locale);

  return dictionary.site.imprint.metadata;
}

export default async function ImpressumPage({ params }: ImpressumPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";

  if (locale !== "de") {
    notFound();
  }

  return <ImprintPageContent content={getDictionary(locale).site.imprint} />;
}
