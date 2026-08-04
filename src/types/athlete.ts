export type AthleteLocalizedContent = {
  title: string;
  shortBio: string;
  intro: string;
  baseStoryTitle: string;
  baseStory: string;
  profession: string;
  role: string;
  residence: string;
  primaryDisciplines: string[];
};

export type LocalizedText = {
  en: string;
  de: string;
};

export type AthleteOriginStoryBeat = {
  phase: LocalizedText;
  title: LocalizedText;
  body: LocalizedText;
  quote?: LocalizedText;
  media?: {
    type: "image" | "video";
    src: string | null;
    alt?: LocalizedText;
  };
};

export type AthleteImage = {
  src: string;
  alt: LocalizedText;
  caption?: LocalizedText;
  credit?: LocalizedText;
  width?: number;
  height?: number;
  orientation?: "landscape" | "portrait";
  featured?: "wide" | "tall";
  objectPosition?:
    | string
    | {
        desktop?: string;
        tablet?: string;
        mobile?: string;
      };
};

export type AthleteAudio = {
  title: LocalizedText;
  description?: LocalizedText;
  src: string | null;
  duration?: string | null;
};

export type AthleteVideo = {
  title: LocalizedText;
  description?: LocalizedText;
  src: string | null;
  poster?: string | null;
};

export type AthleteInterviewFeature = {
  id: string;
  placement: "after-origin" | "after-gallery";
  title?: LocalizedText;
  navTitle?: LocalizedText;
  chapter: LocalizedText;
  quote: string;
  subtitle?: LocalizedText;
  intro?: LocalizedText;
  iframeTitle: LocalizedText;
  poster: string | null;
  videos: {
    en: {
      provider: "youtube";
      videoId: string;
    };
    de: {
      provider: "youtube";
      videoId: string;
    };
  };
};

export type AthleteAudioStory = {
  id: string;
  placement: "after-gallery";
  chapter: LocalizedText;
  title: LocalizedText;
  displayTitle: string | LocalizedText;
  description?: LocalizedText;
  audio: {
    src: string;
  };
  transcript: {
    en: string;
    de: string;
  };
  portrait: string | null;
  portraitAlt?: LocalizedText;
  duration?: string | null;
};

export type ProjectStatus = "current" | "future" | "completed";

export type AthletePageProgressEntry = {
  id: string;
  label: LocalizedText;
  includeInProgress?: boolean;
};

export type AthletePageSectionConfig =
  | {
      id: string;
      type: "interview-video";
      featureId: string;
      layout?: "stacked" | "text-first" | "media-first";
      includeInProgress?: boolean;
      spacing?: "compact" | "standard" | "immersive";
    }
  | {
      id: string;
      type: "audio-story";
      storyId?: string;
      includeInProgress?: boolean;
      spacing?: "compact" | "standard" | "immersive";
    }
  | {
      id: string;
      type: "scroll-video";
      includeInProgress?: boolean;
      spacing?: "compact" | "standard" | "immersive";
    }
  | {
      id: string;
      type: "project-feature";
      project: "future" | "current";
      status?: ProjectStatus;
      includeInProgress?: boolean;
      spacing?: "compact" | "standard" | "immersive";
    }
  | {
      id: string;
      type: "gallery";
      includeInProgress?: boolean;
      spacing?: "compact" | "standard" | "immersive";
    }
  | {
      id: string;
      type: "social-media";
      includeInProgress?: boolean;
      spacing?: "compact" | "standard" | "immersive";
    }
  | {
      id: string;
      type: "media-coverage";
      includeInProgress?: boolean;
      spacing?: "compact" | "standard" | "immersive";
    };

export type AthletePageComposition = {
  navAriaLabel?: LocalizedText;
  progress: AthletePageProgressEntry[];
  sections: AthletePageSectionConfig[];
};

export type AthleteFutureProject = {
  chapter: LocalizedText;
  title: LocalizedText;
  displayTitle: string | LocalizedText;
  description?: LocalizedText;
  video: {
    src: string;
    poster?: string | null;
    caption?: LocalizedText;
  };
  links?: {
    url: string;
    label: LocalizedText;
  }[];
};

export type AthleteCurrentProject = {
  id: string;
  chapter: LocalizedText;
  title: LocalizedText;
  displayTitle: string | LocalizedText;
  intro: LocalizedText;
  passages: {
    title?: LocalizedText;
    body: LocalizedText;
  }[];
  statement: LocalizedText;
  closing: LocalizedText;
  cta?: {
    label: LocalizedText;
    href: string;
  };
  images: {
    src: string;
    alt: LocalizedText;
  }[];
  video: {
    src: string;
    type: "video/mp4";
    poster?: string | null;
    label: LocalizedText;
  };
};

export type AthleteScrollVideoCue = {
  start: number;
  end: number;
  text: LocalizedText;
};

export type AthleteScrollVideo = {
  id: string;
  chapter: LocalizedText;
  title: LocalizedText;
  displayTitle: string;
  description?: LocalizedText;
  video: {
    src: string;
    type: "video/mp4";
  };
  poster?: string | null;
  scrollLength: number;
  fallbackLabel: LocalizedText;
  cues?: AthleteScrollVideoCue[];
};

export type AthleteQuote = {
  text: LocalizedText;
};

export type AthleteLink = {
  label: string | LocalizedText;
  url: string | null;
  type: "instagram" | "youtube" | "website" | "tiktok" | "facebook" | "other";
  icon?: string | null;
};

export type AthleteArticle = {
  title?: {
    en: string;
    de: string;
  };
  publisher?: string | null;
  logo?: string | null;
  logoScale?: number | null;
  url: string | null;
};

export type AthletePlatform = "Instagram" | "YouTube" | "Facebook";

export type AthleteExperience = {
  skydiveSeasons: number | null;
  skydives: number | null;
  baseSeasons: number | null;
  basejumps: number | null;
  sponsored: boolean | null;
  socialMediaReach: number | null;
};

export type Athlete = {
  id: string;
  slug: string;
  name: string;
  age: number | null;
  country: string | null;
  platforms: AthletePlatform[];
  sponsorship: {
    en: string | null;
    de: string | null;
  };
  page?: AthletePageComposition;
  heroQuote: LocalizedText;
  images: {
    hero: string | null;
    portrait: string | null;
    gallery: AthleteImage[];
  };
  experience: AthleteExperience;
  content: {
    en: AthleteLocalizedContent;
    de: AthleteLocalizedContent;
  };
  originStory: AthleteOriginStoryBeat[];
  interviewFeatures?: AthleteInterviewFeature[];
  audioStories?: AthleteAudioStory[];
  scrollVideo?: AthleteScrollVideo;
  futureProject?: AthleteFutureProject;
  currentProject?: AthleteCurrentProject;
  audio: AthleteAudio[];
  video: AthleteVideo[];
  quotes: AthleteQuote[];
  links: AthleteLink[];
  articles: AthleteArticle[];
  sponsors: string[];
};
