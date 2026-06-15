import type { Locale } from "@/i18n/config";

const footerCopy: Record<Locale, string> = {
  en: "'Falling for Fame?' prepares a bilingual multimedia documentary structure for thesis research, interviews and field documentation.",
  de: "'Falling for Fame?' bereitet eine bilinguale multimediale Dokumentationsstruktur für Bachelorarbeit, Interviews und Felddokumentation vor.",
};

type SiteFooterProps = {
  locale: Locale;
};

export function SiteFooter({ locale }: SiteFooterProps) {
  return (
    <footer className="border-t border-border bg-background px-4 py-10 text-sm text-foreground/70 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <p>{footerCopy[locale]}</p>
        <p className="mt-4">© Jonas Teuscher 2026</p>
      </div>
    </footer>
  );
}
