import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { MobileExperienceNotice } from "@/components/MobileExperienceNotice";
import { athletes } from "@/data/athletes";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedPath } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type HomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const metadata: Metadata = {
  title: {
    absolute: "Home | Falling for Fame?",
  },
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const dictionary = getDictionary(locale);
  const home = dictionary.site.home;
  const countryLabels = dictionary.athleteMeta.countryNames;

  return (
    <main className="overflow-x-clip">
      <MobileExperienceNotice content={home.mobileExperienceNotice} />

      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden px-4 pb-12 pt-28 sm:px-6 sm:pb-16 xl:px-10">
        <div
          className="absolute inset-0 -z-20 bg-surface"
          role="img"
          aria-label={home.hero.visualLabel}
        >
          <Image
            src="/images/home/hero-4.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-background/50" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-background to-background/0" />

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 xl:grid xl:grid-cols-[minmax(0,0.95fr)_minmax(18rem,0.55fr)] xl:items-end">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              {home.hero.eyebrow}
            </p>
            <h1 className="mt-5 max-w-5xl text-5xl font-semibold leading-[0.95] text-foreground sm:text-7xl xl:text-8xl">
              {home.hero.title}
            </h1>
            <p className="mt-5 max-w-3xl text-2xl font-semibold leading-tight text-foreground sm:text-4xl">
              {home.hero.subtitle}
            </p>
            <p className="mt-6 max-w-reading text-lg leading-8 text-foreground/82 sm:text-xl">
              {home.hero.intro}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#opening-question"
                className="inline-flex min-h-12 items-center justify-center rounded-sm bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition hover:bg-primary/88 focus-visible:outline-primary"
              >
                {home.hero.primaryCta}
              </Link>
              <Link
                href={localizedPath(locale, "/athletes")}
                className="inline-flex min-h-12 items-center justify-center rounded-sm border border-border bg-background/30 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-foreground backdrop-blur transition hover:bg-surface"
              >
                {home.hero.secondaryCta}
              </Link>
            </div>
          </div>

          <div className="flex -translate-y-5 items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-foreground/70 sm:translate-y-0 xl:justify-end">
            <span className="h-px w-12 bg-primary" aria-hidden="true" />
            <span>{home.hero.scrollIndicator}</span>
          </div>
        </div>
      </section>

      <section id="opening-question" className="px-4 py-20 sm:px-6 sm:py-28 xl:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 xl:grid-cols-[0.9fr_1.1fr] xl:items-end">
          <h2 className="max-w-3xl text-4xl font-semibold leading-tight text-foreground sm:text-6xl">
            {home.openingQuestion.title}
          </h2>
          <p className="max-w-reading text-xl leading-9 text-foreground/78">
            {home.openingQuestion.body}
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-surface/42 px-4 py-16 sm:px-6 sm:py-24 xl:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              {home.tensions.eyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-foreground sm:text-5xl">
              {home.tensions.title}
            </h2>
          </div>
          <div className="mt-10 grid gap-4 xl:grid-cols-3">
            {home.tensions.items.map((item, index) => (
              <article
                key={item.title}
                className="min-h-64 border border-border bg-background/42 p-6"
              >
                <p className="text-sm font-semibold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-10 text-2xl font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-4 leading-7 text-foreground/76">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 sm:py-28 xl:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-semibold leading-tight text-foreground sm:text-5xl">
                {home.athleteTeaser.headline}
              </h2>
              <p className="mt-5 max-w-reading text-lg leading-8 text-foreground/76">
                {home.athleteTeaser.body}
              </p>
            </div>
            <Link
              href={localizedPath(locale, "/athletes")}
              className="inline-flex min-h-12 items-center justify-center rounded-sm border border-primary px-5 py-3 text-sm font-semibold uppercase tracking-wide text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              {home.athleteTeaser.cta}
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {athletes.map((athlete, index) => (
              <Link
                key={athlete.slug}
                href={localizedPath(locale, `/athletes/${athlete.slug}`)}
                className="group min-h-72 border border-border bg-surface p-4 transition hover:-translate-y-1 hover:border-primary focus-visible:rounded-sm"
              >
                <article className="flex h-full flex-col">
                  <div
                    className={cn(
                      "relative aspect-square overflow-hidden bg-background",
                      index % 2 === 0 && "bg-surface-muted",
                    )}
                    aria-hidden="true"
                  >
                    {athlete.images.portrait ? (
                      <Image
                        src={athlete.images.portrait}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 20vw, (min-width: 640px) 50vw, 100vw"
                        className={cn(
                          "object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none",
                          getAthleteTeaserImagePosition(athlete.slug),
                        )}
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-[linear-gradient(140deg,var(--surface)_0%,transparent_45%,var(--primary)_46%,var(--accent)_100%)] opacity-70" />
                        <div className="absolute bottom-0 left-0 h-1/2 w-full bg-[linear-gradient(16deg,var(--background)_0%,var(--surface)_58%,transparent_59%)]" />
                      </>
                    )}
                  </div>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    {home.athleteTeaser.cardLabel}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-foreground">
                    {athlete.name}
                  </h3>
                  <p className="mt-auto pt-6 text-sm text-foreground/62">
                    {formatCountry(athlete.country, countryLabels)}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface/55 px-4 py-20 sm:px-6 sm:py-28 xl:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 xl:grid-cols-[0.85fr_1.15fr] xl:items-start">
          <div>
            <h2 className="text-3xl font-semibold leading-tight text-foreground sm:text-5xl">
              {home.research.headline}
            </h2>
            <p className="mt-5 max-w-reading text-lg leading-8 text-foreground/76">
              {home.research.body}
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {home.research.methods.map((method) => (
              <li
                key={method}
                className="border border-border bg-background/42 px-5 py-4 text-lg font-semibold text-foreground"
              >
                {method}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 sm:py-28 xl:px-10">
        <div className="mx-auto max-w-7xl border-l-4 border-primary py-2 pl-6 sm:pl-10">
          <h2 className="max-w-4xl text-4xl font-semibold leading-tight text-foreground sm:text-6xl">
            {home.finalCta.headline}
          </h2>
          <p className="mt-5 max-w-reading text-lg leading-8 text-foreground/78">
            {home.finalCta.text}
          </p>
          <Link
            href={localizedPath(locale, "/sport")}
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-sm bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition hover:bg-primary/88"
          >
            {home.finalCta.button}
          </Link>
        </div>
      </section>
    </main>
  );
}

function formatCountry(country: string | null, labels: Record<string, string>) {
  return country ? (labels[country] ?? country) : null;
}

function getAthleteTeaserImagePosition(slug: string) {
  switch (slug) {
    case "lukas-loibl":
      return "object-[center_34%]";
    case "niclas-strohmeier":
      return "object-[center_58%]";
    case "josef-braun":
      return "object-[center_28%]";
    case "tim-howell":
      return "object-[center_42%]";
    case "marcel-geser":
      return "object-[center_48%]";
    default:
      return "object-center";
  }
}
