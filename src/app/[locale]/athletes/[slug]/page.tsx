import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  AthleteArticlesSection,
  AthleteBaseStory,
  AthleteGallerySection,
  AthleteHero,
  AthleteLinksSection,
  AthleteMediaSection,
  AthleteProfileOverview,
  AthleteQuoteSection,
  AthleteSponsorsSection,
  MoreAthletes,
} from "@/components/athletes";
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
    profileOverview: {
      eyebrow: "Profile",
      title: "Profile and Experience",
      portraitAlt: (name: string) => `${name} portrait`,
      baseSince: "BASE since",
      baseJumps: "BASE jumps",
      skydives: "Skydives",
      reach: "Reach",
      sponsorship: "Sponsorship",
    },
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
    galleryTitle: "Photo Gallery",
    galleryEmpty: "Photo material will be added here.",
    quotesTitle: "Interview Quotes",
    quotesEmpty: "Selected interview quotes will appear here.",
    audioTitle: "Audio Interviews",
    audioEmpty: "Audio excerpts from the interviews will be added here.",
    videoTitle: "Video Interviews & Jumps",
    videoEmpty: "Video material will be added here.",
    linksTitle: "Personal Links & Socials",
    linksEmpty: "Profile links will be added once confirmed.",
    articlesTitle: "Articles & Media Coverage",
    articlesEmpty: "Links to articles, podcasts and interviews will be added here.",
    sponsorsTitle: "Sponsors & Partnerships",
    sponsorsEmpty: "Sponsor information will be added once confirmed.",
    moreTitle: "More Athlete Stories",
  },
  de: {
    scrollHint: "Profil entdecken",
    profileOverview: {
      eyebrow: "Profil",
      title: "Profil und Erfahrung",
      portraitAlt: (name: string) => `Porträt von ${name}`,
      baseSince: "BASE seit",
      baseJumps: "BASE Jumps",
      skydives: "Skydives",
      reach: "Reichweite",
      sponsorship: "Sponsoring",
    },
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
    galleryTitle: "Fotogalerie",
    galleryEmpty: "Fotomaterial wird hier ergänzt.",
    quotesTitle: "Interviewzitate",
    quotesEmpty: "Ausgewählte Interviewzitate erscheinen hier.",
    audioTitle: "Audio-Interviews",
    audioEmpty: "Audioausschnitte aus den Interviews werden hier ergänzt.",
    videoTitle: "Video-Interviews & Sprünge",
    videoEmpty: "Videomaterial wird hier ergänzt.",
    linksTitle: "Persönliche Links & Social Media",
    linksEmpty: "Profil-Links werden ergänzt, sobald sie bestätigt sind.",
    articlesTitle: "Artikel & Medienberichte",
    articlesEmpty:
      "Links zu Artikeln, Podcasts und Interviews werden hier ergänzt.",
    sponsorsTitle: "Sponsoren & Partnerschaften",
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
  const moreAthletes = athletes.filter((item) => item.slug !== athlete.slug);

  return (
    <>
      <AthleteHero
        athlete={athlete}
        title={athlete.content[locale].title}
        meta={athleteMeta}
        quote={athlete.heroQuote[locale]}
        scrollHint={labels.scrollHint}
      />

      <AthleteProfileOverview
        athlete={athlete}
        locale={locale}
        portraitAlt={labels.profileOverview.portraitAlt(athlete.name)}
        portraitPlaceholder={dictionary.site.athletes.portraitPlaceholder}
        labels={{
          eyebrow: labels.profileOverview.eyebrow,
          title: labels.profileOverview.title,
          baseSince: labels.profileOverview.baseSince,
          baseJumps: labels.profileOverview.baseJumps,
          skydives: labels.profileOverview.skydives,
          reach: labels.profileOverview.reach,
          sponsorship: labels.profileOverview.sponsorship,
          profession: labels.profileMeta.profession,
          role: labels.profileMeta.role,
          disciplines: labels.profileMeta.disciplines,
          unknown: dictionary.athleteExperience.unknown,
          yes: dictionary.athleteExperience.yes,
          no: dictionary.athleteExperience.no,
        }}
      />

      <AthleteBaseStory
        athlete={athlete}
        locale={locale}
        title={labels.baseStoryTitle}
      />

      <AthleteGallerySection
        images={athlete.images.gallery}
        locale={locale}
        title={labels.galleryTitle}
        emptyText={labels.galleryEmpty}
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
      />

      <AthleteArticlesSection
        articles={athlete.articles}
        locale={locale}
        title={labels.articlesTitle}
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
