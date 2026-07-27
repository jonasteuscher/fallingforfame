"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import type { Locale } from "@/i18n/config";
import {
  clearActiveVideo,
  registerVideoPlayer,
  requestVideoPlayback,
} from "@/lib/videoPlaybackManager";
import type { AthleteInterviewFeature } from "@/types/athlete";

type InterviewFeatureLabels = {
  play: string;
  fullscreen: string;
  exitFullscreen: string;
};

type InterviewFeatureProps = {
  feature: AthleteInterviewFeature;
  locale: Locale;
  labels: InterviewFeatureLabels;
};

type YouTubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  destroy: () => void;
  setSize?: (width: string | number, height: string | number) => void;
  setPlaybackQuality?: (suggestedQuality: "hd1080") => void;
};

type YouTubePlayerConstructor = new (
  element: HTMLElement,
  options: {
    videoId: string;
    host?: string;
    playerVars: Record<string, string | number>;
    events: {
      onReady: () => void;
      onStateChange?: (event: { data: number }) => void;
    };
  },
) => YouTubePlayer;

type YouTubeApi = {
  Player: YouTubePlayerConstructor;
  PlayerState?: {
    PLAYING: number;
    PAUSED: number;
    ENDED: number;
  };
};

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youTubeApiPromise: Promise<YouTubeApi> | null = null;

export function InterviewFeature({ feature, locale, labels }: InterviewFeatureProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const playerMountRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const playerId = useId();
  const headingId = useId();
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const video = feature.videos[locale];
  const poster = feature.poster ?? youtubePoster(video.videoId);
  const isFullscreen = isNativeFullscreen;
  const heading = feature.navTitle?.[locale] ?? feature.title?.[locale] ?? feature.quote;

  const playerVars = useMemo(
    () => ({
      autoplay: 1,
      playsinline: 1,
      rel: 0,
      modestbranding: 1,
      controls: 0,
      disablekb: 0,
      fs: 1,
      iv_load_policy: 3,
      showinfo: 0,
      cc_load_policy: 0,
      hl: locale,
      origin: typeof window !== "undefined" ? window.location.origin : "",
    }),
    [locale],
  );

  function getPlayerIframe() {
    return containerRef.current?.querySelector("iframe") ?? null;
  }

  useEffect(() => {
    return registerVideoPlayer(playerId, () => {
      playerRef.current?.pauseVideo();
    });
  }, [playerId]);

  useEffect(() => {
    function handleFullscreenChange() {
      const iframe = getPlayerIframe();

      setIsNativeFullscreen(document.fullscreenElement === iframe);
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const node = containerRef.current;

    if (!node || typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!playerRef.current) {
          return;
        }

        if (!entry?.isIntersecting || entry.intersectionRatio < 0.4) {
          playerRef.current.pauseVideo();
          clearActiveVideo(playerId);
        }
      },
      { threshold: [0, 0.4, 0.75] },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [playerId]);

  useEffect(() => {
    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  async function startPlayback() {
    if (!video) {
      return;
    }

    const videoId = video.videoId;

    if (!playerMountRef.current || playerRef.current) {
      playerRef.current?.setPlaybackQuality?.("hd1080");
      playerRef.current?.playVideo();
      requestVideoPlayback(playerId);
      return;
    }

    setIsLoading(true);
    setHasStarted(true);

    const api = await loadYouTubeApi();
    const mount = playerMountRef.current;

    if (!mount) {
      return;
    }

    playerRef.current = new api.Player(mount, {
      videoId,
      playerVars,
      host: "https://www.youtube-nocookie.com",
      events: {
        onReady: () => {
          const iframe = containerRef.current?.querySelector("iframe");

          if (iframe) {
            iframe.setAttribute("title", feature.iframeTitle[locale]);
            iframe.setAttribute(
              "allow",
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen",
            );
            iframe.setAttribute("allowfullscreen", "true");
            iframe.setAttribute("width", "100%");
            iframe.setAttribute("height", "100%");
            iframe.allowFullscreen = true;
            iframe.style.position = "absolute";
            iframe.style.inset = "0";
            iframe.style.width = "100%";
            iframe.style.height = "100%";
          }

          playerRef.current?.setSize?.("100%", "100%");
          playerRef.current?.setPlaybackQuality?.("hd1080");
          requestVideoPlayback(playerId);
          playerRef.current?.playVideo();
          setIsLoading(false);
        },
        onStateChange: (event) => {
          if (event.data === api.PlayerState?.PLAYING) {
            requestVideoPlayback(playerId);
          }

          if (
            event.data === api.PlayerState?.PAUSED ||
            event.data === api.PlayerState?.ENDED
          ) {
            clearActiveVideo(playerId);
          }
        },
      },
    });
  }

  async function toggleFullscreen() {
    const iframe = getPlayerIframe();

    if (!iframe) {
      return;
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    try {
      await iframe.requestFullscreen();
    } catch {
    }
  }
  return (
    <section
      id={feature.id}
      ref={containerRef}
      aria-labelledby={headingId}
      data-interview-feature-id={feature.id}
      className="overflow-x-clip border-t border-border px-4 py-20 sm:px-6 sm:py-28 xl:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
          {feature.chapter[locale]}
        </p>
        <h2
          id={headingId}
          className="mt-5 max-w-5xl whitespace-pre-line break-words text-[clamp(3rem,8vw,7.5rem)] font-semibold uppercase leading-[0.88] text-foreground [overflow-wrap:anywhere] motion-safe:animate-[fade-in-up_700ms_ease-out_forwards] motion-safe:translate-y-4 motion-safe:opacity-0"
        >
          {heading}
        </h2>
        {feature.subtitle ?? feature.intro ? (
          <p className="mt-8 max-w-2xl text-lg leading-8 text-foreground/72">
            {(feature.subtitle ?? feature.intro)?.[locale]}
          </p>
        ) : null}

        <figure className="mt-10 motion-safe:animate-[fade-in-up_700ms_ease-out_160ms_forwards] motion-safe:translate-y-4 motion-safe:opacity-0 sm:mt-12">
          <div
            className="overflow-hidden bg-background shadow-[0_28px_90px_color-mix(in_srgb,var(--background)_78%,black)]"
          >
            <div
              className="relative aspect-video w-full overflow-hidden bg-background"
            >
              {!hasStarted ? (
                <>
                  <Image
                    src={poster}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 1280px, 100vw"
                    className="object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--background)_8%,transparent)_0%,color-mix(in_srgb,var(--background)_30%,transparent)_100%)]"
                    aria-hidden="true"
                  />
                  <button
                    type="button"
                    onClick={startPlayback}
                    aria-label={labels.play}
                    className="group/play absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-primary/70 bg-primary text-background shadow-[0_0_48px_color-mix(in_srgb,var(--primary)_42%,transparent)] transition duration-300 hover:scale-105 hover:bg-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none sm:h-24 sm:w-24"
                  >
                    <span
                      aria-hidden="true"
                      className="ml-1 h-0 w-0 border-y-[0.7rem] border-l-[1.05rem] border-y-transparent border-l-background transition duration-300 group-hover/play:border-l-background motion-reduce:transition-none sm:border-y-[0.85rem] sm:border-l-[1.25rem]"
                    />
                  </button>
                </>
              ) : null}

              <div
                ref={playerMountRef}
                data-testid="youtube-player-mount"
                className={
                  hasStarted
                    ? "absolute inset-0 [&_iframe]:h-full [&_iframe]:w-full"
                    : "hidden"
                }
              />

              {isLoading ? (
                <div className="absolute inset-0 grid place-items-center bg-background/42 text-sm font-semibold uppercase tracking-[0.18em] text-foreground/72">
                  Loading interview
                </div>
              ) : null}

              {hasStarted && !isLoading ? (
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? labels.exitFullscreen : labels.fullscreen}
                  className="absolute right-4 top-4 z-10 grid h-14 w-14 cursor-pointer place-items-center rounded-full border border-foreground/12 bg-background/45 text-foreground shadow-[0_0_32px_color-mix(in_srgb,var(--background)_70%,black)] backdrop-blur-sm transition duration-300 hover:scale-105 hover:bg-background/62 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none sm:h-16 sm:w-16"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                  >
                    <path d="M4 9V4h5" />
                    <path d="M20 9V4h-5" />
                    <path d="M4 15v5h5" />
                    <path d="M20 15v5h-5" />
                  </svg>
                </button>
              ) : null}
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}

function youtubePoster(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
}

function loadYouTubeApi() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("YouTube API cannot load on the server."));
  }

  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (youTubeApiPromise) {
    return youTubeApiPromise;
  }

  youTubeApiPromise = new Promise<YouTubeApi>((resolve, reject) => {
    const existingCallback = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      existingCallback?.();

      if (window.YT?.Player) {
        resolve(window.YT);
      } else {
        reject(new Error("YouTube API loaded without a Player constructor."));
      }
    };

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => reject(new Error("Failed to load YouTube API."));
    document.head.appendChild(script);
  });

  return youTubeApiPromise;
}
