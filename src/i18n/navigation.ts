import type { Locale } from "@/i18n/config";

export function localizedPath(locale: Locale, path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export function localizedImprintPath(locale: Locale) {
  return localizedPath(locale, "/imprint");
}

export function localizedPrivacyPath(locale: Locale) {
  return localizedPath(locale, "/privacy");
}

export function localizedCurrentPath(pathname: string | null, locale: Locale) {
  if (!pathname) {
    return localizedPath(locale);
  }

  const pathWithoutLocale = pathname.replace(/^\/(en|de)(?=\/|$)/, "");

  if (pathWithoutLocale === "/privacy" || pathWithoutLocale === "/datenschutz") {
    return localizedPrivacyPath(locale);
  }

  return localizedPath(locale, pathWithoutLocale || "/");
}
