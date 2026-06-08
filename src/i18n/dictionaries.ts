import * as de from "@/content/de/site";
import * as en from "@/content/en/site";
import type { Locale } from "@/i18n/config";

const dictionaries = {
  en,
  de,
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
