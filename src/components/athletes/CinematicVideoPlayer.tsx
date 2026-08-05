"use client";

import { useEffect, useId, useRef, useState } from "react";

import type { Locale } from "@/i18n/config";
import {
  clearActiveVideo,
  registerVideoPlayer,
  requestVideoPlayback,
} from "@/lib/videoPlaybackManager";

type CinematicVideoPlayerProps = {
  src: string;
  type?: string;
  poster?: string | null;
  label: string;
  locale: Locale;
  objectFit?: "contain" | "cover";
};

export function CinematicVideoPlayer({
  src,
  type = "video/mp4",
  poster,
  label,
  locale,
  objectFit = "contain",
}: CinematicVideoPlayerProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const shouldPlayWhenReadyRef = useRef(false);
  const videoId = useId();
  const [sourceEnabled, setSourceEnabled] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const controls = cinematicVideoLabels[locale];

  useEffect(() => {
    return registerVideoPlayer(videoId, () => videoRef.current?.pause());
  }, [videoId]);

  useEffect(() => {
    const node = frameRef.current;

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

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === frameRef.current);
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!sourceEnabled || !video || !shouldPlayWhenReadyRef.current) {
      return;
    }

    shouldPlayWhenReadyRef.current = false;
    video.load();
    void video.play().catch(() => undefined);
  }, [sourceEnabled]);

  async function togglePlayback() {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    setSourceEnabled(true);
    setHasStarted(true);

    if (!sourceEnabled) {
      shouldPlayWhenReadyRef.current = true;
      return;
    }

    if (video.paused) {
      await video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }

  function seekTo(value: number) {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.currentTime = value;
    setCurrentTime(value);
  }

  function toggleMute() {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = !video.muted;
    setIsMuted(video.muted);
  }

  async function toggleFullscreen() {
    const frame = frameRef.current;
    const video = videoRef.current as
      | (HTMLVideoElement & { webkitEnterFullscreen?: () => void })
      | null;

    if (!frame || !video) {
      return;
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    if (frame.requestFullscreen) {
      await frame.requestFullscreen();
    } else {
      video.webkitEnterFullscreen?.();
    }
  }

  return (
    <div
      ref={frameRef}
      className="group/video relative aspect-video w-full overflow-hidden bg-black shadow-[0_28px_90px_color-mix(in_srgb,var(--background)_78%,black)]"
    >
      <video
        ref={videoRef}
        preload="metadata"
        playsInline
        poster={poster ?? undefined}
        aria-label={label}
        title={label}
        onClick={togglePlayback}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onDurationChange={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onVolumeChange={(event) => setIsMuted(event.currentTarget.muted)}
        onPlay={() => {
          setHasStarted(true);
          setIsPlaying(true);
          requestVideoPlayback(videoId);
        }}
        onPause={() => {
          setIsPlaying(false);
          clearActiveVideo(videoId);
        }}
        onEnded={() => {
          setIsPlaying(false);
          clearActiveVideo(videoId);
        }}
        className={`h-full w-full cursor-pointer bg-black ${
          objectFit === "cover" ? "object-cover" : "object-contain"
        }`}
      >
        {sourceEnabled ? <source src={src} type={type} /> : null}
      </video>

      {!hasStarted ? (
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={controls.play(label)}
          className="group/play absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-primary/70 bg-primary text-background shadow-[0_0_48px_color-mix(in_srgb,var(--primary)_42%,transparent)] transition duration-300 hover:scale-105 hover:bg-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none sm:h-24 sm:w-24"
        >
          <span
            aria-hidden="true"
            className="ml-1 h-0 w-0 border-y-[0.7rem] border-l-[1.05rem] border-y-transparent border-l-background sm:border-y-[0.85rem] sm:border-l-[1.25rem]"
          />
        </button>
      ) : null}

      {hasStarted ? (
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/90 via-black/68 to-transparent px-3 pb-3 pt-10 text-white sm:gap-3 sm:px-5 sm:pb-5 sm:pt-14">
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={isPlaying ? controls.pause(label) : controls.play(label)}
            className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full border border-white/35 bg-black/35 transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none"
          >
            {isPlaying ? (
              <span aria-hidden="true" className="flex h-4 items-center gap-1">
                <span className="h-4 w-1 bg-current" />
                <span className="h-4 w-1 bg-current" />
              </span>
            ) : (
              <span
                aria-hidden="true"
                className="ml-0.5 h-0 w-0 border-y-[0.42rem] border-l-[0.65rem] border-y-transparent border-l-current"
              />
            )}
          </button>

          <span className="hidden w-11 text-right text-xs font-semibold tabular-nums sm:block">
            {formatMediaTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step="0.1"
            value={Math.min(currentTime, duration || 0)}
            onChange={(event) => seekTo(Number(event.currentTarget.value))}
            aria-label={controls.seek}
            className="h-11 min-w-0 flex-1 cursor-pointer accent-primary"
          />
          <span className="hidden w-11 text-xs font-semibold tabular-nums sm:block">
            {formatMediaTime(duration)}
          </span>

          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? controls.unmute : controls.mute}
            className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full border border-white/35 bg-black/35 transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
              strokeLinejoin="miter"
            >
              <path d="M4 9h4l5-4v14l-5-4H4z" />
              {isMuted ? (
                <path d="m17 9 4 6m0-6-4 6" />
              ) : (
                <path d="M17 9a4 4 0 0 1 0 6m2-9a8 8 0 0 1 0 12" />
              )}
            </svg>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? controls.exitFullscreen : controls.fullscreen}
            className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full border border-white/35 bg-black/35 transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
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
        </div>
      ) : null}
    </div>
  );
}

const cinematicVideoLabels = {
  en: {
    play: (title: string) => `Play ${title}`,
    pause: (title: string) => `Pause ${title}`,
    seek: "Seek through video",
    mute: "Mute video",
    unmute: "Unmute video",
    fullscreen: "Open video fullscreen",
    exitFullscreen: "Exit video fullscreen",
  },
  de: {
    play: (title: string) => `${title} abspielen`,
    pause: (title: string) => `${title} pausieren`,
    seek: "Im Video suchen",
    mute: "Video stummschalten",
    unmute: "Videoton einschalten",
    fullscreen: "Video im Vollbild öffnen",
    exitFullscreen: "Video-Vollbild schliessen",
  },
} as const;

function formatMediaTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
