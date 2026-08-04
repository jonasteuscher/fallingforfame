import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AthleteCard } from "@/components/athletes";
import { athletes } from "@/data/athletes";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
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
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dictionary = getDictionary(locale);
  const content = dictionary.site.athletes;
  const countryLabels = dictionary.athleteMeta.countryNames;
  const cardLabels =
    locale === "de"
      ? { profession: "Beruf", role: "Rolle", primary: "Disziplin" }
      : { profession: "Profession", role: "Role", primary: "Primary" };

  return (
    <>
      <section className="relative isolate flex min-h-[calc(100svh-3.5rem)] items-end overflow-hidden px-4 pb-24 pt-24 min-[420px]:pb-16 min-[420px]:pt-28 sm:px-6 xl:px-10">
        <div className="absolute inset-0 -z-20 bg-surface" aria-hidden="true">
          <Image
            src="/images/athletes/hero_athletes.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-background/62" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-background via-background/48 to-background/0" />

        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-5xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              {content.eyebrow}
            </p>
            <h1 className="mt-4 max-w-5xl text-[2.65rem] font-semibold leading-[1.08] text-foreground min-[420px]:mt-5 min-[420px]:text-5xl min-[420px]:leading-tight sm:text-7xl xl:text-8xl">
              {content.title}
            </h1>
            <p className="mt-5 max-w-reading text-base leading-7 text-foreground/82 min-[420px]:mt-6 min-[420px]:text-lg min-[420px]:leading-8 sm:text-xl">
              {content.intro}
            </p>
            <Link
              href="#athlete-grid"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-sm bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition hover:bg-primary/88 focus-visible:outline-primary min-[420px]:mt-8"
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
