import Link from "next/link";

import { locales, type Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/navigation";

type SiteHeaderProps = {
  locale: Locale;
  navigation: {
    home: string;
    athletes: string;
    about: string;
    findings: string;
  };
};

export function SiteHeader({ locale, navigation }: SiteHeaderProps) {
  const links = [
    { href: localizedPath(locale), label: navigation.home },
    { href: localizedPath(locale, "/athletes"), label: navigation.athletes },
    { href: localizedPath(locale, "/about"), label: navigation.about },
    { href: localizedPath(locale, "/findings"), label: navigation.findings },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
        aria-label="Primary navigation"
      >
        <Link href={localizedPath(locale)} className="font-semibold uppercase">
          Falling for Fame
        </Link>
        <div className="flex items-center gap-3 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden rounded-sm px-2 py-1 text-foreground/80 transition hover:text-foreground focus-visible:text-foreground sm:inline-flex"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-1 border-l border-border pl-3">
            {locales.map((nextLocale) => (
              <Link
                key={nextLocale}
                href={localizedPath(nextLocale)}
                aria-current={nextLocale === locale ? "page" : undefined}
                className="rounded-sm px-2 py-1 uppercase text-foreground/70 aria-[current=page]:bg-surface aria-[current=page]:text-foreground"
              >
                {nextLocale}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
