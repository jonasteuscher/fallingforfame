import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  AthleteArticlesSection,
  AthleteBaseStory,
  AthleteHero,
  AthleteLinksSection,
  AthleteMediaSection,
  AthletePortraitIntro,
  AthleteQuoteSection,
  AthleteSponsorsSection,
  MoreAthletes,
} from "@/components/athletes";
import { AthleteExperienceCards } from "@/components/scrollytelling";
import { athletes, getAthleteBySlug } from "@/data/athletes";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { Athlete } from "@/types/athlete";

type AthletePageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

const pageLabels = {
  en: {
    scrollHint: "Scroll the profile",
    experienceTitle: "Experience",
    profileMeta: {
      age: "Age",
      country: "Country",
      residence: "Residence",
      profession: "Profession",
      role: "Role",
      platforms: "Platforms",
      disciplines: "Primary Disciplines",
    },
    cardMeta: { profession: "Profession", role: "Role", primary: "Primary" },
    baseStoryTitle: "Where It All Began",
    quotesTitle: "Interview Quotes",
    quotesEmpty: "Selected interview quotes will appear here.",
    audioTitle: "Audio Interviews",
    audioEmpty: "Audio excerpts from the interviews will be added here.",
    videoTitle: "Video Interviews & Jumps",
    videoEmpty: "Video material will be added here.",
    linksTitle: "Profiles & External Links",
    linksEmpty: "Profile links will be added once confirmed.",
    articlesTitle: "Articles & Media Coverage",
    articlesEmpty: "Links to articles, podcasts and interviews will be added here.",
    sponsorsTitle: "Sponsors",
    sponsorsEmpty: "Sponsor information will be added once confirmed.",
    moreTitle: "More Athlete Stories",
  },
  de: {
    scrollHint: "Profil entdecken",
    experienceTitle: "Erfahrung",
    profileMeta: {
      age: "Alter",
      country: "Land",
      residence: "Wohnsitz",
      profession: "Beruf",
      role: "Rolle",
      platforms: "Plattformen",
      disciplines: "Primäre Disziplinen",
    },
    cardMeta: { profession: "Beruf", role: "Rolle", primary: "Disziplin" },
    baseStoryTitle: "Wie alles begann",
    quotesTitle: "Interviewzitate",
    quotesEmpty: "Ausgewählte Interviewzitate erscheinen hier.",
    audioTitle: "Audio-Interviews",
    audioEmpty: "Audioausschnitte aus den Interviews werden hier ergänzt.",
    videoTitle: "Video-Interviews & Sprünge",
    videoEmpty: "Videomaterial wird hier ergänzt.",
    linksTitle: "Profile & Externe Links",
    linksEmpty: "Profil-Links werden ergänzt, sobald sie bestätigt sind.",
    articlesTitle: "Artikel & Medienberichte",
    articlesEmpty:
      "Links zu Artikeln, Podcasts und Interviews werden hier ergänzt.",
    sponsorsTitle: "Sponsoren",
    sponsorsEmpty:
      "Sponsoring-Informationen werden ergänzt, sobald sie bestätigt sind.",
    moreTitle: "Weitere Athletenporträts",
  },
} as const;

export async function generateMetadata({
  params,
}: AthletePageProps): Promise<Metadata> {
  const { slug } = await params;
  const athlete = getAthleteBySlug(slug);

  return {
    title: athlete ? `${athlete.name} | Falling for Fame` : "Athlete",
  };
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    athletes.map((athlete) => ({
      locale,
      slug: athlete.slug,
    })),
  );
}

export default async function AthletePage({ params }: AthletePageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const athlete = getAthleteBySlug(slug);

  if (!athlete) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const labels = pageLabels[locale];
  const athleteMeta = formatAthleteMeta(athlete, dictionary.athleteMeta);
  const country = formatCountry(athlete.country, dictionary.athleteMeta.countryNames);
  const moreAthletes = athletes.filter((item) => item.slug !== athlete.slug);

  return (
    <>
      <AthleteHero
        athlete={athlete}
        title={athlete.content[locale].title}
        meta={athleteMeta}
        scrollHint={labels.scrollHint}
      />

      <AthletePortraitIntro
        athlete={athlete}
        locale={locale}
        placeholder={dictionary.site.athletes.portraitPlaceholder}
        country={country}
        labels={labels.profileMeta}
        sponsoredLabels={dictionary.athleteExperience}
        unknown={dictionary.athleteExperience.unknown}
      />

      <section className="border-t border-border px-4 py-20 sm:px-6 sm:py-28 xl:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-10 text-4xl font-semibold leading-tight text-foreground sm:text-6xl">
            {labels.experienceTitle}
          </h2>
          <AthleteExperienceCards
            experience={athlete.experience}
            labels={dictionary.athleteExperience}
            locale={locale}
          />
        </div>
      </section>

      <AthleteBaseStory
        athlete={athlete}
        locale={locale}
        title={labels.baseStoryTitle}
      />

      <AthleteQuoteSection
        athlete={athlete}
        locale={locale}
        title={labels.quotesTitle}
        emptyText={labels.quotesEmpty}
      />

      <AthleteMediaSection
        locale={locale}
        title={labels.audioTitle}
        emptyText={labels.audioEmpty}
        audio={athlete.audio}
      />

      <AthleteMediaSection
        locale={locale}
        title={labels.videoTitle}
        emptyText={labels.videoEmpty}
        video={athlete.video}
      />

      <AthleteLinksSection
        links={athlete.links}
        title={labels.linksTitle}
        emptyText={labels.linksEmpty}
      />

      <AthleteArticlesSection
        articles={athlete.articles}
        locale={locale}
        title={labels.articlesTitle}
        emptyText={labels.articlesEmpty}
      />

      <AthleteSponsorsSection
        sponsors={athlete.sponsors}
        title={labels.sponsorsTitle}
        summary={athlete.sponsorship[locale]}
      />

      <MoreAthletes
        athletes={moreAthletes}
        locale={locale}
        title={labels.moreTitle}
        cta={dictionary.site.athletes.gridCta}
        placeholder={dictionary.site.athletes.portraitPlaceholder}
        countryLabels={dictionary.athleteMeta.countryNames}
        cardLabels={labels.cardMeta}
      />
    </>
  );
}

function formatCountry(country: string | null, labels: Record<string, string>) {
  return country ? (labels[country] ?? country) : null;
}

function formatAthleteMeta(
  athlete: Athlete,
  labels: {
    from: string;
    fromUnknown: string;
    ageUnknown: string;
    years: string;
    countries: Record<string, string>;
  },
) {
  const country = athlete.country
    ? (labels.countries[athlete.country] ?? athlete.country)
    : null;
  const countryText = country ? `${labels.from} ${country}` : labels.fromUnknown;
  const ageText =
    athlete.age === null ? labels.ageUnknown : `${athlete.age} ${labels.years}`;

  return `${countryText} | ${ageText}`;
}
