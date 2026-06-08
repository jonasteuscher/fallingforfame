import type { AudioAsset, MediaAsset, VideoAsset } from "@/types/media";

export type LocalizedAthleteContent = {
  biography: string;
  quote: string;
  chapterTitle: string;
  chapterKicker: string;
};

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
  experience: AthleteExperience;
  profileImage?: MediaAsset;
  gallery?: MediaAsset[];
  featuredAudio?: AudioAsset;
  featuredVideo?: VideoAsset;
  content: {
    en: LocalizedAthleteContent;
    de: LocalizedAthleteContent;
  };
};
