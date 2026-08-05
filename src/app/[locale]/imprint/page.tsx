import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ImprintPage as ImprintPageContent } from "@/components/legal/ImprintPage";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { createLocalizedMetadata } from "@/lib/metadata";

type ImprintPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: ImprintPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dictionary = getDictionary(locale);

  const metadata = dictionary.site.imprint.metadata;

  return createLocalizedMetadata({
    locale,
    path: "/imprint",
    title: String(metadata.title),
    description: metadata.description ?? "",
  });
}

export default async function ImprintPage({ params }: ImprintPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  return <ImprintPageContent content={getDictionary(rawLocale).site.imprint} />;
}
