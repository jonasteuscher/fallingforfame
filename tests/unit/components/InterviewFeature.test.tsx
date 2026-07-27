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
let elementRequestFullscreen: ReturnType<typeof vi.fn>;

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
    elementRequestFullscreen = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(HTMLElement.prototype, "requestFullscreen", {
      configurable: true,
      value: elementRequestFullscreen,
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
    const heading = screen.getByRole("heading", { name: /You're Only as Good/ });
    expect(heading).toBeVisible();
    expect(heading).toHaveClass("uppercase");
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
      cc_load_policy: 0,
      hl: "en",
    });
    expect(playerConstructor.mock.calls[0]?.[1].playerVars)
      .not.toHaveProperty("cc_lang_pref");
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

  it("fullscreen button targets the YouTube iframe", async () => {
    render(
      <InterviewFeature feature={feature("career")} locale="en" labels={labels} />,
    );

    fireEvent.click(screen.getByRole("button", { name: labels.play }));
    await waitFor(() => expect(playerConstructor).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByRole("button", { name: labels.fullscreen }));

    expect(elementRequestFullscreen).toHaveBeenCalledTimes(1);
    expect(elementRequestFullscreen.mock.instances[0]).toBe(
      document.querySelector("iframe"),
    );
  });

  it("loads the German YouTube interview for the German locale", async () => {
    render(
      <InterviewFeature feature={feature("career")} locale="de" labels={labels} />,
    );

    fireEvent.click(screen.getByRole("button", { name: labels.play }));

    await waitFor(() => expect(playerConstructor).toHaveBeenCalledTimes(1));
    expect(playerConstructor.mock.calls[0]?.[1].videoId).toBe("nZcqDTgsYGM");
    expect(playerConstructor.mock.calls[0]?.[1].playerVars).toMatchObject({
      cc_load_policy: 0,
      hl: "de",
    });
    expect(playerConstructor.mock.calls[0]?.[1].playerVars)
      .not.toHaveProperty("cc_lang_pref");
  });

  it("loads the decision-making interview data for both locales", async () => {
    const { unmount } = render(
      <InterviewFeature
        feature={feature("decision-making")}
        locale="en"
        labels={labels}
      />,
    );

    expect(screen.getByText("Decision Making")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: /Make the\s+Right Decision/ }),
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

  it("loads Lukas Loibl's custom-poster interview data for both locales", async () => {
    const { unmount } = render(
      <InterviewFeature
        feature={feature("the-mountain-will-still-be-here", "lukas-loibl")}
        locale="en"
        labels={{
          play: "Play Lukas Loibl interview about choosing not to jump",
          fullscreen: "Open Lukas Loibl interview fullscreen",
          exitFullscreen: "Exit Lukas Loibl interview fullscreen",
        }}
      />,
    );

    expect(screen.getByText("Choosing Not to Jump")).toBeVisible();
    expect(screen.queryByText("Interview")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "The Mountain Will Still Be Here",
      }),
    ).toBeVisible();
    expect(
      screen.getByText(/Sometimes the safest decision is to hike back down/),
    ).toBeVisible();
    expect(screen.getByAltText("")).toHaveAttribute(
      "src",
      "https://i.ytimg.com/vi/B4Bsp_ewxik/maxresdefault.jpg",
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: "Play Lukas Loibl interview about choosing not to jump",
      }),
    );
    await waitFor(() => expect(playerConstructor).toHaveBeenCalledTimes(1));
    expect(playerConstructor.mock.calls[0]?.[1].videoId).toBe("B4Bsp_ewxik");
    expect(document.querySelector("iframe")).toHaveAttribute(
      "title",
      "Lukas Loibl interview about choosing not to jump",
    );
    unmount();

    playerConstructor.mockClear();
    createdPlayers = [];

    render(
      <InterviewFeature
        feature={feature("planning-comes-first", "lukas-loibl")}
        locale="de"
        labels={{
          play: "Lukas Loibl Interview über Planung vor dem BASE Jumping abspielen",
          fullscreen: "Open Lukas Loibl interview fullscreen",
          exitFullscreen: "Exit Lukas Loibl interview fullscreen",
        }}
        layout="text-first"
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Planung ist oberste Priorität" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Planung ist oberste Priorität" }),
    ).toHaveClass("[overflow-wrap:normal]", "[text-wrap:balance]");
    expect(screen.getByAltText("")).toHaveAttribute(
      "src",
      "https://i.ytimg.com/vi/jfAIEg2GOGY/maxresdefault.jpg",
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: "Lukas Loibl Interview über Planung vor dem BASE Jumping abspielen",
      }),
    );
    await waitFor(() => expect(playerConstructor).toHaveBeenCalledTimes(1));
    expect(playerConstructor.mock.calls[0]?.[1].videoId).toBe("jfAIEg2GOGY");
    expect(playerConstructor.mock.calls[0]?.[1].playerVars).toMatchObject({
      hl: "de",
    });
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
      .not.toHaveClass("fullscreen:w-[min(100vw,177.7778vh)]");
    expect(screen.getByTestId("youtube-player-mount").closest("section"))
      .toHaveClass("overflow-x-clip");
  });
});

function feature(
  id: string,
  athleteSlug: "tim-howell" | "lukas-loibl" = "tim-howell",
): AthleteInterviewFeature {
  const athlete = athletes.find((item) => item.slug === athleteSlug);

  const interviewFeature = athlete?.interviewFeatures?.find((item) => item.id === id);

  if (!interviewFeature) {
    throw new Error(`${athleteSlug} ${id} interview fixture missing`);
  }

  return interviewFeature;
}
