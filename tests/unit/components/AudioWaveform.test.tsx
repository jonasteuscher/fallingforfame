import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  AUDIO_WAVEFORM_CONFIG,
  AudioWaveform,
  buildWaveformSamples,
} from "@/components/athletes/AudioWaveform";

const audioData = Float32Array.from({ length: 720 }, (_, index) => {
  const phrase = Math.sin(index / 18) * 0.42;
  const emphasis = index > 240 && index < 390 ? 0.54 : 0.18;

  return phrase * emphasis;
});

class MockAudioContext {
  decodeAudioData = vi.fn(async () => audioBuffer());
  close = vi.fn(async () => undefined);
}

describe("AudioWaveform", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
        }),
      ),
    );
    vi.stubGlobal("AudioContext", MockAudioContext);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("uses one fixed global waveform configuration", () => {
    expect(AUDIO_WAVEFORM_CONFIG).toEqual({
      bars: 72,
      barGap: 3,
      minBarHeight: 4,
      maxBarHeight: 48,
      smoothing: 0.72,
      normalise: true,
    });
  });

  it("renders the configured number of bars from the decoded audio source", async () => {
    render(
      <AudioWaveform
        audioSrc="/audio/tim-howell/Tim_knowledge_dispels_fear - isolated.mp3"
        currentTime={32}
        duration={64}
      />,
    );

    const waveform = screen.getByTestId("audio-waveform");

    expect(waveform.children).toHaveLength(AUDIO_WAVEFORM_CONFIG.bars);
    expect(waveform).toHaveStyle({
      gridTemplateColumns: `repeat(${AUDIO_WAVEFORM_CONFIG.bars}, minmax(0, 1fr))`,
      columnGap: `${AUDIO_WAVEFORM_CONFIG.barGap}px`,
    });
    expect(screen.getByRole("progressbar", { hidden: true })).toHaveAttribute(
      "aria-valuenow",
      "50",
    );

    await waitFor(() =>
      expect(waveform).toHaveAttribute("data-waveform-status", "ready"),
    );
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/audio/tim-howell/Tim_knowledge_dispels_fear - isolated.mp3",
    );
  });

  it("normalises decoded samples with consistent dynamic range", () => {
    const samples = buildWaveformSamples(audioBuffer());
    const minAmplitude =
      AUDIO_WAVEFORM_CONFIG.minBarHeight / AUDIO_WAVEFORM_CONFIG.maxBarHeight;
    const range = Math.max(...samples) - Math.min(...samples);

    expect(samples).toHaveLength(AUDIO_WAVEFORM_CONFIG.bars);
    expect(Math.min(...samples)).toBeGreaterThanOrEqual(minAmplitude);
    expect(Math.max(...samples)).toBeCloseTo(1, 5);
    expect(range).toBeGreaterThan(0.45);
  });
});

function audioBuffer(): AudioBuffer {
  return {
    length: audioData.length,
    duration: 64,
    sampleRate: 44100,
    numberOfChannels: 1,
    getChannelData: () => audioData,
  } as unknown as AudioBuffer;
}
