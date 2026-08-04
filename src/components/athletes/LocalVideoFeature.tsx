"use client";

import { useEffect, useId, useRef, useState } from "react";

import { SectionTitle } from "@/components/athletes/SectionTitle";
import type { Locale } from "@/i18n/config";
import {
  clearActiveVideo,
  registerVideoPlayer,
  requestVideoPlayback,
} from "@/lib/videoPlaybackManager";
import type { AthleteLocalVideoFeature } from "@/types/athlete";

type LocalVideoFeatureProps = {
  feature: AthleteLocalVideoFeature;
  locale: Locale;
};

export function LocalVideoFeature({ feature, locale }: LocalVideoFeatureProps) {
  const figureRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoId = useId();
  const headingId = useId();
  const [sourceEnabled, setSourceEnabled] = useState(false);
  const displayTitle = feature.displayTitle?.[locale] ?? feature.title[locale];
  const videoLabel = feature.video.label[locale];

  useEffect(() => {
    return registerVideoPlayer(videoId, () => videoRef.current?.pause());
  }, [videoId]);

  useEffect(() => {
    const node = figureRef.current;

    if (!node || typeof IntersectionObserver === "undefined") {
      const timeout = window.setTimeout(() => setSourceEnabled(true), 0);

      return () => window.clearTimeout(timeout);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSourceEnabled(true);
        }

        if (!entry?.isIntersecting || entry.intersectionRatio < 0.28) {
          videoRef.current?.pause();
          clearActiveVideo(videoId);
        }
      },
      { rootMargin: "500px 0px", threshold: [0, 0.28, 0.7] },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [videoId]);

  return (
    <section
      id={feature.id}
      aria-labelledby={headingId}
      data-local-video-feature-id={feature.id}
      className="overflow-x-clip border-t border-border px-4 py-[var(--section-gap-immersive)] sm:px-6 xl:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            {feature.chapter[locale]}
          </p>
          <SectionTitle id={headingId}>{displayTitle}</SectionTitle>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-foreground/72">
            {feature.intro[locale]}
          </p>
        </header>

        <figure
          ref={figureRef}
          className="mt-10 motion-safe:animate-[fade-in-up_700ms_ease-out_160ms_forwards] motion-safe:translate-y-4 motion-safe:opacity-0 sm:mt-12"
        >
          <div className="aspect-video w-full overflow-hidden bg-black shadow-[0_28px_90px_color-mix(in_srgb,var(--background)_78%,black)]">
            <video
              ref={videoRef}
              controls
              preload="metadata"
              playsInline
              poster={feature.video.poster ?? undefined}
              aria-label={videoLabel}
              title={videoLabel}
              onPlay={() => requestVideoPlayback(videoId)}
              onPause={() => clearActiveVideo(videoId)}
              onEnded={() => clearActiveVideo(videoId)}
              className="h-full w-full bg-black object-contain"
            >
              {sourceEnabled ? (
                <source src={feature.video.src} type={feature.video.type} />
              ) : null}
            </video>
          </div>
          {feature.video.caption ? (
            <figcaption className="mt-3 text-sm leading-6 text-foreground/65">
              {feature.video.caption[locale]}
            </figcaption>
          ) : null}
        </figure>
      </div>
    </section>
  );
}
