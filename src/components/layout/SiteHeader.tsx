import Image from "next/image";
import Link from "next/link";

import brandMark from "@/app/icon.png";
import { type Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/navigation";
import { SiteNavigation } from "@/components/layout/SiteNavigation";

type SiteHeaderProps = {
  locale: Locale;
  navigation: {
    home: string;
    athletes: string;
    findings: string;
    sport: string;
    project: string;
    menu: string;
    language: string;
    openMenu: string;
    closeMenu: string;
    openMenuShort: string;
    closeMenuShort: string;
  };
};

export function SiteHeader({ locale, navigation }: SiteHeaderProps) {
  const links = [
    { href: localizedPath(locale), label: navigation.home },
    { href: localizedPath(locale, "/sport"), label: navigation.sport },
    { href: localizedPath(locale, "/athletes"), label: navigation.athletes },
    { href: localizedPath(locale, "/project"), label: navigation.project },
    { href: localizedPath(locale, "/findings"), label: navigation.findings },
  ];

  return (
    <header className="ui-material fixed inset-x-0 top-0 z-40 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-1.5 sm:px-6"
        aria-label={locale === "de" ? "Hauptnavigation" : "Primary navigation"}
      >
        <Link
          href={localizedPath(locale)}
          className="inline-flex min-w-0 items-center gap-2 font-semibold uppercase focus-visible:rounded-sm"
        >
          <Image
            src={brandMark}
            alt=""
            width={34}
            height={34}
            className="h-8 w-8 object-contain"
            priority
          />
          <span className="truncate">Falling for Fame?</span>
        </Link>
        <SiteNavigation locale={locale} links={links} labels={navigation} />
      </nav>
    </header>
  );
}
