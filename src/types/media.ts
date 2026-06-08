export type MediaAsset = {
  src: string;
  alt?: string;
  title?: string;
  caption?: string;
  credit?: string;
};

export type AudioAsset = MediaAsset & {
  transcript?: string;
  duration?: string;
};

export type VideoAsset = MediaAsset & {
  poster?: string;
  transcript?: string;
  duration?: string;
};
