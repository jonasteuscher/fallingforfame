"use client";

import Image from "next/image";
import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { useAudioController } from "@/components/audio";
import type { Locale } from "@/i18n/config";
import type { AthleteAudioStory } from "@/types/athlete";

type AudioStoryProps = {
  story: AthleteAudioStory;
  locale: Locale;
};

type SubtitleEntry = {
  index: number;
  start: number;
  end: number;
  text: string;
};

const fallbackDuration = 0;

export function AudioStory({ story, locale }: AudioStoryProps) {
  const headingId = useId();
  const storyId = `audio-story-${story.id}`;
  const labels = audioStoryLabels[locale];
  const displayTitle =
    typeof story.displayTitle === "string"
      ? story.displayTitle
      : story.displayTitle[locale];

  return (
    <section
      aria-labelledby={headingId}
      data-audio-story-id={story.id}
      className="overflow-x-clip border-t border-border px-4 py-20 sm:px-6 sm:py-28 xl:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
          {story.chapter[locale]}
        </p>
        <h2
          id={headingId}
          className="mt-5 max-w-5xl whitespace-pre-line break-words text-[clamp(3rem,8vw,7.5rem)] font-semibold uppercase leading-[0.88] text-foreground [overflow-wrap:anywhere] motion-safe:animate-[fade-in-up_700ms_ease-out_forwards] motion-safe:translate-y-4 motion-safe:opacity-0"
        >
          {displayTitle}
        </h2>
        {story.description ? (
          <p className="mt-8 max-w-2xl text-lg leading-8 text-foreground/72">
            {story.description[locale]}
          </p>
        ) : null}

        <AudioStoryCard
          storyId={storyId}
          story={story}
          locale={locale}
          labels={labels}
        />
      </div>
    </section>
  );
}

function AudioStoryCard({
  storyId,
  story,
  locale,
  labels,
}: {
  storyId: string;
  story: AthleteAudioStory;
  locale: Locale;
  labels: AudioStoryLabels;
}) {
  const containerRef = useRef<HTMLElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const progressFillRef = useRef<HTMLSpanElement | null>(null);
  const progressThumbRef = useRef<HTMLSpanElement | null>(null);
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const lastSecondRef = useRef(-1);
  const { activeId, play, stop } = useAudioController();
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const [transcript, setTranscript] = useState<SubtitleEntry[]>([]);
  const [transcriptError, setTranscriptError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(fallbackDuration);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(true);
  const transcriptSrc = story.transcript[locale];
  const resolvedDuration = duration || getDurationFromTranscript(transcript);
  const progress = resolvedDuration > 0 ? currentTime / resolvedDuration : 0;
  const activeSubtitleIndex = useMemo(
    () =>
      transcript.findIndex(
        (entry) => currentTime >= entry.start && currentTime < entry.end,
      ),
    [currentTime, transcript],
  );

  useEffect(() => {
    if (!containerRef.current) {
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
      { rootMargin: "160px 0px", threshold: 0.18 },
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = containerRef.current;

    if (!node || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (activeId !== storyId || !entry) {
          return;
        }

        if (!entry.isIntersecting || entry.intersectionRatio < 0.35) {
          audioRef.current?.pause();
          stop();
        }
      },
      { threshold: [0, 0.35, 0.75] },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [activeId, stop, storyId]);

  useEffect(() => {
    if (!hasEnteredViewport) {
      return;
    }

    let cancelled = false;

    fetch(transcriptSrc)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load transcript: ${transcriptSrc}`);
        }

        return response.text();
      })
      .then((text) => {
        if (!cancelled) {
          setTranscript(parseSrt(text));
          setTranscriptError(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTranscript([]);
          setTranscriptError(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [hasEnteredViewport, transcriptSrc]);

  useEffect(() => {
    const audio = new Audio(story.audio.src);
    audio.preload = "metadata";
    audioRef.current = audio;

    function handleLoadedMetadata() {
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    }

    function handlePlay() {
      setIsPlaying(true);
      startProgressLoop();
    }

    function handlePause() {
      setIsPlaying(false);
      stopProgressLoop();
      updateProgress(audio.currentTime);
    }

    function handleEnded() {
      setIsPlaying(false);
      stopProgressLoop();
      updateProgress(audio.duration || resolvedDuration);
      stop();
    }

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      stopProgressLoop();
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audioRef.current = null;
    };
    // resolvedDuration is intentionally excluded because these listeners should be
    // attached once per audio source.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story.audio.src, stop]);

  useEffect(() => {
    if (activeId !== storyId && isPlaying) {
      audioRef.current?.pause();
    }
  }, [activeId, isPlaying, storyId]);

  function startProgressLoop() {
    stopProgressLoop();

    const tick = () => {
      const audio = audioRef.current;

      if (!audio) {
        return;
      }

      updateProgress(audio.currentTime);
      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);
  }

  function stopProgressLoop() {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }

  function updateProgress(nextTime: number) {
    const nextDuration = audioRef.current?.duration || resolvedDuration;
    const nextProgress = nextDuration > 0 ? clamp(nextTime / nextDuration, 0, 1) : 0;

    progressFillRef.current?.style.setProperty(
      "transform",
      `scaleX(${nextProgress})`,
    );
    progressThumbRef.current?.style.setProperty(
      "left",
      `${nextProgress * 100}%`,
    );
    waveformRef.current?.style.setProperty("--audio-progress", String(nextProgress));

    const nextSecond = Math.floor(nextTime);

    if (nextSecond !== lastSecondRef.current) {
      lastSecondRef.current = nextSecond;
      setCurrentTime(nextTime);
    }
  }

  async function togglePlayback() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      stop();
      return;
    }

    await play(storyId, audio);
  }

  function seekTo(clientX: number, element: HTMLElement) {
    const nextDuration = audioRef.current?.duration || resolvedDuration;

    if (nextDuration <= 0) {
      return;
    }

    const rect = element.getBoundingClientRect();
    const nextProgress = clamp((clientX - rect.left) / rect.width, 0, 1);
    const nextTime = nextProgress * nextDuration;

    if (audioRef.current) {
      audioRef.current.currentTime = nextTime;
    }

    updateProgress(nextTime);
    setCurrentTime(nextTime);
  }

  function handleProgressPointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    seekTo(event.clientX, event.currentTarget);
  }

  function handleProgressPointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }

    seekTo(event.clientX, event.currentTarget);
  }

  function handleProgressKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const nextDuration = audioRef.current?.duration || resolvedDuration;

    if (nextDuration <= 0) {
      return;
    }

    const step = event.shiftKey ? 10 : 5;
    const audio = audioRef.current;
    const baseTime = audio?.currentTime ?? currentTime;
    let nextTime = baseTime;

    if (event.key === "ArrowLeft") {
      nextTime = Math.max(0, baseTime - step);
    } else if (event.key === "ArrowRight") {
      nextTime = Math.min(nextDuration, baseTime + step);
    } else if (event.key === "Home") {
      nextTime = 0;
    } else if (event.key === "End") {
      nextTime = nextDuration;
    } else {
      return;
    }

    event.preventDefault();

    if (audio) {
      audio.currentTime = nextTime;
    }

    updateProgress(nextTime);
    setCurrentTime(nextTime);
  }

  return (
    <figure
      ref={containerRef}
      className="mt-10 motion-safe:animate-[fade-in-up_700ms_ease-out_160ms_forwards] motion-safe:translate-y-4 motion-safe:opacity-0 sm:mt-12"
    >
      <div className="border border-border bg-background/72 p-4 shadow-[0_28px_90px_color-mix(in_srgb,var(--background)_78%,black)] backdrop-blur sm:p-6 lg:p-8">
        <div className="grid gap-7 md:grid-cols-[11rem_1fr] lg:grid-cols-[14rem_1fr]">
          <div className="motion-safe:animate-[fade-in-up_700ms_ease-out_260ms_forwards] motion-safe:translate-y-4 motion-safe:opacity-0">
            {story.portrait ? (
              <Image
                src={story.portrait}
                alt={story.portraitAlt?.[locale] ?? ""}
                width={420}
                height={520}
                className="aspect-[4/5] w-36 object-cover object-top md:w-full"
              />
            ) : (
              <div className="aspect-[4/5] w-36 border border-border bg-surface md:w-full" />
            )}
          </div>

          <div className="min-w-0">
            <figcaption className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/56">
              {labels.cardEyebrow}
            </figcaption>
            <h3 className="mt-3 max-w-2xl text-2xl font-semibold uppercase leading-none text-foreground sm:text-4xl">
              {story.title[locale]}
            </h3>

            <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={togglePlayback}
                aria-label={isPlaying ? labels.pause(story.title[locale]) : labels.play(story.title[locale])}
                className="group/play grid h-16 w-16 shrink-0 cursor-pointer place-items-center rounded-full border border-primary/70 bg-primary text-background shadow-[0_0_38px_color-mix(in_srgb,var(--primary)_32%,transparent)] transition duration-300 hover:scale-105 hover:bg-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
              >
                {isPlaying ? (
                  <span
                    aria-hidden="true"
                    className="flex h-5 w-5 items-center justify-center gap-1"
                  >
                    <span className="h-5 w-1.5 bg-background" />
                    <span className="h-5 w-1.5 bg-background" />
                  </span>
                ) : (
                  <span
                    aria-hidden="true"
                    className="ml-1 h-0 w-0 border-y-[0.55rem] border-l-[0.85rem] border-y-transparent border-l-background"
                  />
                )}
              </button>

              <AudioProgressBar
                currentTime={currentTime}
                duration={resolvedDuration}
                progress={progress}
                labels={labels}
                fillRef={progressFillRef}
                thumbRef={progressThumbRef}
                onPointerDown={handleProgressPointerDown}
                onPointerMove={handleProgressPointerMove}
                onKeyDown={handleProgressKeyDown}
              />
            </div>

            <AudioWaveform
              ref={waveformRef}
              waveform={story.waveform}
              progress={progress}
            />

            <AudioTranscript
              entries={transcript}
              activeIndex={activeSubtitleIndex}
              isOpen={isTranscriptOpen}
              hasError={transcriptError}
              labels={labels}
              onToggle={() => setIsTranscriptOpen((value) => !value)}
              onSelect={(entry) => {
                if (audioRef.current) {
                  audioRef.current.currentTime = entry.start;
                }

                updateProgress(entry.start);
                setCurrentTime(entry.start);
              }}
            />
          </div>
        </div>
      </div>
    </figure>
  );
}

function AudioProgressBar({
  currentTime,
  duration,
  progress,
  labels,
  fillRef,
  thumbRef,
  onPointerDown,
  onPointerMove,
  onKeyDown,
}: {
  currentTime: number;
  duration: number;
  progress: number;
  labels: AudioStoryLabels;
  fillRef: React.RefObject<HTMLSpanElement | null>;
  thumbRef: React.RefObject<HTMLSpanElement | null>;
  onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}) {
  return (
    <div className="grid min-w-0 flex-1 grid-cols-[3.5rem_1fr_3.5rem] items-center gap-3 text-sm font-semibold tabular-nums text-foreground/70">
      <span>{formatTime(currentTime)}</span>
      <button
        type="button"
        aria-label={labels.seek}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(currentTime)}
        role="slider"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onKeyDown={onKeyDown}
        className="relative h-8 cursor-pointer touch-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <span
          className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-foreground/22"
          aria-hidden="true"
        />
        <span
          ref={fillRef}
          className="absolute left-0 top-1/2 h-[3px] w-full origin-left -translate-y-1/2 bg-primary"
          style={{ transform: `scaleX(${progress})` }}
          aria-hidden="true"
        />
        <span
          ref={thumbRef}
          className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_18px_color-mix(in_srgb,var(--primary)_54%,transparent)]"
          style={{ left: `${progress * 100}%` }}
          aria-hidden="true"
        />
      </button>
      <span className="text-right">{formatTime(duration)}</span>
    </div>
  );
}

const AudioWaveform = forwardRef<
  HTMLDivElement,
  {
    waveform: number[];
    progress: number;
  }
>(function AudioWaveform({ waveform, progress }, ref) {
  return (
    <div
      ref={ref}
      className="mt-7 flex h-16 items-end gap-1.5 motion-safe:animate-[fade-in-up_700ms_ease-out_340ms_forwards] motion-safe:translate-y-4 motion-safe:opacity-0"
      style={{ "--audio-progress": progress } as CSSProperties}
      aria-hidden="true"
      data-testid="audio-waveform"
    >
      {waveform.map((value, index) => {
        const height = `${Math.max(value * 100, 8)}%`;
        const threshold = waveform.length <= 1 ? 1 : index / (waveform.length - 1);
        const isActive = progress >= threshold;

        return (
          <span
            key={`${index}-${value}`}
            className="relative w-full overflow-hidden rounded-full bg-foreground/20 transition-colors duration-300 motion-reduce:transition-none"
            style={{ height }}
          >
            <span
              className="absolute inset-0 origin-bottom bg-primary transition duration-500 motion-reduce:transition-none"
              style={{
                opacity: isActive ? 1 : 0,
                transform: isActive ? "scaleY(1)" : "scaleY(0.35)",
              }}
            />
          </span>
        );
      })}
    </div>
  );
});

function AudioTranscript({
  entries,
  activeIndex,
  isOpen,
  hasError,
  labels,
  onToggle,
  onSelect,
}: {
  entries: SubtitleEntry[];
  activeIndex: number;
  isOpen: boolean;
  hasError: boolean;
  labels: AudioStoryLabels;
  onToggle: () => void;
  onSelect: (entry: SubtitleEntry) => void;
}) {
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }, [activeIndex]);

  const status = useMemo(() => {
    if (hasError) {
      return labels.transcriptError;
    }

    if (entries.length === 0) {
      return labels.transcriptLoading;
    }

    return null;
  }, [entries.length, hasError, labels]);

  return (
    <div className="mt-7 border-t border-border pt-5">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-foreground/62 transition hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
      >
        <span>{labels.transcript}</span>
        <span aria-hidden="true" className="text-primary">
          {isOpen ? "-" : "+"}
        </span>
      </button>
      <div
        className={
          isOpen
            ? "grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 motion-reduce:transition-none"
            : "grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 motion-reduce:transition-none"
        }
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className="mt-5 max-h-72 space-y-4 overflow-y-auto pr-2"
            aria-live="polite"
            data-testid="audio-transcript"
          >
            {status ? (
              <p className="text-base leading-7 text-foreground/62">{status}</p>
            ) : (
              entries.map((entry, index) => {
                const isCurrent = index === activeIndex;
                const isPrevious = index < activeIndex;

                return (
                  <button
                    type="button"
                    key={entry.index}
                    ref={isCurrent ? activeRef : null}
                    onClick={() => onSelect(entry)}
                    aria-label={labels.jumpToTranscript(entry.text)}
                    data-active={isCurrent ? "true" : "false"}
                    className={
                      isCurrent
                        ? "block w-full cursor-pointer text-left text-xl font-semibold leading-8 text-primary opacity-100 transition duration-500 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
                        : isPrevious
                          ? "block w-full cursor-pointer text-left text-base leading-7 text-foreground/42 opacity-80 transition duration-500 hover:text-primary/82 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
                          : "block w-full cursor-pointer text-left text-base leading-7 text-foreground opacity-95 transition duration-500 hover:text-primary/82 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
                    }
                  >
                    {entry.text}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type AudioStoryLabels = {
  cardEyebrow: string;
  play: (title: string) => string;
  pause: (title: string) => string;
  seek: string;
  transcript: string;
  transcriptLoading: string;
  transcriptError: string;
  jumpToTranscript: (text: string) => string;
};

const audioStoryLabels: Record<Locale, AudioStoryLabels> = {
  en: {
    cardEyebrow: "Internal reflection",
    play: (title) => `Play ${title}`,
    pause: (title) => `Pause ${title}`,
    seek: "Seek audio story",
    transcript: "Transcript",
    transcriptLoading: "Loading transcript...",
    transcriptError: "Transcript could not be loaded.",
    jumpToTranscript: (text) => `Jump to transcript section: ${text}`,
  },
  de: {
    cardEyebrow: "Innere Reflexion",
    play: (title) => `${title} abspielen`,
    pause: (title) => `${title} pausieren`,
    seek: "Audio Story durchsuchen",
    transcript: "Transkript",
    transcriptLoading: "Transkript wird geladen...",
    transcriptError: "Transkript konnte nicht geladen werden.",
    jumpToTranscript: (text) => `Zum Transkriptabschnitt springen: ${text}`,
  },
};

export function parseSrt(source: string): SubtitleEntry[] {
  return source
    .replace(/\r/g, "")
    .trim()
    .split(/\n{2,}/)
    .map((block) => {
      const [indexLine, timeLine, ...textLines] = block.split("\n");
      const match = timeLine?.match(
        /(\d{2}:\d{2}:\d{2},\d{3})\s+-->\s+(\d{2}:\d{2}:\d{2},\d{3})/,
      );

      if (!match) {
        return null;
      }

      return {
        index: Number(indexLine),
        start: parseSrtTime(match[1]),
        end: parseSrtTime(match[2]),
        text: textLines.join(" ").trim(),
      };
    })
    .filter((entry): entry is SubtitleEntry => Boolean(entry));
}

function parseSrtTime(value: string) {
  const [time, milliseconds = "0"] = value.split(",");
  const [hours = "0", minutes = "0", seconds = "0"] = time.split(":");

  return (
    Number(hours) * 3600 +
    Number(minutes) * 60 +
    Number(seconds) +
    Number(milliseconds) / 1000
  );
}

function getDurationFromTranscript(entries: SubtitleEntry[]) {
  return entries.at(-1)?.end ?? fallbackDuration;
}

function formatTime(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return "00:00";
  }

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
