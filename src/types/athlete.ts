import type { AudioAsset, MediaAsset, VideoAsset } from "@/types/media";

export type LocalizedAthleteContent = {
  biography: string;
  quote: string;
  chapterTitle: string;
  chapterKicker: string;
};

export type Athlete = {
  slug: string;
  name: string;
  profileImage: MediaAsset;
  gallery: MediaAsset[];
  featuredAudio?: AudioAsset;
  featuredVideo?: VideoAsset;
  content: {
    en: LocalizedAthleteContent;
    de: LocalizedAthleteContent;
  };
};
