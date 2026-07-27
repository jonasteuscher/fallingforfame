"use client";

import { useEffect, useMemo, useState } from "react";

export const AUDIO_WAVEFORM_CONFIG = {
  bars: 72,
  barGap: 3,
  minBarHeight: 4,
  maxBarHeight: 48,
  smoothing: 0.72,
  normalise: true,
} as const;

const MIN_AMPLITUDE =
  AUDIO_WAVEFORM_CONFIG.minBarHeight / AUDIO_WAVEFORM_CONFIG.maxBarHeight;

type AudioWaveformProps = {
  audioSrc: string;
  currentTime: number;
  duration: number;
  isLoading?: boolean;
};

type WaveformState =
  | { audioSrc: string; status: "loading"; samples: number[] }
  | { audioSrc: string; status: "ready"; samples: number[] }
  | { audioSrc: string; status: "error"; samples: number[] };

const loadingSamples = Array.from(
  { length: AUDIO_WAVEFORM_CONFIG.bars },
  (_, index) => MIN_AMPLITUDE + ((index % 7) / 7) * 0.18,
);

export function AudioWaveform({
  audioSrc,
  currentTime,
  duration,
  isLoading = false,
}: AudioWaveformProps) {
  const [waveform, setWaveform] = useState<WaveformState>({
    audioSrc,
    status: "loading",
    samples: loadingSamples,
  });
  const progress =
    duration > 0 ? Math.min(Math.max(currentTime / duration, 0), 1) : 0;
  const isStale = waveform.audioSrc !== audioSrc;
  const samples = isStale ? loadingSamples : waveform.samples;
  const waveformStatus = isStale ? "loading" : waveform.status;
  const isPending = isLoading || waveformStatus === "loading";
  const progressText = useMemo(() => `${Math.round(progress * 100)}%`, [progress]);

  useEffect(() => {
    let cancelled = false;

    generateWaveformSamples(audioSrc)
      .then((nextSamples) => {
        if (!cancelled) {
          setWaveform({ audioSrc, status: "ready", samples: nextSamples });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setWaveform({ audioSrc, status: "error", samples: loadingSamples });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [audioSrc]);

  return (
    <div className="mt-7">
      <div
        className="sr-only"
        role="progressbar"
        aria-label="Audio playback progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        {progressText}
      </div>
      <div
        className="grid h-16 w-full items-end overflow-hidden motion-safe:animate-[fade-in-up_700ms_ease-out_340ms_forwards] motion-safe:translate-y-4 motion-safe:opacity-0"
        style={{
          gridTemplateColumns: `repeat(${AUDIO_WAVEFORM_CONFIG.bars}, minmax(0, 1fr))`,
          columnGap: AUDIO_WAVEFORM_CONFIG.barGap,
        }}
        aria-hidden="true"
        data-testid="audio-waveform"
        data-waveform-status={waveformStatus}
      >
        {samples.map((sample, index) => {
          const height = Math.round(
            AUDIO_WAVEFORM_CONFIG.minBarHeight +
              sample *
                (AUDIO_WAVEFORM_CONFIG.maxBarHeight -
                  AUDIO_WAVEFORM_CONFIG.minBarHeight),
          );
          const barStart = index / AUDIO_WAVEFORM_CONFIG.bars;
          const barEnd = (index + 1) / AUDIO_WAVEFORM_CONFIG.bars;
          const activeAmount = Math.min(
            Math.max((progress - barStart) / (barEnd - barStart), 0),
            1,
          );

          return (
            <span
              key={index}
              className={
                isPending
                  ? "relative w-full overflow-hidden rounded-full bg-foreground/18 opacity-70 motion-safe:animate-pulse"
                  : "relative w-full overflow-hidden rounded-full bg-foreground/20 transition-colors duration-300 motion-reduce:transition-none"
              }
              style={{
                height,
                minHeight: AUDIO_WAVEFORM_CONFIG.minBarHeight,
                maxHeight: AUDIO_WAVEFORM_CONFIG.maxBarHeight,
              }}
            >
              <span
                className="absolute inset-0 origin-bottom bg-primary transition duration-300 motion-reduce:transition-none"
                style={{
                  opacity: activeAmount,
                  transform: `scaleY(${0.35 + activeAmount * 0.65})`,
                }}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}

export async function generateWaveformSamples(audioSrc: string) {
  const response = await fetch(audioSrc);

  if (!response.ok) {
    throw new Error(`Failed to load audio waveform source: ${audioSrc}`);
  }

  const AudioContextConstructor = getAudioContextConstructor();

  if (!AudioContextConstructor) {
    throw new Error("AudioContext is not available.");
  }

  const context = new AudioContextConstructor();
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await context.decodeAudioData(arrayBuffer.slice(0));

  await context.close?.();

  return buildWaveformSamples(audioBuffer);
}

export function buildWaveformSamples(audioBuffer: AudioBuffer) {
  const channels = Array.from({ length: audioBuffer.numberOfChannels }, (_, index) =>
    audioBuffer.getChannelData(index),
  );
  const windowSize = Math.max(
    1,
    Math.floor(audioBuffer.length / AUDIO_WAVEFORM_CONFIG.bars),
  );
  const rawSamples = Array.from({ length: AUDIO_WAVEFORM_CONFIG.bars }, (_, index) => {
    const start = index * windowSize;
    const end =
      index === AUDIO_WAVEFORM_CONFIG.bars - 1
        ? audioBuffer.length
        : Math.min(audioBuffer.length, start + windowSize);

    return calculateWindowAmplitude(channels, start, end);
  });
  const smoothedSamples = smoothSamples(rawSamples, AUDIO_WAVEFORM_CONFIG.smoothing);
  const peak = Math.max(...smoothedSamples);

  if (!AUDIO_WAVEFORM_CONFIG.normalise) {
    return smoothedSamples.map((sample) => Math.max(MIN_AMPLITUDE, sample));
  }

  return smoothedSamples.map((sample) => {
    const value = peak === 0 ? 0 : sample / peak;

    return Math.max(MIN_AMPLITUDE, Math.pow(value, 0.75));
  });
}

function calculateWindowAmplitude(
  channels: Float32Array[],
  start: number,
  end: number,
) {
  if (end <= start || channels.length === 0) {
    return 0;
  }

  let sum = 0;
  let count = 0;

  for (const channel of channels) {
    for (let index = start; index < end; index += 1) {
      const value = channel[index] ?? 0;

      sum += value * value;
      count += 1;
    }
  }

  return count === 0 ? 0 : Math.sqrt(sum / count);
}

function smoothSamples(samples: number[], smoothing: number) {
  if (samples.length === 0) {
    return samples;
  }

  const forward = samples.reduce<number[]>((result, sample, index) => {
    result[index] =
      index === 0 ? sample : result[index - 1] * smoothing + sample * (1 - smoothing);

    return result;
  }, []);

  return samples.reduceRight<number[]>((result, sample, index) => {
    const backward =
      index === samples.length - 1
        ? sample
        : result[index + 1] * smoothing + sample * (1 - smoothing);

    result[index] = Math.max(forward[index] ?? 0, backward);

    return result;
  }, []);
}

function getAudioContextConstructor() {
  const candidate = window as typeof window & {
    webkitAudioContext?: typeof AudioContext;
  };

  return candidate.AudioContext ?? candidate.webkitAudioContext;
}
