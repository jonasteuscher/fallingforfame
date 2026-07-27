"use client";

import { usePathname } from "next/navigation";

import { NotFoundContent } from "@/components/NotFoundContent";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type LocalizedNotFoundContentProps = {
  as?: "main" | "section";
};

export function LocalizedNotFoundContent({
  as = "section",
}: LocalizedNotFoundContentProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const dictionary = getDictionary(locale);

  return <NotFoundContent locale={locale} copy={dictionary.site.notFound} as={as} />;
}

function getLocaleFromPathname(pathname: string | null): Locale {
  const [, localeCandidate] = (pathname ?? "").split("/");

  return isLocale(localeCandidate) ? localeCandidate : defaultLocale;
}
