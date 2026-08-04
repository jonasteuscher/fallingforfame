import {
  AthleteArticlesSection,
  AthleteBaseStory,
  AthleteFindingsLinkSection,
  AthleteGallerySection,
  AthleteHero,
  AthleteLinksSection,
  AthleteNarrativeNav,
  AthleteProfileOverview,
  AudioStory,
  InterviewFeature,
  LocalVideoFeature,
  MoreAthletes,
  ProjectFeature,
  ScrollScrubVideo,
} from "@/components/athletes";
import type { InterviewLayout } from "@/components/athletes/InterviewFeature";
import type { Locale } from "@/i18n/config";
import type { ComponentProps } from "react";
import type {
  Athlete,
  AthleteArticle,
  AthleteAudioStory,
  AthleteCurrentProject,
  AthleteFutureProject,
  AthleteImage,
  AthleteInterviewFeature,
  AthleteLocalVideoFeature,
  AthleteLink,
  AthleteScrollVideo,
  ProjectStatus,
} from "@/types/athlete";

export type SectionSpacing = "compact" | "standard" | "immersive";

export const sectionSpacing = {
  compact: "py-16 md:py-24",
  standard: "py-24 md:py-36",
  immersive: "py-32 md:py-48",
} satisfies Record<SectionSpacing, string>;

type InterviewVideoSection = {
  id: string;
  type: "interview-video";
  feature: AthleteInterviewFeature;
  layout?: InterviewLayout;
  includeInProgress?: boolean;
  spacing?: SectionSpacing;
};

type AudioStorySection = {
  id: string;
  type: "audio-story";
  story: AthleteAudioStory;
  includeInProgress?: boolean;
  spacing?: SectionSpacing;
};

type ScrollVideoSection = {
  id: string;
  type: "scroll-video";
  video?: AthleteScrollVideo;
  includeInProgress?: boolean;
  spacing?: SectionSpacing;
};

type LocalVideoSection = {
  id: string;
  type: "local-video";
  feature: AthleteLocalVideoFeature;
  includeInProgress?: boolean;
  spacing?: SectionSpacing;
};

type ProjectFeatureSection = {
  id: string;
  type: "project-feature";
  project?: AthleteCurrentProject | AthleteFutureProject;
  status: ProjectStatus;
  includeInProgress?: boolean;
  spacing?: SectionSpacing;
};

type GallerySection = {
  id: string;
  type: "gallery";
  images: AthleteImage[];
  includeInProgress?: boolean;
  spacing?: SectionSpacing;
};

type SocialMediaSection = {
  id: string;
  type: "social-media";
  links: AthleteLink[];
  includeInProgress?: boolean;
  spacing?: SectionSpacing;
};

type MediaCoverageSection = {
  id: string;
  type: "media-coverage";
  articles: AthleteArticle[];
  includeInProgress?: boolean;
  spacing?: SectionSpacing;
};

export type AthleteSection =
  | InterviewVideoSection
  | AudioStorySection
  | ScrollVideoSection
  | LocalVideoSection
  | ProjectFeatureSection
  | GallerySection
  | SocialMediaSection
  | MediaCoverageSection;

export type ProgressSection = {
  id: string;
  label: string;
  includeInProgress: boolean;
};

type AthleteDocumentaryPageProps = {
  athlete: Athlete;
  locale: Locale;
  title: string;
  meta: string;
  scrollHint: string;
  profile: {
    portraitAlt: string;
    portraitPlaceholder: string;
    labels: ComponentProps<typeof AthleteProfileOverview>["labels"];
  };
  originTitle: string;
  sections: AthleteSection[];
  progressSections: ProgressSection[];
  navAriaLabel: string;
  sectionLabels: {
    galleryTitle: string;
    galleryEmpty: string;
    galleryViewAll: string;
    galleryShowLess: string;
    linksTitle: string;
    articlesTitle: string;
    articlesViewAll: string;
    articlesShowLess: string;
    interviewFeature: {
      play: (title: string) => string;
      fullscreen: (title: string) => string;
      exitFullscreen: (title: string) => string;
    };
    findingsLink: {
      eyebrow: string;
      title: string;
      body: string;
      cta: string;
    };
    moreTitle: string;
    moreCta: string;
    portraitPlaceholder: string;
    countryLabels: Record<string, string>;
    cardLabels: {
      profession: string;
      role: string;
      primary: string;
    };
  };
  moreAthletes: Athlete[];
};

export function AthleteDocumentaryPage({
  athlete,
  locale,
  title,
  meta,
  scrollHint,
  profile,
  originTitle,
  sections,
  progressSections,
  navAriaLabel,
  sectionLabels,
  moreAthletes,
}: AthleteDocumentaryPageProps) {
  const navItems = progressSections
    .filter((section) => section.includeInProgress)
    .map((section) => ({ id: section.id, label: section.label }));

  return (
    <>
      {navItems.length > 0 ? (
        <AthleteNarrativeNav items={navItems} ariaLabel={navAriaLabel} />
      ) : null}

      <div id={progressSections[0]?.id} className="scroll-mt-20">
        <AthleteHero
          athlete={athlete}
          title={title}
          meta={meta}
          quote={athlete.heroQuote[locale]}
          scrollHint={scrollHint}
        />

        <AthleteProfileOverview
          athlete={athlete}
          locale={locale}
          portraitAlt={profile.portraitAlt}
          portraitPlaceholder={profile.portraitPlaceholder}
          labels={profile.labels}
        />
      </div>

      <div id={progressSections[1]?.id} className="scroll-mt-20">
        <AthleteBaseStory athlete={athlete} locale={locale} title={originTitle} />
      </div>

      {sections.map((section) => (
        <AthleteSectionRenderer
          key={`${section.type}-${section.id}`}
          section={section}
          athlete={athlete}
          locale={locale}
          labels={sectionLabels}
        />
      ))}

      <AthleteFindingsLinkSection
        locale={locale}
        eyebrow={sectionLabels.findingsLink.eyebrow}
        title={sectionLabels.findingsLink.title}
        body={sectionLabels.findingsLink.body}
        cta={sectionLabels.findingsLink.cta}
      />

      <MoreAthletes
        athletes={moreAthletes}
        locale={locale}
        title={sectionLabels.moreTitle}
        cta={sectionLabels.moreCta}
        placeholder={sectionLabels.portraitPlaceholder}
        countryLabels={sectionLabels.countryLabels}
        cardLabels={sectionLabels.cardLabels}
      />
    </>
  );
}

function AthleteSectionRenderer({
  section,
  athlete,
  locale,
  labels,
}: {
  section: AthleteSection;
  athlete: Athlete;
  locale: Locale;
  labels: AthleteDocumentaryPageProps["sectionLabels"];
}) {
  switch (section.type) {
    case "interview-video": {
      const interview = (
        <InterviewFeature
          feature={section.feature}
          locale={locale}
          labels={formatInterviewLabels(
            section.feature,
            locale,
            labels.interviewFeature,
          )}
          layout={section.layout}
        />
      );

      return section.id === section.feature.id ? (
        interview
      ) : (
        <div id={section.id} className="scroll-mt-20">
          {interview}
        </div>
      );
    }

    case "audio-story":
      return (
        <div id={section.id} className="scroll-mt-20">
          <AudioStory story={section.story} locale={locale} />
        </div>
      );

    case "scroll-video":
      return (
        <div id={section.id} className="scroll-mt-20">
          <ScrollScrubVideo video={section.video} locale={locale} />
        </div>
      );

    case "local-video": {
      const localVideo = (
        <LocalVideoFeature feature={section.feature} locale={locale} />
      );

      return section.id === section.feature.id ? (
        localVideo
      ) : (
        <div id={section.id} className="scroll-mt-20">
          {localVideo}
        </div>
      );
    }

    case "project-feature":
      return (
        <div id={section.id} className="scroll-mt-20">
          <ProjectFeature
            athleteName={athlete.name}
            project={section.project}
            status={section.status}
            locale={locale}
          />
        </div>
      );

    case "gallery":
      return (
        <div id={section.id} className="scroll-mt-20">
          <AthleteGallerySection
            images={section.images}
            locale={locale}
            title={labels.galleryTitle}
            emptyText={labels.galleryEmpty}
            viewAllLabel={labels.galleryViewAll}
            showLessLabel={labels.galleryShowLess}
          />
        </div>
      );

    case "social-media":
      return (
        <div id={section.id} className="scroll-mt-20">
          <AthleteLinksSection
            links={section.links}
            locale={locale}
            title={labels.linksTitle}
            compact
          />
        </div>
      );

    case "media-coverage":
      return (
        <div id={section.id} className="scroll-mt-20">
          <AthleteArticlesSection
            articles={section.articles}
            locale={locale}
            title={labels.articlesTitle}
            viewAllLabel={labels.articlesViewAll}
            showLessLabel={labels.articlesShowLess}
            compact
            initialVisibleCount={3}
          />
        </div>
      );

    default:
      return assertNever(section);
  }
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

function assertNever(value: never): never {
  throw new Error(`Unsupported athlete section: ${JSON.stringify(value)}`);
}
