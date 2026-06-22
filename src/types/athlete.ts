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

export type AthleteOriginStoryBeat = {
  phase: {
    en: string;
    de: string;
  };
  title: {
    en: string;
    de: string;
  };
  body: {
    en: string;
    de: string;
  };
  quote?: {
    en: string;
    de: string;
  };
  media?: {
    type: "image" | "video";
    src: string | null;
  };
};

export type AthleteImage = {
  src: string;
  alt: {
    en: string;
    de: string;
  };
};

export type AthleteAudio = {
  title: {
    en: string;
    de: string;
  };
  description?: {
    en: string;
    de: string;
  };
  src: string | null;
  duration?: string | null;
};

export type AthleteVideo = {
  title: {
    en: string;
    de: string;
  };
  description?: {
    en: string;
    de: string;
  };
  src: string | null;
  poster?: string | null;
};

export type AthleteQuote = {
  text: {
    en: string;
    de: string;
  };
};

export type AthleteLink = {
  label: string;
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

export type AthleteSponsor = {
  name: string;
  logo: string | null;
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
  audio: AthleteAudio[];
  video: AthleteVideo[];
  quotes: AthleteQuote[];
  links: AthleteLink[];
  articles: AthleteArticle[];
  sponsors: AthleteSponsor[];
};
