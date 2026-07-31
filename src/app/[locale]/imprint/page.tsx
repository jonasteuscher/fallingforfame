import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ImprintPage as ImprintPageContent } from "@/components/legal/ImprintPage";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type ImprintPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: ImprintPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const dictionary = getDictionary(locale);

  return dictionary.site.imprint.metadata;
}

export default async function ImprintPage({ params }: ImprintPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";

  if (locale !== "en") {
    notFound();
  }

  return <ImprintPageContent content={getDictionary(locale).site.imprint} />;
}
