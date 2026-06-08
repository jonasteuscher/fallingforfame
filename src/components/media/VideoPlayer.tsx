import { MediaCaption } from "@/components/media/MediaCaption";
import type { VideoAsset } from "@/types/media";

type VideoPlayerProps = {
  video?: VideoAsset;
};

export function VideoPlayer({ video }: VideoPlayerProps) {
  return (
    <figure className="min-w-0 border border-border bg-surface p-3 sm:p-4">
      <video
        controls
        preload="metadata"
        poster={video?.poster}
        className="aspect-video w-full max-w-full bg-background"
        src={video?.src}
      >
        Your browser does not support the video element.
      </video>
      <MediaCaption caption={video?.caption ?? video?.title} credit={video?.credit} />
      {video?.transcript ? (
        <details className="mt-4 text-sm">
          <summary className="cursor-pointer text-foreground">Transcript</summary>
          <p className="mt-2 text-foreground/70">{video.transcript}</p>
        </details>
      ) : null}
    </figure>
  );
}
