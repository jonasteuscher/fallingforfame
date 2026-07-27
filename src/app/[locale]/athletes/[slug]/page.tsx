import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  AthleteDocumentaryPage,
} from "@/components/athletes";
import { athletes, getAthleteBySlug } from "@/data/athletes";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type {
  Athlete,
  AthleteInterviewFeature,
} from "@/types/athlete";
import type {
  AthleteSection,
  ProgressSection,
} from "@/components/athletes/AthleteDocumentaryPage";

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
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const athlete = getAthleteBySlug(slug);

  return {
    title: {
      absolute: athlete
        ? `${athlete.name} – ${getAthleteSeoRole(athlete, locale)} | Falling for Fame?`
        : "Athlete | Falling for Fame?",
    },
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
  const progressSections = buildProgressSections(athlete, labels, locale);
  const sections = buildAthleteSections(athlete);

  return (
    <AthleteDocumentaryPage
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
      navAriaLabel={getNarrativeNavLabel(athlete, labels)}
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

type AthletePageSectionConfig = {
  navAriaLabel: (labels: AthletePageLabels) => string;
  progress: Array<{
    id: string;
    label: (labels: AthletePageLabels, locale: Locale, athlete: Athlete) => string;
  }>;
  sections: Array<
    | { type: "interview-video"; id: string; featureId: string }
    | { type: "audio-story"; id: string; storyId?: string }
    | { type: "scroll-video"; id: string }
    | { type: "project-feature"; id: string; project: "future" | "current" }
    | { type: "gallery"; id: string }
    | { type: "social-media"; id: string }
    | { type: "media-coverage"; id: string }
  >;
};

const athletePageSectionConfigs: Record<string, AthletePageSectionConfig> = {
  "tim-howell": {
    navAriaLabel: (labels) => labels.narrativeNavLabel,
    progress: [
      { id: "person", label: (labels) => labels.narrativeActs.biography },
      { id: "attraction", label: (labels) => labels.narrativeActs.career },
      { id: "public-image", label: (labels) => labels.narrativeActs.publicImage },
      { id: "decision", label: (labels) => labels.narrativeActs.decision },
      { id: "gallery", label: (labels) => labels.narrativeActs.gallery },
      { id: "future", label: (labels) => labels.narrativeActs.future },
    ],
    sections: [
      { type: "interview-video", id: "public-image", featureId: "career" },
      { type: "scroll-video", id: "decision" },
      { type: "audio-story", id: "audio-story" },
      {
        type: "interview-video",
        id: "decision-making",
        featureId: "decision-making",
      },
      { type: "gallery", id: "gallery" },
      { type: "project-feature", id: "future", project: "future" },
      { type: "social-media", id: "social-media" },
      { type: "media-coverage", id: "media-coverage" },
    ],
  },
  "lukas-loibl": {
    navAriaLabel: () => "Lukas Loibl profile sections",
    progress: [
      { id: "biography", label: (labels) => labels.narrativeActs.biography },
      { id: "career", label: (labels) => labels.narrativeActs.career },
      {
        id: "planning-comes-first",
        label: (_labels, locale) =>
          locale === "de" ? "Planung zuerst" : "Planning first",
      },
      {
        id: "audio-story",
        label: (_labels, locale) =>
          locale === "de"
            ? "Social Media & Sponsoring"
            : "Social media & sponsorship",
      },
      { id: "world-record", label: (labels) => labels.narrativeActs.worldRecord },
      {
        id: "the-mountain-will-still-be-here",
        label: (_labels, locale) =>
          locale === "de" ? "Nicht springen" : "Not jumping",
      },
      { id: "gallery", label: (labels) => labels.narrativeActs.gallery },
    ],
    sections: [
      {
        type: "interview-video",
        id: "planning-comes-first",
        featureId: "planning-comes-first",
      },
      { type: "audio-story", id: "audio-story" },
      { type: "project-feature", id: "world-record", project: "current" },
      {
        type: "interview-video",
        id: "the-mountain-will-still-be-here",
        featureId: "the-mountain-will-still-be-here",
      },
      { type: "gallery", id: "gallery" },
      { type: "social-media", id: "social-media" },
      { type: "media-coverage", id: "media-coverage" },
    ],
  },
};

function buildProgressSections(
  athlete: Athlete,
  labels: AthletePageLabels,
  locale: Locale,
) {
  const config = getAthletePageSectionConfig(athlete);

  return config.progress.map<ProgressSection>((section) => ({
    id: section.id,
    label: section.label(labels, locale, athlete),
    includeInProgress: true,
  }));
}

function buildAthleteSections(athlete: Athlete) {
  const config = getAthletePageSectionConfig(athlete);

  return config.sections.flatMap<AthleteSection>((section) => {
    switch (section.type) {
      case "interview-video": {
        const feature = findInterviewFeature(athlete, section.featureId);

        return feature
          ? [
              {
                id: section.id,
                type: "interview-video",
                feature,
                layout: getInterviewLayoutConfig(athlete, feature),
                spacing: "immersive",
                includeInProgress: true,
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
                spacing: "standard",
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
            spacing: "immersive",
            includeInProgress: true,
          },
        ];

      case "project-feature":
        return [
          {
            id: section.id,
            type: "project-feature",
            project:
              section.project === "future"
                ? athlete.futureProject
                : athlete.currentProject,
            status: section.project === "future" ? "future" : "current",
            spacing: "immersive",
            includeInProgress: true,
          },
        ];

      case "gallery":
        return [
          {
            id: section.id,
            type: "gallery",
            images: athlete.images.gallery,
            spacing: "standard",
            includeInProgress: true,
          },
        ];

      case "social-media":
        return [
          {
            id: section.id,
            type: "social-media",
            links: athlete.links,
            spacing: "compact",
          },
        ];

      case "media-coverage":
        return [
          {
            id: section.id,
            type: "media-coverage",
            articles: athlete.articles,
            spacing: "compact",
          },
        ];

      default:
        return assertNever(section);
    }
  });
}

function getAthletePageSectionConfig(athlete: Athlete) {
  return athletePageSectionConfigs[athlete.slug] ?? defaultAthletePageSectionConfig;
}

const defaultAthletePageSectionConfig: AthletePageSectionConfig = {
  navAriaLabel: (labels) => labels.narrativeNavLabel,
  progress: [],
  sections: [
    { type: "gallery", id: "gallery" },
    { type: "social-media", id: "social-media" },
    { type: "media-coverage", id: "media-coverage" },
  ],
};

function findInterviewFeature(athlete: Athlete, featureId: string) {
  return athlete.interviewFeatures?.find((feature) => feature.id === featureId);
}

function findAudioStory(athlete: Athlete, storyId?: string) {
  const stories = athlete.audioStories ?? [];

  return storyId
    ? stories.find((story) => story.id === storyId)
    : stories.find((story) => story.placement === "after-gallery");
}

function getInterviewLayoutConfig(
  athlete: Athlete,
  feature: AthleteInterviewFeature,
) {
  const layoutByAthlete: Record<string, Record<string, "text-first" | "media-first">> = {
    "lukas-loibl": {
      "planning-comes-first": "text-first",
      "the-mountain-will-still-be-here": "media-first",
    },
  };

  return layoutByAthlete[athlete.slug]?.[feature.id] ?? "stacked";
}

function getNarrativeNavLabel(athlete: Athlete, labels: AthletePageLabels) {
  return getAthletePageSectionConfig(athlete).navAriaLabel(labels);
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

function getAthleteSeoRole(athlete: Athlete, locale: Locale) {
  const roles: Record<string, { en: string; de: string }> = {
    "tim-howell": {
      en: "Professional BASE Jumper",
      de: "Professioneller BASE Jumper",
    },
    "lukas-loibl": {
      en: "Professional BASE Jumping Instructor",
      de: "Professioneller BASE-Jumping-Instruktor",
    },
    "marcel-geser": {
      en: "Hobby BASE Jumper",
      de: "Hobby BASE Jumper",
    },
    "niclas-strohmeier": {
      en: "Semi-Professional BASE Jumper",
      de: "Semiprofessioneller BASE Jumper",
    },
    "josef-braun": {
      en: "BASE Coach and Video Creator",
      de: "BASE-Coach und Videograf",
    },
  };

  return roles[athlete.slug]?.[locale] ?? athlete.content[locale].title;
}
