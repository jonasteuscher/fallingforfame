import type { Locale } from "@/i18n/config";

export function localizedPath(locale: Locale, path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export function localizedImprintPath(locale: Locale) {
  return localizedPath(locale, locale === "de" ? "/impressum" : "/imprint");
}
