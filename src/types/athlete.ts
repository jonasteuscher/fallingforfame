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
};

export type AthleteArticle = {
  title: {
    en: string;
    de: string;
  };
  publisher?: string | null;
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
  audio: AthleteAudio[];
  video: AthleteVideo[];
  quotes: AthleteQuote[];
  links: AthleteLink[];
  articles: AthleteArticle[];
  sponsors: AthleteSponsor[];
};
