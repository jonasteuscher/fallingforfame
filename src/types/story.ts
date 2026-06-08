import type { AudioAsset, MediaAsset, VideoAsset } from "@/types/media";

export type Finding = {
  id: string;
  title: string;
  summary: string;
  theme: "visibility" | "risk" | "safety" | "identity" | "sponsorship";
};

export type TimelineItem = {
  date: string;
  title: string;
  body: string;
};

export type StoryChapter = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  image?: MediaAsset;
  audio?: AudioAsset;
  video?: VideoAsset;
};
