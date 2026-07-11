import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  AthleteArticlesSection,
  AthleteBaseStory,
  AthleteFindingsLinkSection,
  AthleteGallerySection,
  AthleteHero,
  AthleteLinksSection,
  AthleteNarrativeNav,
  AthleteProfileOverview,
  AthleteSponsorsSection,
  AudioStory,
  FutureProjectFeature,
  InterviewFeature,
  MoreAthletes,
  ScrollScrubVideo,
} from "@/components/athletes";
import { athletes, getAthleteBySlug } from "@/data/athletes";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { Athlete, AthleteInterviewFeature } from "@/types/athlete";

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
    galleryViewAll: "View full gallery",
    galleryShowLess: "Show curated selection",
    galleryEmpty: "Photo material will be added here.",
    linksTitle: "Personal Links & Socials",
    linksEmpty: "Profile links will be added once confirmed.",
    articlesTitle: "Articles & Media Coverage",
    articlesViewAll: "View all coverage",
    articlesShowLess: "Show less",
    articlesEmpty: "Links to articles, podcasts and interviews will be added here.",
    sponsorsTitle: "Sponsors & Partnerships",
    sponsorsEmpty: "Sponsor information will be added once confirmed.",
    findingsLink: {
      eyebrow: "Research Findings",
      title: "From Profile To Findings",
      body: (name: string) =>
        `Explore how ${possessiveName(name)} perspective relates to the wider research findings.`,
      cta: "Explore Findings",
    },
    moreTitle: "More Athlete Stories",
    continuationTitle: "Continue with another perspective",
    narrativeNavLabel: "Tim Howell profile sections",
    narrativeActs: {
      person: "Person",
      attraction: "Attraction",
      publicImage: "Public Image",
      decision: "Decision",
      future: "Future",
    },
    interviewFeature: {
      play: (title: string) => `Play ${title}`,
      fullscreen: (title: string) => `Open ${title} fullscreen`,
      exitFullscreen: (title: string) => `Exit ${title} fullscreen`,
    },
  },
  de: {
    scrollHint: "Profil entdecken",
    profileOverview: {
      eyebrow: "Profil",
      title: "Profil und Erfahrung",
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
    galleryViewAll: "Ganze Galerie anzeigen",
    galleryShowLess: "Kuratierte Auswahl anzeigen",
    galleryEmpty: "Fotomaterial wird hier ergänzt.",
    linksTitle: "Persönliche Links & Social Media",
    linksEmpty: "Profil-Links werden ergänzt, sobald sie bestätigt sind.",
    articlesTitle: "Artikel & Medienberichte",
    articlesViewAll: "Alle Berichte anzeigen",
    articlesShowLess: "Weniger anzeigen",
    articlesEmpty:
      "Links zu Artikeln, Podcasts und Interviews werden hier ergänzt.",
    sponsorsTitle: "Sponsoren & Partnerschaften",
    sponsorsEmpty:
      "Sponsoring-Informationen werden ergänzt, sobald sie bestätigt sind.",
    findingsLink: {
      eyebrow: "Erkenntnisse",
      title: "Vom Porträt zu den Erkenntnissen",
      body: (name: string) =>
        `Entdecke, wie die Perspektive von ${name} mit den weiteren Forschungserkenntnissen zusammenhängt.`,
      cta: "Erkenntnisse öffnen",
    },
    moreTitle: "Weitere Athletenporträts",
    continuationTitle: "Mit einer anderen Perspektive weitergehen",
    narrativeNavLabel: "Tim Howell Profilabschnitte",
    narrativeActs: {
      person: "Person",
      attraction: "Anziehung",
      publicImage: "Öffentlichkeit",
      decision: "Entscheidung",
      future: "Zukunft",
    },
    interviewFeature: {
      play: (title: string) => `${title} abspielen`,
      fullscreen: (title: string) => `${title} im Vollbild öffnen`,
      exitFullscreen: (title: string) => `${title} Vollbild verlassen`,
    },
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
  const renderInterviewFeatures = (
    placement: AthleteInterviewFeature["placement"],
  ) =>
    (athlete.interviewFeatures ?? [])
      .filter((feature) => feature.placement === placement)
      .map((feature) => (
        <InterviewFeature
          key={feature.id}
          feature={feature}
          locale={locale}
          labels={formatInterviewLabels(feature, locale, labels.interviewFeature)}
        />
      ));
  const isTimHowell = athlete.slug === "tim-howell";
  const narrativeNavItems = [
    { id: "person", label: labels.narrativeActs.person },
    { id: "attraction", label: labels.narrativeActs.attraction },
    { id: "public-image", label: labels.narrativeActs.publicImage },
    { id: "decision", label: labels.narrativeActs.decision },
    { id: "future", label: labels.narrativeActs.future },
  ];

  return (
    <>
      {isTimHowell ? (
        <AthleteNarrativeNav
          items={narrativeNavItems}
          ariaLabel={labels.narrativeNavLabel}
        />
      ) : null}

      <div id={isTimHowell ? "person" : undefined} className="scroll-mt-20">
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
          portraitAlt={getAthletePortraitAlt(athlete, locale)}
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
      </div>

      <div id={isTimHowell ? "attraction" : undefined} className="scroll-mt-20">
        <AthleteBaseStory
          athlete={athlete}
          locale={locale}
          title={labels.baseStoryTitle}
        />
      </div>

      <div id={isTimHowell ? "public-image" : undefined} className="scroll-mt-20">
        {renderInterviewFeatures("after-origin")}
      </div>

      <div id={isTimHowell ? "decision" : undefined} className="scroll-mt-20">
        <ScrollScrubVideo video={athlete.scrollVideo} locale={locale} />

        {(athlete.audioStories ?? [])
          .filter((story) => story.placement === "after-gallery")
          .map((story) => (
            <AudioStory key={story.id} story={story} locale={locale} />
          ))}

        {renderInterviewFeatures("after-gallery")}
      </div>

      <AthleteGallerySection
        images={athlete.images.gallery}
        locale={locale}
        title={labels.galleryTitle}
        emptyText={labels.galleryEmpty}
        initialVisibleCount={isTimHowell ? 9 : undefined}
        viewAllLabel={labels.galleryViewAll}
        showLessLabel={labels.galleryShowLess}
        variant={isTimHowell ? "editorial" : "grid"}
      />

      <div id={isTimHowell ? "future" : undefined} className="scroll-mt-20">
        <FutureProjectFeature athlete={athlete} locale={locale} />
      </div>

      <AthleteLinksSection
        links={athlete.links}
        title={labels.linksTitle}
        compact={isTimHowell}
      />

      <AthleteArticlesSection
        articles={athlete.articles}
        locale={locale}
        title={labels.articlesTitle}
        viewAllLabel={labels.articlesViewAll}
        showLessLabel={labels.articlesShowLess}
        compact={isTimHowell}
        initialVisibleCount={isTimHowell ? 3 : undefined}
      />

      <AthleteSponsorsSection
        sponsors={athlete.sponsors}
        title={labels.sponsorsTitle}
        summary={athlete.sponsorship[locale]}
        compact={isTimHowell}
      />

      <AthleteFindingsLinkSection
        locale={locale}
        eyebrow={labels.findingsLink.eyebrow}
        title={labels.findingsLink.title}
        body={labels.findingsLink.body(firstName(athlete.name))}
        cta={labels.findingsLink.cta}
      />

      <MoreAthletes
        athletes={moreAthletes}
        locale={locale}
        title={isTimHowell ? labels.continuationTitle : labels.moreTitle}
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

function formatInterviewLabels(
  feature: AthleteInterviewFeature,
  locale: Locale,
  labels: {
    play: (title: string) => string;
    fullscreen: (title: string) => string;
    exitFullscreen: (title: string) => string;
  },
) {
  const title = feature.iframeTitle[locale];

  return {
    play: labels.play(title),
    fullscreen: labels.fullscreen(title),
    exitFullscreen: labels.exitFullscreen(title),
  };
}

function firstName(name: string) {
  return name.split(" ")[0] ?? name;
}

function possessiveName(name: string) {
  return name.endsWith("s") ? `${name}'` : `${name}'s`;
}

function getAthletePortraitAlt(athlete: Athlete, locale: Locale) {
  const descriptions: Record<string, { en: string; de: string }> = {
    "tim-howell": {
      en: "Tim Howell wearing a cap and harness in front of mountains",
      de: "Tim Howell mit Kappe und Gurtzeug vor Bergen",
    },
    "lukas-loibl": {
      en: "Lukas Loibl smiling in a yellow jacket outdoors",
      de: "Lukas Loibl lächelt draussen in einer gelben Jacke",
    },
    "marcel-geser": {
      en: "Marcel Geser wearing a helmet and blue wingsuit gear",
      de: "Marcel Geser mit Helm und blauer Wingsuit-Ausrüstung",
    },
    "niclas-strohmeier": {
      en: "Niclas Strohmeier in a white helmet flying close to green cliffs",
      de: "Niclas Strohmeier mit weissem Helm fliegt nah an grünen Felsen",
    },
    "josef-braun": {
      en: "Josef Braun smiling with parachute gear in a wooded area",
      de: "Josef Braun lächelt mit Fallschirmausrüstung in einem Waldgebiet",
    },
  };

  return descriptions[athlete.slug]?.[locale] ?? athlete.name;
}
