"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import type { Locale } from "@/i18n/config";
import {
  clearActiveVideo,
  registerVideoPlayer,
  requestVideoPlayback,
} from "@/lib/videoPlaybackManager";
import type { AthleteScrollVideo, AthleteScrollVideoCue } from "@/types/athlete";

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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const sectionTopRef = useRef(0);
  const scrollableDistanceRef = useRef(1);
  const durationRef = useRef(0);
  const progressRef = useRef(0);
  const lastTimeRef = useRef(-1);
  const isMetadataReadyRef = useRef(false);
  const isSeekingRef = useRef(false);
  const headingId = useId();
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

  const updateCues = useCallback((progress: number) => {
    const node = stickyRef.current;

    if (!node) {
      return;
    }

    node.querySelectorAll<HTMLElement>("[data-scroll-cue-start]").forEach((cue) => {
      const start = Number(cue.dataset.scrollCueStart);
      const end = Number(cue.dataset.scrollCueEnd);
      const isActive = progress >= start && progress <= end;

      cue.style.opacity = isActive ? "1" : "0";
      cue.style.transform = isActive ? "translateY(0)" : "translateY(0.75rem)";
    });
  }, []);

  const scrubToScrollPosition = useCallback(() => {
    const media = videoRef.current;
    const durationValue = durationRef.current;

    if (!media || !isMetadataReadyRef.current || durationValue <= 0) {
      return;
    }

    const scrollY = window.scrollY || window.pageYOffset;
    const rawProgress =
      (scrollY - sectionTopRef.current + headerOffset) /
      Math.max(scrollableDistanceRef.current - headerOffset, 1);
    const progress = clamp(rawProgress, 0, 1);
    const maxTime = Math.max(durationValue - finalFramePadding, 0);
    const targetTime = clamp(progress * maxTime, 0, maxTime);

    progressRef.current = progress;
    updateCues(progress);

    if (Math.abs(lastTimeRef.current - targetTime) < seekThreshold) {
      return;
    }

    lastTimeRef.current = targetTime;
    media.pause();

    try {
      isSeekingRef.current = true;
      // Scroll scrubbing works best when source media uses frequent keyframes
      // (roughly 0.5-1s GOP), H.264 MP4, fast start, stable frame rate and
      // a reasonable bitrate.
      media.currentTime = targetTime;
    } catch {
      isSeekingRef.current = false;
    }
  }, [updateCues]);

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
      { rootMargin: "1600px 0px", threshold: 0.01 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!sourceEnabled) {
      return;
    }

    const preloadLink = document.createElement("link");
    preloadLink.rel = "preload";
    preloadLink.as = "video";
    preloadLink.href = video.video.src;
    preloadLink.type = video.video.type;
    document.head.appendChild(preloadLink);

    videoRef.current?.load();

    return () => {
      preloadLink.remove();
    };
  }, [sourceEnabled, video.video.src, video.video.type]);

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
  }, [mode, scheduleScrubUpdate]);

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
    return (
      <VideoFallback
        video={video}
        locale={locale}
        headingId={headingId}
      />
    );
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
              <source src={video.video.src} type={video.video.type} />
            ) : null}
          </video>
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--background)_32%,transparent)_0%,transparent_35%,color-mix(in_srgb,var(--background)_44%,transparent)_100%)]"
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 px-4 pt-20 sm:px-6 xl:px-10">
            <div className="mx-auto max-w-7xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary motion-safe:animate-[fade-in-up_700ms_ease-out_forwards] motion-safe:translate-y-4 motion-safe:opacity-0">
                {video.chapter[locale]}
              </p>
              <h2
                id={headingId}
                className="mt-4 max-w-4xl whitespace-pre-line text-[clamp(3.25rem,9vw,8rem)] font-semibold uppercase leading-[0.88] text-foreground motion-safe:animate-[fade-in-up_700ms_ease-out_120ms_forwards] motion-safe:translate-y-4 motion-safe:opacity-0"
              >
                {video.displayTitle}
              </h2>
              {video.description ? (
                <p className="mt-6 max-w-xl text-base leading-7 text-foreground/72 sm:text-lg">
                  {video.description[locale]}
                </p>
              ) : null}
            </div>
          </div>
          <ScrollCue cues={video.cues ?? []} locale={locale} />
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
      className="overflow-x-clip border-t border-border bg-background px-4 py-20 sm:px-6 sm:py-28 xl:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
          {video.chapter[locale]}
        </p>
        <h2
          id={headingId}
          className="mt-5 max-w-5xl whitespace-pre-line break-words text-[clamp(3rem,8vw,7.5rem)] font-semibold uppercase leading-[0.88] text-foreground [overflow-wrap:anywhere]"
        >
          {video.displayTitle}
        </h2>
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

function ScrollCue({
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
    <div className="pointer-events-none absolute inset-x-0 bottom-12 px-4 sm:px-6 xl:px-10">
      <div className="mx-auto flex max-w-7xl justify-end">
        <div className="max-w-md space-y-4 text-right">
          {cues.map((cue) => (
            <p
              key={`${cue.start}-${cue.end}-${cue.text.en}`}
              className="text-2xl font-semibold leading-tight text-foreground opacity-0 transition duration-500 motion-reduce:transition-none sm:text-4xl"
              style={{ opacity: 0 }}
              data-scroll-cue-start={cue.start}
              data-scroll-cue-end={cue.end}
            >
              {cue.text[locale]}
            </p>
          ))}
        </div>
      </div>
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
  const connection = (navigator as Navigator & {
    connection?: { saveData?: boolean };
  }).connection;
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  const saveData = connection?.saveData;

  if (prefersReducedMotion || saveData || (deviceMemory && deviceMemory <= 2)) {
    return "fallback";
  }

  if (coarsePointer && window.innerWidth < 900) {
    return "fallback";
  }

  return "scrub";
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
