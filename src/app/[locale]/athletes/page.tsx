import type { Metadata } from "next";
import Link from "next/link";

import { AthleteCard } from "@/components/athletes";
import { athletes } from "@/data/athletes";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type AthletesPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const metadata: Metadata = {
  title: "Athletes",
};

export default async function AthletesPage({ params }: AthletesPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const dictionary = getDictionary(locale);
  const content = dictionary.site.athletes;
  const countryLabels = dictionary.athleteMeta.countryNames;
  const cardLabels =
    locale === "de"
      ? { profession: "Beruf", role: "Rolle", primary: "Disziplin" }
      : { profession: "Profession", role: "Role", primary: "Primary" };

  return (
    <>
      <section className="relative isolate flex min-h-[calc(100svh-3.5rem)] items-end overflow-hidden px-4 pb-16 pt-28 sm:px-6 xl:px-10">
        <div className="absolute inset-0 -z-20 bg-surface" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,var(--surface-muted),transparent_34%),linear-gradient(135deg,var(--background)_0%,var(--surface)_54%,var(--accent)_100%)]" />
          <div className="absolute bottom-0 left-0 h-2/3 w-full bg-[linear-gradient(158deg,transparent_0%,transparent_45%,var(--background)_46%,var(--surface)_74%,var(--background)_100%)] opacity-80" />
        </div>
        <div className="absolute inset-0 -z-10 bg-background/58" />

        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-5xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              {content.eyebrow}
            </p>
            <h1 className="mt-5 max-w-5xl text-5xl font-semibold leading-tight text-foreground sm:text-7xl xl:text-8xl">
              {content.title}
            </h1>
            <p className="mt-6 max-w-reading text-lg leading-8 text-foreground/82 sm:text-xl">
              {content.intro}
            </p>
            <Link
              href="#athlete-grid"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-sm bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition hover:bg-primary/88 focus-visible:outline-primary"
            >
              {content.gridAnchor}
            </Link>
          </div>
        </div>
      </section>

      <section id="athlete-grid" className="px-4 py-20 sm:px-6 sm:py-28 xl:px-10">
        <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {athletes.map((athlete) => (
            <AthleteCard
              key={athlete.slug}
              athlete={athlete}
              locale={locale}
              country={formatCountry(athlete.country, countryLabels)}
              cta={content.gridCta}
              placeholder={content.portraitPlaceholder}
              labels={cardLabels}
            />
          ))}
        </div>
      </section>
    </>
  );
}

function formatCountry(country: string | null, labels: Record<string, string>) {
  return country ? (labels[country] ?? country) : null;
}
