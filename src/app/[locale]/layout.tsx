import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { AudioProvider } from "@/components/audio";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { LocaleDocumentAttributes } from "@/components/layout/LocaleDocumentAttributes";
import { MobileExperienceNotice } from "@/components/MobileExperienceNotice";
import { ScrollProgressIndicator } from "@/components/scrollytelling";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, locales, type Locale } from "@/i18n/config";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale as Locale);

  return (
    <AudioProvider>
      <LocaleDocumentAttributes locale={locale as Locale} />
      <ScrollProgressIndicator />
      <SiteHeader locale={locale as Locale} navigation={dictionary.site.navigation} />
      <MobileExperienceNotice content={dictionary.site.home.mobileExperienceNotice} />
      <main className="flex-1 pt-14">{children}</main>
      <SiteFooter locale={locale as Locale} />
    </AudioProvider>
  );
}
