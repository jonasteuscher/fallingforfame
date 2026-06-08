import { AudioPlayer } from "@/components/media/AudioPlayer";
import type { AudioAsset } from "@/types/media";

type AudioStoryBlockProps = {
  title: string;
  body: string;
  audio?: AudioAsset;
};

export function AudioStoryBlock({ title, body, audio }: AudioStoryBlockProps) {
  return (
    <div className="grid min-w-0 gap-6 md:grid-cols-2">
      <div className="min-w-0">
        <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">{title}</h2>
        <p className="mt-4 leading-7 text-foreground/72">{body}</p>
      </div>
      <AudioPlayer audio={audio} />
    </div>
  );
}
