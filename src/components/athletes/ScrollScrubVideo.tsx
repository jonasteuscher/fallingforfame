"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import type { Locale } from "@/i18n/config";
import {
  clearActiveVideo,
  registerVideoPlayer,
  requestVideoPlayback,
} from "@/lib/videoPlaybackManager";
import type { AthleteScrollVideo, AthleteScrollVideoCue } from "@/types/athlete";

import { SectionTitle } from "./SectionTitle";

type ScrollScrubVideoProps = {
  video?: AthleteScrollVideo;
  locale: Locale;
};

type CapabilityMode = "scrub" | "fallback";

const headerOffset = 56;
const finalFramePadding = 0.05;
const seekThreshold = 0.025;

export function ScrollScrubVideo({ video, locale }: ScrollScrubVideoProps) {
  if (!video) {
    return null;
  }

  return <ScrollScrubSection video={video} locale={locale} />;
}

function ScrollScrubSection({
  video,
  locale,
}: {
  video: AthleteScrollVideo;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const scrimRef = useRef<HTMLDivElement | null>(null);
  const textOverlayRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const sectionTopRef = useRef(0);
  const scrollableDistanceRef = useRef(1);
  const durationRef = useRef(0);
  const progressRef = useRef(0);
  const lastTimeRef = useRef(-1);
  const isMetadataReadyRef = useRef(false);
  const isSeekingRef = useRef(false);
  const desiredTimeRef = useRef<number | null>(null);
  const headingId = useId();
  const displayTitle =
    typeof video.displayTitle === "string"
      ? video.displayTitle
      : video.displayTitle[locale];
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [mode, setMode] = useState<CapabilityMode | null>(null);
  const [sourceEnabled, setSourceEnabled] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setMode(detectCapabilityMode());
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  const updateTextOverlay = useCallback((progress: number) => {
    const node = textOverlayRef.current;

    if (!node) {
      return;
    }

    const opacity = clamp(1 - (progress - 0.06) / 0.1, 0, 1);

    node.style.opacity = String(opacity);
    node.style.transform = `translateY(${(1 - opacity) * -0.75}rem)`;
    node.style.visibility = opacity <= 0 ? "hidden" : "visible";

    if (scrimRef.current) {
      scrimRef.current.style.opacity = String(opacity);
    }
  }, []);

  const seekToTime = useCallback((targetTime: number) => {
    const media = videoRef.current;

    if (
      !media ||
      !isMetadataReadyRef.current ||
      isSeekingRef.current ||
      Math.abs(lastTimeRef.current - targetTime) < seekThreshold
    ) {
      return;
    }

    lastTimeRef.current = targetTime;
    media.pause();

    try {
      isSeekingRef.current = true;
      media.currentTime = targetTime;
    } catch {
      isSeekingRef.current = false;
    }
  }, []);

  const scrubToScrollPosition = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset;
    const rawProgress =
      (scrollY - sectionTopRef.current + headerOffset) /
      Math.max(scrollableDistanceRef.current - headerOffset, 1);
    const progress = clamp(rawProgress, 0, 1);

    progressRef.current = progress;
    updateTextOverlay(progress);

    const media = videoRef.current;
    const durationValue = durationRef.current;

    if (!media || !isMetadataReadyRef.current || durationValue <= 0) {
      return;
    }

    const maxTime = Math.max(durationValue - finalFramePadding, 0);
    const targetTime = clamp(progress * maxTime, 0, maxTime);

    desiredTimeRef.current = targetTime;
    seekToTime(targetTime);
  }, [seekToTime, updateTextOverlay]);

  const scheduleScrubUpdate = useCallback(() => {
    if (rafRef.current !== null) {
      return;
    }

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      scrubToScrollPosition();
    });
  }, [scrubToScrollPosition]);

  useEffect(() => {
    const node = sectionRef.current;

    if (!node || typeof IntersectionObserver === "undefined") {
      const timeout = window.setTimeout(() => setSourceEnabled(true), 0);

      return () => window.clearTimeout(timeout);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSourceEnabled(true);
          observer.disconnect();
        }
      },
      { rootMargin: "3200px 0px", threshold: 0.01 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!sourceEnabled) {
      return;
    }

    videoRef.current?.load();
  }, [sourceEnabled]);

  useEffect(() => {
    if (mode !== "scrub") {
      return;
    }

    const media = videoRef.current;

    if (!media) {
      return;
    }

    const element = media;

    function handleLoadedMetadata() {
      const mediaDuration = Number.isFinite(element.duration) ? element.duration : 0;

      durationRef.current = mediaDuration;
      isMetadataReadyRef.current = mediaDuration > 0;
      setDuration(mediaDuration);
      scheduleScrubUpdate();
    }

    function handleWaiting() {
      if (isSeekingRef.current) {
        setIsBuffering(true);
      }
    }

    function handleSettled() {
      isSeekingRef.current = false;
      setIsBuffering(false);

      const desiredTime = desiredTimeRef.current;

      if (desiredTime !== null) {
        seekToTime(desiredTime);
      }
    }

    function handleError() {
      isSeekingRef.current = false;
      setIsBuffering(false);
    }

    element.addEventListener("loadedmetadata", handleLoadedMetadata);
    element.addEventListener("canplay", handleSettled);
    element.addEventListener("seeked", handleSettled);
    element.addEventListener("waiting", handleWaiting);
    element.addEventListener("stalled", handleWaiting);
    element.addEventListener("error", handleError);

    return () => {
      element.removeEventListener("loadedmetadata", handleLoadedMetadata);
      element.removeEventListener("canplay", handleSettled);
      element.removeEventListener("seeked", handleSettled);
      element.removeEventListener("waiting", handleWaiting);
      element.removeEventListener("stalled", handleWaiting);
      element.removeEventListener("error", handleError);
    };
  }, [mode, scheduleScrubUpdate, seekToTime]);

  useEffect(() => {
    if (mode !== "scrub") {
      return;
    }

    function measure() {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const viewportHeight = window.innerHeight || 1;

      sectionTopRef.current = rect.top + scrollY;
      scrollableDistanceRef.current = Math.max(
        section.offsetHeight - viewportHeight,
        1,
      );
      scheduleScrubUpdate();
    }

    function handleScroll() {
      scheduleScrubUpdate();
    }

    measure();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", measure);

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [mode, scheduleScrubUpdate]);

  if (mode !== "scrub") {
    return <VideoFallback video={video} locale={locale} headingId={headingId} />;
  }

  const scrollLength = Math.max(video.scrollLength, 3);

  return (
    <section
      ref={sectionRef}
      aria-labelledby={headingId}
      data-scroll-scrub-video-id={video.id}
      className="relative overflow-x-clip bg-background"
      style={{ minHeight: `${scrollLength * 100}vh` }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 flex min-h-[calc(100svh-3.5rem)] items-center overflow-hidden pt-14"
      >
        <div className="absolute inset-0 bg-background" aria-hidden="true" />
        <div className="relative h-[calc(100svh-3.5rem)] w-full">
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            tabIndex={-1}
            poster={video.poster ?? undefined}
            aria-hidden="true"
            className="h-full w-full object-cover"
          >
            {sourceEnabled ? (
              <source
                src={video.video.scrubSrc ?? video.video.src}
                type={video.video.type}
              />
            ) : null}
          </video>
          <div
            ref={scrimRef}
            data-scroll-video-scrim
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--background)_64%,transparent)_0%,color-mix(in_srgb,var(--background)_38%,transparent)_46%,color-mix(in_srgb,var(--background)_48%,transparent)_100%)] transition-opacity duration-500 motion-reduce:transition-none"
            aria-hidden="true"
          />
          <div
            ref={textOverlayRef}
            data-scroll-video-copy
            className="pointer-events-none absolute inset-x-0 top-0 px-4 pt-20 transition duration-500 motion-reduce:transition-none sm:px-6 xl:px-10"
          >
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,0.68fr)_minmax(18rem,0.32fr)] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary motion-safe:animate-[fade-in-up_700ms_ease-out_forwards] motion-safe:translate-y-4 motion-safe:opacity-0">
                  {video.chapter[locale]}
                </p>
                <SectionTitle id={headingId} size="scroll">
                  {displayTitle}
                </SectionTitle>
                {video.description ? (
                  <p className="mt-6 max-w-xl text-base font-medium leading-7 text-foreground [text-shadow:0_2px_10px_rgba(0,0,0,0.95)] sm:text-lg">
                    {video.description[locale]}
                  </p>
                ) : null}
              </div>
              <ScrollPoem cues={video.cues ?? []} locale={locale} />
            </div>
          </div>
          {isBuffering && duration > 0 ? (
            <div className="absolute bottom-8 left-1/2 h-1 w-28 -translate-x-1/2 overflow-hidden bg-foreground/18">
              <span className="block h-full w-1/2 animate-pulse bg-primary" />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function VideoFallback({
  video,
  locale,
  headingId,
}: {
  video: AthleteScrollVideo;
  locale: Locale;
  headingId: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoId = useId();
  const displayTitle =
    typeof video.displayTitle === "string"
      ? video.displayTitle
      : video.displayTitle[locale];

  useEffect(() => {
    return registerVideoPlayer(videoId, () => {
      videoRef.current?.pause();
    });
  }, [videoId]);

  return (
    <section
      aria-labelledby={headingId}
      data-scroll-scrub-video-id={video.id}
      data-scroll-scrub-fallback="true"
      className="overflow-x-clip border-t border-border bg-background px-4 py-[var(--section-gap-immersive)] sm:px-6 xl:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
          {video.chapter[locale]}
        </p>
        <SectionTitle id={headingId} size="standardStatic">
          {displayTitle}
        </SectionTitle>
        {video.description ? (
          <p className="mt-8 max-w-2xl text-lg leading-8 text-foreground/72">
            {video.description[locale]}
          </p>
        ) : null}
        <div className="mt-10 aspect-video w-full overflow-hidden bg-black shadow-[0_28px_90px_color-mix(in_srgb,var(--background)_78%,black)] sm:mt-14">
          <video
            ref={videoRef}
            controls
            playsInline
            preload="metadata"
            poster={video.poster ?? undefined}
            aria-label={video.fallbackLabel[locale]}
            onPlay={() => requestVideoPlayback(videoId)}
            onPause={() => clearActiveVideo(videoId)}
            onEnded={() => clearActiveVideo(videoId)}
            className="h-full w-full bg-black object-cover"
          >
            <source src={video.video.src} type={video.video.type} />
          </video>
        </div>
      </div>
    </section>
  );
}

function ScrollPoem({
  cues,
  locale,
}: {
  cues: AthleteScrollVideoCue[];
  locale: Locale;
}) {
  if (cues.length === 0) {
    return null;
  }

  return (
    <div className="max-w-sm pt-2 text-left lg:justify-self-end lg:pt-10 lg:text-right">
      {cues.map((cue) => (
        <p
          key={`${cue.start}-${cue.end}-${cue.text.en}`}
          className="text-2xl font-semibold leading-tight text-foreground sm:text-3xl"
        >
          {cue.text[locale]}
        </p>
      ))}
    </div>
  );
}

function detectCapabilityMode(): CapabilityMode {
  if (typeof window === "undefined") {
    return "fallback";
  }

  const prefersReducedMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const coarsePointer = window.matchMedia?.("(pointer: coarse)").matches;
  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean };
    }
  ).connection;
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  const saveData = connection?.saveData;

  if (prefersReducedMotion || saveData || (deviceMemory && deviceMemory <= 2)) {
    return "fallback";
  }

  if (coarsePointer) {
    return "fallback";
  }

  return "scrub";
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
