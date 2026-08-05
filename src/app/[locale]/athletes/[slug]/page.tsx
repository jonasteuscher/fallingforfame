import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AthletePage as AthletePageTemplate } from "@/components/athletes";
import { athletes, getAthleteBySlug } from "@/data/athletes";
import { defaultLocale, isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { Athlete, AthletePageSectionConfig } from "@/types/athlete";
import type {
  AthleteSection,
  ProgressSection,
} from "@/components/athletes/AthleteDocumentaryPage";
import { createLocalizedMetadata } from "@/lib/metadata";

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
      reach: "Audience",
      sponsorship: "Sponsorship",
      statsNote: "(as of Spring 2026)",
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
    findingsLink: {
      eyebrow: "Research Findings",
      title: "From Profile To Findings",
      body: (name: string) =>
        `Explore how ${possessiveName(name)} perspective relates to the wider research findings.`,
      cta: "Explore Findings",
    },
    moreTitle: "More Athlete Portraits",
    narrativeNavLabel: "Tim Howell profile sections",
    narrativeActs: {
      person: "Person",
      attraction: "Attraction",
      publicImage: "Public Image",
      decision: "Decision",
      future: "Future",
      biography: "Biography",
      career: "Career",
      audioStory: "Audio Story",
      gallery: "Gallery",
      worldRecord: "World Record",
      socialMedia: "Social Media",
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
      statsNote: "(Stand Frühjahr 2026)",
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
    articlesEmpty: "Links zu Artikeln, Podcasts und Interviews werden hier ergänzt.",
    findingsLink: {
      eyebrow: "Erkenntnisse",
      title: "Vom Porträt zu den Erkenntnissen",
      body: (name: string) =>
        `Entdecke, wie die Perspektive von ${name} mit den weiteren Forschungserkenntnissen zusammenhängt.`,
      cta: "Erkenntnisse öffnen",
    },
    moreTitle: "Weitere Athletenporträts",
    narrativeNavLabel: "Tim Howell Profilabschnitte",
    narrativeActs: {
      person: "Person",
      attraction: "Anziehung",
      publicImage: "Öffentlichkeit",
      decision: "Entscheidung",
      future: "Zukunft",
      biography: "Biografie",
      career: "Karriere",
      audioStory: "Social Media & Sponsoring",
      gallery: "Galerie",
      worldRecord: "Weltrekord",
      socialMedia: "Social Media",
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
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const athlete = getAthleteBySlug(slug);

  const title = athlete
    ? athlete.name
    : locale === "de"
      ? "Athlet:in"
      : "Athlete";

  return createLocalizedMetadata({
    locale,
    path: `/athletes/${slug}`,
    title,
    description:
      athlete?.content[locale].shortBio ??
      (locale === "de" ? "Athletenporträt" : "Athlete profile"),
  });
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
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const athlete = getAthleteBySlug(slug);

  if (!athlete) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const labels = pageLabels[locale];
  const athleteMeta = formatAthleteMeta(athlete, dictionary.athleteMeta);
  const moreAthletes = athletes.filter((item) => item.slug !== athlete.slug);
  const progressSections = buildProgressSections(athlete, locale);
  const sections = buildAthleteSections(athlete);

  return (
    <AthletePageTemplate
      athlete={athlete}
      locale={locale}
      title={athlete.content[locale].title}
      meta={athleteMeta}
      scrollHint={labels.scrollHint}
      profile={{
        portraitAlt: getAthletePortraitAlt(athlete, locale),
        portraitPlaceholder: dictionary.site.athletes.portraitPlaceholder,
        labels: {
          eyebrow: labels.profileOverview.eyebrow,
          title: labels.profileOverview.title,
          baseSince: labels.profileOverview.baseSince,
          baseJumps: labels.profileOverview.baseJumps,
          skydives: labels.profileOverview.skydives,
          reach: labels.profileOverview.reach,
          sponsorship: labels.profileOverview.sponsorship,
          statsNote: labels.profileOverview.statsNote,
          profession: labels.profileMeta.profession,
          role: labels.profileMeta.role,
          disciplines: labels.profileMeta.disciplines,
          unknown: dictionary.athleteExperience.unknown,
          yes: dictionary.athleteExperience.yes,
          no: dictionary.athleteExperience.no,
        },
      }}
      originTitle={labels.baseStoryTitle}
      sections={sections}
      progressSections={progressSections}
      navAriaLabel={getNarrativeNavLabel(athlete, labels, locale)}
      sectionLabels={{
        galleryTitle: labels.galleryTitle,
        galleryEmpty: labels.galleryEmpty,
        galleryViewAll: labels.galleryViewAll,
        galleryShowLess: labels.galleryShowLess,
        linksTitle: labels.linksTitle,
        articlesTitle: labels.articlesTitle,
        articlesViewAll: labels.articlesViewAll,
        articlesShowLess: labels.articlesShowLess,
        interviewFeature: labels.interviewFeature,
        findingsLink: {
          eyebrow: labels.findingsLink.eyebrow,
          title: labels.findingsLink.title,
          body: labels.findingsLink.body(firstName(athlete.name)),
          cta: labels.findingsLink.cta,
        },
        moreTitle: labels.moreTitle,
        moreCta: dictionary.site.athletes.gridCta,
        portraitPlaceholder: dictionary.site.athletes.portraitPlaceholder,
        countryLabels: dictionary.athleteMeta.countryNames,
        cardLabels: labels.cardMeta,
      }}
      moreAthletes={moreAthletes}
    />
  );
}

type AthletePageLabels = (typeof pageLabels)[Locale];

function buildProgressSections(athlete: Athlete, locale: Locale) {
  return (athlete.page?.progress ?? []).map<ProgressSection>((section) => ({
    id: section.id,
    label: section.label[locale],
    includeInProgress: section.includeInProgress ?? true,
  }));
}

function buildAthleteSections(athlete: Athlete) {
  const sections = athlete.page?.sections ?? defaultAthletePageSections;

  return sections.flatMap<AthleteSection>((section) => {
    switch (section.type) {
      case "interview-video": {
        const feature = findInterviewFeature(athlete, section.featureId);

        return feature
          ? [
              {
                id: section.id,
                type: "interview-video",
                feature,
                layout: section.layout ?? "stacked",
                spacing: section.spacing ?? "immersive",
                includeInProgress: section.includeInProgress ?? true,
              },
            ]
          : [];
      }

      case "audio-story": {
        const story = findAudioStory(athlete, section.storyId);

        return story
          ? [
              {
                id: section.id,
                type: "audio-story",
                story,
                spacing: section.spacing ?? "standard",
                includeInProgress: section.includeInProgress,
              },
            ]
          : [];
      }

      case "scroll-video":
        return [
          {
            id: section.id,
            type: "scroll-video",
            video: athlete.scrollVideo,
            spacing: section.spacing ?? "immersive",
            includeInProgress: section.includeInProgress ?? true,
          },
        ];

      case "local-video": {
        const feature = athlete.localVideoFeatures?.find(
          (item) => item.id === section.featureId,
        );

        return feature
          ? [
              {
                id: section.id,
                type: "local-video",
                feature,
                spacing: section.spacing ?? "immersive",
                includeInProgress: section.includeInProgress ?? true,
              },
            ]
          : [];
      }

      case "project-feature":
        return [
          {
            id: section.id,
            type: "project-feature",
            project:
              section.project === "future"
                ? athlete.futureProject
                : athlete.currentProject,
            status:
              section.status ?? (section.project === "future" ? "future" : "current"),
            spacing: section.spacing ?? "immersive",
            includeInProgress: section.includeInProgress ?? true,
          },
        ];

      case "gallery":
        return [
          {
            id: section.id,
            type: "gallery",
            images: athlete.images.gallery,
            spacing: section.spacing ?? "standard",
            includeInProgress: section.includeInProgress ?? true,
          },
        ];

      case "social-media":
        return [
          {
            id: section.id,
            type: "social-media",
            links: athlete.links,
            spacing: section.spacing ?? "compact",
            includeInProgress: section.includeInProgress,
          },
        ];

      case "media-coverage":
        return [
          {
            id: section.id,
            type: "media-coverage",
            articles: athlete.articles,
            spacing: section.spacing ?? "compact",
            includeInProgress: section.includeInProgress,
          },
        ];

      default:
        return assertNever(section);
    }
  });
}

const defaultAthletePageSections: AthletePageSectionConfig[] = [
  { type: "gallery", id: "gallery", spacing: "standard" },
  { type: "social-media", id: "social-media", spacing: "compact" },
  { type: "media-coverage", id: "media-coverage", spacing: "compact" },
];

function findInterviewFeature(athlete: Athlete, featureId: string) {
  return athlete.interviewFeatures?.find((feature) => feature.id === featureId);
}

function findAudioStory(athlete: Athlete, storyId?: string) {
  const stories = athlete.audioStories ?? [];

  return storyId
    ? stories.find((story) => story.id === storyId)
    : stories.find((story) => story.placement === "after-gallery");
}

function getNarrativeNavLabel(
  athlete: Athlete,
  labels: AthletePageLabels,
  locale: Locale,
) {
  return athlete.page?.navAriaLabel?.[locale] ?? labels.narrativeNavLabel;
}

function assertNever(value: never): never {
  throw new Error(`Unsupported athlete page section config: ${JSON.stringify(value)}`);
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
      en: "Josef Braun smiling with a helmet and camera gear in a wooded area",
      de: "Josef Braun lächelt mit Helm und Kameraausrüstung in einem Waldgebiet",
    },
  };

  return descriptions[athlete.slug]?.[locale] ?? athlete.name;
}
