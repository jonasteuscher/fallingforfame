import { MediaCaption } from "@/components/media/MediaCaption";
import type { AudioAsset } from "@/types/media";

type AudioPlayerProps = {
  audio?: AudioAsset;
};

export function AudioPlayer({ audio }: AudioPlayerProps) {
  return (
    <figure className="border border-border bg-surface p-4">
      <audio controls preload="none" className="w-full" src={audio?.src}>
        Your browser does not support the audio element.
      </audio>
      <MediaCaption caption={audio?.caption ?? audio?.title} credit={audio?.credit} />
      {audio?.transcript ? (
        <details className="mt-4 text-sm">
          <summary className="cursor-pointer text-foreground">Transcript</summary>
          <p className="mt-2 text-foreground/70">{audio.transcript}</p>
        </details>
      ) : null}
    </figure>
  );
}
