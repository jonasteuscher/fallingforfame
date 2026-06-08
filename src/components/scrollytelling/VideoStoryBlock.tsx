import { VideoPlayer } from "@/components/media/VideoPlayer";
import type { VideoAsset } from "@/types/media";

type VideoStoryBlockProps = {
  title: string;
  body: string;
  video?: VideoAsset;
};

export function VideoStoryBlock({ title, body, video }: VideoStoryBlockProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h2 className="text-3xl font-semibold text-foreground">{title}</h2>
        <p className="mt-4 leading-7 text-foreground/72">{body}</p>
      </div>
      <VideoPlayer video={video} />
    </div>
  );
}
