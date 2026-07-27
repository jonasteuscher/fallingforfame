import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AudioProvider } from "@/components/audio";
import { AudioStory, parseSrt } from "@/components/athletes/AudioStory";
import { athletes } from "@/data/athletes";
import type { AthleteAudioStory } from "@/types/athlete";

const enTranscript = `1
00:00:00,000 --> 00:00:17,020
Knowledge dispels fear.

2
00:00:17,020 --> 00:00:36,880
You become comfortable because you understand.

3
00:00:36,880 --> 00:01:04,620
The less doubt you have, the less fear you have.`;

const deTranscript = `1
00:00:00,000 --> 00:00:17,020
Wissen vertreibt Angst.

2
00:00:17,020 --> 00:01:04,620
Je mehr Wissen man hat, desto weniger Zweifel hat man.`;

const audioInstances: MockAudio[] = [];
let rafCallbacks: FrameRequestCallback[] = [];
let intersectionObservers: MockIntersectionObserver[] = [];

class MockAudio extends EventTarget {
  currentTime = 0;
  duration = 64.62;
  preload = "";
  pause = vi.fn(() => {
    this.dispatchEvent(new Event("pause"));
  });
  play = vi.fn(async () => {
    this.dispatchEvent(new Event("play"));
  });

  constructor(public src: string) {
    super();
    audioInstances.push(this);
  }
}

class MockIntersectionObserver {
  constructor(private callback: IntersectionObserverCallback) {
    intersectionObservers.push(this);
  }

  observe() {
    this.trigger({ isIntersecting: true, intersectionRatio: 1 });
  }

  disconnect() {}

  trigger(entry: Partial<IntersectionObserverEntry>) {
    this.callback(
      [entry as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

describe("AudioStory", () => {
  beforeEach(() => {
    audioInstances.length = 0;
    rafCallbacks = [];
    intersectionObservers = [];

    vi.stubGlobal("Audio", MockAudio);
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) =>
        Promise.resolve({
          ok: true,
          text: () =>
            Promise.resolve(url.endsWith("_DE.srt") ? deTranscript : enTranscript),
        }),
      ),
    );

    window.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
      rafCallbacks.push(callback);
      return rafCallbacks.length;
    });
    window.cancelAnimationFrame = vi.fn();

    window.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;
    Element.prototype.setPointerCapture = vi.fn();
    Element.prototype.hasPointerCapture = vi.fn(() => true);
    Element.prototype.scrollIntoView = vi.fn();
    Element.prototype.getBoundingClientRect = vi.fn(
      () =>
        ({
          left: 0,
          width: 100,
          top: 0,
          height: 8,
          right: 100,
          bottom: 8,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        }) as DOMRect,
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("loads the English audio and transcript for Tim Howell", async () => {
    renderStory("en");

    expect(audioInstances[0]?.src).toBe(story().audio.src);
    expect(globalThis.fetch).toHaveBeenCalledWith(story().transcript.en);
    expect(await screen.findByText("Knowledge dispels fear.")).toBeVisible();
    expect(screen.getByRole("button", { name: "Play Understanding Fear" }))
      .toBeVisible();
  });

  it("loads the German transcript for German visitors", async () => {
    renderStory("de");

    expect(globalThis.fetch).toHaveBeenCalledWith(story().transcript.de);
    expect(await screen.findByText("Wissen vertreibt Angst.")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Angst verstehen abspielen" }),
    ).toBeVisible();
  });

  it("parses SRT entries with timing data", () => {
    expect(parseSrt(enTranscript).slice(0, 2)).toMatchObject([
      { index: 1, start: 0, end: 17.02, text: "Knowledge dispels fear." },
      {
        index: 2,
        start: 17.02,
        end: 36.88,
        text: "You become comfortable because you understand.",
      },
    ]);
  });

  it("plays, pauses and highlights the current subtitle", async () => {
    renderStory("en");
    await screen.findByText("You become comfortable because you understand.");

    fireEvent.click(screen.getByRole("button", { name: "Play Understanding Fear" }));
    expect(audioInstances[0]?.play).toHaveBeenCalledTimes(1);

    audioInstances[0].currentTime = 18;
    runRaf();

    await waitFor(() =>
      expect(
        screen.getByText("You become comfortable because you understand."),
      ).toHaveAttribute("data-active", "true"),
    );
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Pause Understanding Fear" }));
    expect(audioInstances[0]?.pause).toHaveBeenCalled();
  });

  it("pauses the active audio when the story scrolls out of view", async () => {
    renderStory("en");
    await screen.findByText("Knowledge dispels fear.");

    fireEvent.click(screen.getByRole("button", { name: "Play Understanding Fear" }));
    expect(audioInstances[0]?.play).toHaveBeenCalledTimes(1);

    intersectionObservers.at(-1)?.trigger({
      isIntersecting: false,
      intersectionRatio: 0,
    });

    expect(audioInstances[0]?.pause).toHaveBeenCalled();
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Play Understanding Fear" }),
      ).toBeVisible(),
    );
  });

  it("keeps only one audio story playing at a time", async () => {
    const first = story();
    const second: AthleteAudioStory = {
      ...first,
      id: "knowledge-dispels-fear-copy",
      title: { en: "Second Reflection", de: "Second Reflection" },
    };

    render(
      <AudioProvider>
        <AudioStory story={first} locale="en" />
        <AudioStory story={second} locale="en" />
      </AudioProvider>,
    );
    await waitFor(() =>
      expect(screen.getAllByText("Knowledge dispels fear.")).toHaveLength(2),
    );

    fireEvent.click(screen.getByRole("button", { name: "Play Understanding Fear" }));
    fireEvent.click(screen.getByRole("button", { name: "Play Second Reflection" }));

    expect(audioInstances[0]?.pause).toHaveBeenCalled();
    expect(audioInstances[1]?.play).toHaveBeenCalled();
  });

  it("renders the waveform and seeks from the custom progress bar", async () => {
    renderStory("en");
    await screen.findByText("Knowledge dispels fear.");

    expect(screen.getByTestId("audio-waveform").querySelectorAll("span").length)
      .toBeGreaterThan(10);

    fireEvent.pointerDown(screen.getByRole("slider", { name: "Seek audio story" }), {
      clientX: 50,
      pointerId: 1,
    });

    expect(audioInstances[0]?.currentTime).toBeCloseTo(32.31, 1);
  });

  it("jumps to a subtitle timestamp when a transcript line is clicked", async () => {
    renderStory("en");
    const transcriptLine = await screen.findByRole("button", {
      name: "Jump to transcript section: You become comfortable because you understand.",
    });

    fireEvent.click(transcriptLine);

    expect(audioInstances[0]?.currentTime).toBeCloseTo(17.02, 2);
    await waitFor(() =>
      expect(
        screen.getByText("You become comfortable because you understand."),
      ).toHaveAttribute("data-active", "true"),
    );
  });

  it("renders responsive layout hooks and collapses the transcript without losing playback", async () => {
    const { container } = renderStory("en");
    await screen.findByText("Knowledge dispels fear.");

    expect(container.querySelector(".md\\:grid-cols-\\[11rem_1fr\\]"))
      .toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Transcript" }));
    expect(screen.getByRole("button", { name: "Transcript" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});

function renderStory(locale: "en" | "de") {
  return render(
    <AudioProvider>
      <AudioStory story={story()} locale={locale} />
    </AudioProvider>,
  );
}

function story() {
  const tim = athletes.find((athlete) => athlete.slug === "tim-howell");
  const audioStory = tim?.audioStories?.find(
    (item) => item.id === "knowledge-dispels-fear",
  );

  if (!audioStory) {
    throw new Error("Tim Howell audio story fixture missing");
  }

  return audioStory;
}

function runRaf() {
  const callback = rafCallbacks.shift();

  if (!callback) {
    throw new Error("No requestAnimationFrame callback queued");
  }

  callback(performance.now());
}
