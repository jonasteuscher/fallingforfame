import { AudioPlayer } from "@/components/media/AudioPlayer";
import type { AudioAsset } from "@/types/media";

type AudioStoryBlockProps = {
  title: string;
  body: string;
  audio?: AudioAsset;
};

export function AudioStoryBlock({ title, body, audio }: AudioStoryBlockProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h2 className="text-3xl font-semibold text-foreground">{title}</h2>
        <p className="mt-4 leading-7 text-foreground/72">{body}</p>
      </div>
      <AudioPlayer audio={audio} />
    </div>
  );
}
