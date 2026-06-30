"use client";

import { useEffect, useRef, useState } from "react";

import type { VideoAsset } from "@/types/media";

type CustomVideoPlayerProps = {
  video?: VideoAsset;
};

function formatTime(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return "0:00";
  }

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function CustomVideoPlayer({ video }: CustomVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  async function togglePlay() {
    const player = videoRef.current;

    if (!player) {
      return;
    }

    if (player.paused) {
      await player.play();
    } else {
      player.pause();
    }
  }

  function handleSeek(value: string) {
    const nextTime = Number(value);
    const player = videoRef.current;

    setCurrentTime(nextTime);

    if (player) {
      player.currentTime = nextTime;
    }
  }

  function handleVolume(value: string) {
    const nextVolume = Number(value);
    const player = videoRef.current;

    setVolume(nextVolume);
    setIsMuted(nextVolume === 0);

    if (player) {
      player.volume = nextVolume;
      player.muted = nextVolume === 0;
    }
  }

  function toggleMute() {
    const player = videoRef.current;

    if (!player) {
      return;
    }

    const nextMuted = !player.muted;

    player.muted = nextMuted;
    setIsMuted(nextMuted);
  }

  async function toggleFullscreen() {
    if (!containerRef.current) {
      return;
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await containerRef.current.requestFullscreen();
  }

  return (
    <div
      ref={containerRef}
      className="group/video overflow-hidden border border-border bg-background"
    >
      <div className="relative bg-background">
        <video
          ref={videoRef}
          preload="metadata"
          poster={video?.poster}
          className="aspect-video w-full max-w-full cursor-pointer bg-background object-contain"
          src={video?.src}
          onClick={togglePlay}
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onVolumeChange={(event) => {
            setVolume(event.currentTarget.volume);
            setIsMuted(event.currentTarget.muted);
          }}
        >
          Your browser does not support the video element.
        </video>
      </div>

      <div className="border-t border-border bg-surface px-3 py-3 sm:px-4">
        <label className="sr-only" htmlFor={`video-progress-${video?.src ?? "clip"}`}>
          Video progress
        </label>
        <input
          id={`video-progress-${video?.src ?? "clip"}`}
          type="range"
          min={0}
          max={duration || 0}
          step="0.1"
          value={Math.min(currentTime, duration || currentTime)}
          onChange={(event) => handleSeek(event.target.value)}
          className="h-2 w-full cursor-pointer appearance-none bg-border [accent-color:var(--primary)]"
        />

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="min-h-10 cursor-pointer border border-border bg-background px-4 text-sm font-semibold uppercase tracking-wide text-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>

          <p className="min-w-28 text-sm font-semibold tabular-nums text-foreground/72">
            {formatTime(currentTime)} / {formatTime(duration)}
          </p>

          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              className="min-h-10 cursor-pointer border border-border bg-background px-4 text-sm font-semibold uppercase tracking-wide text-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? "Unmute" : "Mute"}
            </button>

            <label
              className="sr-only"
              htmlFor={`video-volume-${video?.src ?? "clip"}`}
            >
              Video volume
            </label>
            <input
              id={`video-volume-${video?.src ?? "clip"}`}
              type="range"
              min={0}
              max={1}
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(event) => handleVolume(event.target.value)}
              className="h-2 w-24 cursor-pointer appearance-none bg-border [accent-color:var(--primary)]"
            />

            <button
              type="button"
              className="min-h-10 cursor-pointer border border-border bg-background px-4 text-sm font-semibold uppercase tracking-wide text-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
            >
              {isFullscreen ? "Exit" : "Full"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
