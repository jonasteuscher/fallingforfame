"use client";

import { useEffect, useId, useRef, useState } from "react";

import type { Locale } from "@/i18n/config";
import {
  clearActiveVideo,
  registerVideoPlayer,
  requestVideoPlayback,
} from "@/lib/videoPlaybackManager";
import type { Athlete, AthleteFutureProject } from "@/types/athlete";

type FutureProjectFeatureProps = {
  athlete: Athlete;
  locale: Locale;
};

export function FutureProjectFeature({
  athlete,
  locale,
}: FutureProjectFeatureProps) {
  if (!athlete.futureProject) {
    return null;
  }

  return (
    <FutureProjectSection
      athleteName={athlete.name}
      project={athlete.futureProject}
      locale={locale}
    />
  );
}

function FutureProjectSection({
  athleteName,
  project,
  locale,
}: {
  athleteName: string;
  project: AthleteFutureProject;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const headingId = useId();
  const videoId = useId();
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const videoLabel = `${athleteName} — Future Project: ${project.title[locale]}`;

  useEffect(() => {
    return registerVideoPlayer(videoId, () => {
      videoRef.current?.pause();
    });
  }, [videoId]);

  useEffect(() => {
    const node = sectionRef.current;

    if (!node) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      const timeout = window.setTimeout(() => setHasEnteredViewport(true), 0);

      return () => window.clearTimeout(timeout);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setHasEnteredViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "220px 0px", threshold: 0.12 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = sectionRef.current;

    if (!node || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }

        if (!entry.isIntersecting || entry.intersectionRatio < 0.35) {
          videoRef.current?.pause();
        }
      },
      { threshold: [0, 0.35, 0.75] },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby={headingId}
      data-future-project-feature
      className="overflow-x-clip border-t border-border bg-background px-4 py-20 sm:px-6 sm:py-28 xl:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary motion-safe:animate-[fade-in-up_700ms_ease-out_forwards] motion-safe:translate-y-4 motion-safe:opacity-0">
          {project.chapter[locale]}
        </p>
        <h2
          id={headingId}
          className="mt-5 max-w-6xl whitespace-pre-line break-words text-[clamp(3rem,9vw,8rem)] font-semibold uppercase leading-[0.88] text-foreground [overflow-wrap:anywhere] motion-safe:animate-[fade-in-up_700ms_ease-out_100ms_forwards] motion-safe:translate-y-4 motion-safe:opacity-0"
        >
          {project.displayTitle}
        </h2>
        {project.description ? (
          <p className="mt-8 max-w-2xl text-lg leading-8 text-foreground/72 motion-safe:animate-[fade-in-up_700ms_ease-out_200ms_forwards] motion-safe:translate-y-4 motion-safe:opacity-0">
            {project.description[locale]}
          </p>
        ) : null}

        <figure className="mt-10 motion-safe:animate-[fade-in-up_700ms_ease-out_320ms_forwards] motion-safe:translate-y-4 motion-safe:opacity-0 sm:mt-14">
          <div className="aspect-video w-full overflow-hidden bg-black shadow-[0_28px_90px_color-mix(in_srgb,var(--background)_78%,black)]">
            <video
              ref={videoRef}
              controls
              playsInline
              preload="metadata"
              poster={project.video.poster ?? undefined}
              title={videoLabel}
              aria-label={videoLabel}
              onPlay={() => requestVideoPlayback(videoId)}
              onPause={() => clearActiveVideo(videoId)}
              onEnded={() => clearActiveVideo(videoId)}
              className="h-full w-full bg-black object-cover"
            >
              {hasEnteredViewport ? (
                <source src={project.video.src} type="video/mp4" />
              ) : null}
            </video>
          </div>
        </figure>
      </div>
    </section>
  );
}
