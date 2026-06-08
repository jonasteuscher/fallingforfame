import { VideoPlayer } from "@/components/media/VideoPlayer";
import type { VideoAsset } from "@/types/media";

type VideoStoryBlockProps = {
  title: string;
  body: string;
  video?: VideoAsset;
};

export function VideoStoryBlock({ title, body, video }: VideoStoryBlockProps) {
  return (
    <div className="grid min-w-0 gap-6 md:grid-cols-2">
      <div className="min-w-0">
        <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">{title}</h2>
        <p className="mt-4 leading-7 text-foreground/72">{body}</p>
      </div>
      <VideoPlayer video={video} />
    </div>
  );
}
