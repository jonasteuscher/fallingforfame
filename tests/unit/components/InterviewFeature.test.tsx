import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InterviewFeature } from "@/components/athletes/InterviewFeature";
import { athletes } from "@/data/athletes";
import type { AthleteInterviewFeature } from "@/types/athlete";

type MockPlayer = {
  playVideo: ReturnType<typeof vi.fn>;
  pauseVideo: ReturnType<typeof vi.fn>;
  destroy: ReturnType<typeof vi.fn>;
  setSize: ReturnType<typeof vi.fn>;
  setPlaybackQuality: ReturnType<typeof vi.fn>;
};

const labels = {
  play: "Play Tim Howell interview",
  fullscreen: "Open Tim Howell interview fullscreen",
  exitFullscreen: "Exit Tim Howell interview fullscreen",
};

let createdPlayers: MockPlayer[] = [];
let intersectionCallback:
  | ((entries: Array<{ isIntersecting: boolean; intersectionRatio: number }>) => void)
  | null = null;
let iframeRequestFullscreen: ReturnType<typeof vi.fn>;

type MockPlayerOptions = {
  videoId: string;
  host?: string;
  playerVars: Record<string, string | number>;
  events: {
    onReady: () => void;
    onStateChange?: (event: { data: number }) => void;
  };
};

const playerConstructor = vi.fn(function MockYouTubePlayer(
  this: MockPlayer,
  element: HTMLElement,
  options: MockPlayerOptions,
) {
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${options.videoId}`;
    element.appendChild(iframe);

    const player: MockPlayer = {
      playVideo: vi.fn(() => {
        options.events.onStateChange?.({ data: 1 });
      }),
      pauseVideo: vi.fn(() => {
        options.events.onStateChange?.({ data: 2 });
      }),
      destroy: vi.fn(),
      setSize: vi.fn(),
      setPlaybackQuality: vi.fn(),
    };

    createdPlayers.push(player);
    queueMicrotask(options.events.onReady);

    return player;
});

describe("InterviewFeature", () => {
  beforeEach(() => {
    createdPlayers = [];
    playerConstructor.mockClear();
    iframeRequestFullscreen = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(HTMLIFrameElement.prototype, "requestFullscreen", {
      configurable: true,
      value: iframeRequestFullscreen,
    });

    window.YT = {
      Player: playerConstructor as unknown as NonNullable<
        (typeof window)["YT"]
      >["Player"],
      PlayerState: {
        PLAYING: 1,
        PAUSED: 2,
        ENDED: 0,
      },
    };

    class MockIntersectionObserver {
      readonly root = null;
      readonly rootMargin = "";
      readonly thresholds = [];

      constructor(
        callback: (
          entries: Array<{ isIntersecting: boolean; intersectionRatio: number }>,
        ) => void,
      ) {
        intersectionCallback = callback;
      }

      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
      takeRecords = vi.fn(() => []);
    }

    window.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    delete window.YT;
    intersectionCallback = null;
  });

  it("renders the cinematic quote, poster and accessible play control", () => {
    render(
      <InterviewFeature feature={feature("career")} locale="en" labels={labels} />,
    );

    expect(screen.getByText("Social Media")).toBeVisible();
    expect(screen.getByRole("heading", { name: /YOU'RE ONLY AS GOOD/ }))
      .toBeVisible();
    expect(
      screen.queryByText(
        "A longer excerpt from the interview, shaped as a quiet moment inside the profile.",
      ),
    ).not.toBeInTheDocument();
    expect(screen.getByAltText("")).toHaveAttribute(
      "src",
      "https://i.ytimg.com/vi/MJ-CSQxONJs/maxresdefault.jpg",
    );
    expect(
      screen.getByRole("button", { name: "Play Tim Howell interview" }),
    ).toBeVisible();
    expect(screen.getByTestId("youtube-player-mount")).toHaveClass("hidden");
  });

  it("loads the English YouTube interview only after play is pressed", async () => {
    render(
      <InterviewFeature feature={feature("career")} locale="en" labels={labels} />,
    );

    expect(playerConstructor).not.toHaveBeenCalled();
    expect(document.querySelector("iframe")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: labels.play }));

    await waitFor(() => expect(playerConstructor).toHaveBeenCalledTimes(1));
    expect(playerConstructor.mock.calls[0]?.[1].videoId).toBe("MJ-CSQxONJs");
    expect(playerConstructor.mock.calls[0]?.[1].host).toBe(
      "https://www.youtube-nocookie.com",
    );
    expect(playerConstructor.mock.calls[0]?.[1].playerVars).toMatchObject({
      controls: 0,
      disablekb: 0,
      fs: 1,
      iv_load_policy: 3,
      showinfo: 0,
      cc_lang_pref: "en",
    });
    expect(playerConstructor.mock.calls[0]?.[1].playerVars).not.toHaveProperty(
      "cc_load_policy",
    );
    expect(createdPlayers[0]?.playVideo).toHaveBeenCalled();
    expect(createdPlayers[0]?.setSize).toHaveBeenCalledWith("100%", "100%");
    expect(createdPlayers[0]?.setPlaybackQuality).toHaveBeenCalledWith("hd1080");
    expect(document.querySelector("iframe")).toHaveAttribute(
      "title",
      "Tim Howell interview",
    );
    expect(document.querySelector("iframe")).toHaveAttribute("allowfullscreen");
    expect(document.querySelector("iframe")).toHaveAttribute(
      "allow",
      expect.stringContaining("fullscreen"),
    );
    expect(document.querySelector("iframe")).toHaveStyle({
      width: "100%",
      height: "100%",
      position: "absolute",
    });
    const fullscreenButton = screen.getByRole("button", { name: labels.fullscreen });
    expect(fullscreenButton).toBeVisible();
    expect(fullscreenButton).toHaveClass("rounded-full", "bg-background/45");
  });

  it("fullscreen button targets the YouTube iframe to preserve native aspect ratio", async () => {
    render(
      <InterviewFeature feature={feature("career")} locale="en" labels={labels} />,
    );

    fireEvent.click(screen.getByRole("button", { name: labels.play }));
    await waitFor(() => expect(playerConstructor).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByRole("button", { name: labels.fullscreen }));

    expect(iframeRequestFullscreen).toHaveBeenCalledTimes(1);
  });

  it("loads the German YouTube interview for the German locale", async () => {
    render(
      <InterviewFeature feature={feature("career")} locale="de" labels={labels} />,
    );

    fireEvent.click(screen.getByRole("button", { name: labels.play }));

    await waitFor(() => expect(playerConstructor).toHaveBeenCalledTimes(1));
    expect(playerConstructor.mock.calls[0]?.[1].videoId).toBe("nZcqDTgsYGM");
    expect(playerConstructor.mock.calls[0]?.[1].playerVars).toMatchObject({
      cc_lang_pref: "de",
    });
  });

  it("loads the decision-making interview data for both locales", async () => {
    const { unmount } = render(
      <InterviewFeature
        feature={feature("decision-making")}
        locale="en"
        labels={labels}
      />,
    );

    expect(screen.getByText("DECISION MAKING")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: /MAKE THE\s+RIGHT DECISION/ }),
    ).toBeVisible();
    expect(screen.getByAltText("")).toHaveAttribute(
      "src",
      "https://i.ytimg.com/vi/N9JUEpIOwkA/maxresdefault.jpg",
    );
    fireEvent.click(screen.getByRole("button", { name: labels.play }));
    await waitFor(() => expect(playerConstructor).toHaveBeenCalledTimes(1));
    expect(playerConstructor.mock.calls[0]?.[1].videoId).toBe("N9JUEpIOwkA");
    unmount();

    playerConstructor.mockClear();
    createdPlayers = [];

    render(
      <InterviewFeature
        feature={feature("decision-making")}
        locale="de"
        labels={labels}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: labels.play }));
    await waitFor(() => expect(playerConstructor).toHaveBeenCalledTimes(1));
    expect(playerConstructor.mock.calls[0]?.[1].videoId).toBe("Bi4Ba7mDy9Y");
  });

  it("pauses playback when less than 40 percent remains visible", async () => {
    render(
      <InterviewFeature feature={feature("career")} locale="en" labels={labels} />,
    );

    fireEvent.click(screen.getByRole("button", { name: labels.play }));
    await waitFor(() => expect(createdPlayers[0]?.playVideo).toHaveBeenCalled());

    intersectionCallback?.([{ isIntersecting: true, intersectionRatio: 0.2 }]);

    expect(createdPlayers[0]?.pauseVideo).toHaveBeenCalled();
  });

  it("pauses another active interview when a new one starts", async () => {
    render(
      <>
        <InterviewFeature feature={feature("career")} locale="en" labels={labels} />
        <InterviewFeature
          feature={feature("decision-making")}
          locale="de"
          labels={labels}
        />
      </>,
    );

    const buttons = screen.getAllByRole("button", { name: labels.play });

    fireEvent.click(buttons[0]);
    await waitFor(() => expect(createdPlayers[0]?.playVideo).toHaveBeenCalled());

    fireEvent.click(buttons[1]);
    await waitFor(() => expect(createdPlayers[1]?.playVideo).toHaveBeenCalled());

    expect(createdPlayers[0]?.pauseVideo).toHaveBeenCalled();
  });

  it("preserves a stable responsive video box", () => {
    render(
      <InterviewFeature feature={feature("career")} locale="en" labels={labels} />,
    );

    expect(screen.getByTestId("youtube-player-mount").parentElement)
      .toHaveClass("aspect-video");
    expect(screen.getByTestId("youtube-player-mount").parentElement)
      .toHaveClass("fullscreen:w-[min(100vw,177.7778vh)]");
    expect(screen.getByTestId("youtube-player-mount").closest("section"))
      .toHaveClass("overflow-x-clip");
  });
});

function feature(id: string): AthleteInterviewFeature {
  const athlete = athletes.find((item) => item.slug === "tim-howell");

  const interviewFeature = athlete?.interviewFeatures?.find((item) => item.id === id);

  if (!interviewFeature) {
    throw new Error(`Tim Howell ${id} interview fixture missing`);
  }

  return interviewFeature;
}
