import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FutureProjectFeature } from "@/components/athletes/FutureProjectFeature";
import { athletes } from "@/data/athletes";

let intersectionObservers: MockIntersectionObserver[] = [];

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

describe("FutureProjectFeature", () => {
  beforeEach(() => {
    intersectionObservers = [];
    window.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders Tim Howell's future project teaser with accessible video metadata", async () => {
    render(<FutureProjectFeature athlete={tim()} locale="en" />);

    expect(screen.getByText("Future Project")).toBeVisible();
    expect(
      screen.getByRole("heading", {
        name: /A Leap from\s+the Top of\s+the World/,
      }),
    ).toBeVisible();
    expect(
      screen.getByText(/Tim is preparing another attempt to fly from Lhotse/),
    ).toBeVisible();
    expect(screen.getByText("Teaser (2023)")).toBeVisible();
    expect(
      screen.getByRole("link", { name: /First attempt \(2024\)/ }),
    ).toHaveAttribute("href", "https://explorersweb.com/lhotse-wingsuit-update/");
    expect(
      screen.getByRole("link", { name: /First attempt \(2024\)/ }),
    ).toHaveAttribute("target", "_blank");
    expect(
      screen.getByRole("link", { name: /Second attempt \(2025\)/ }),
    ).toHaveAttribute(
      "href",
      "https://explorersweb.com/tim-howell-will-return-to-lhotse-to-attempt-the-worlds-highest-wingsuit-jump/",
    );
    expect(
      screen.getByRole("link", { name: /Third attempt \(2026\)/ }),
    ).toHaveAttribute(
      "href",
      "https://explorersweb.com/tim-howell-will-again-try-to-wingsuit-from-lhotse/",
    );
    expect(
      screen.getByRole("link", {
        name: /Read the Jöttnar Project Story \(2025\)/,
      }),
    ).toHaveAttribute(
      "href",
      "https://www.jottnar.com/pages/tim-howell-lhotse-world-record-jump",
    );

    const video = screen.getByLabelText(
      "Tim Howell — Future Project: A Leap from the Top of the World",
    );

    expect(video).not.toHaveAttribute("controls");
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveAttribute("preload", "metadata");
    expect(video).toHaveAttribute(
      "title",
      "Tim Howell — Future Project: A Leap from the Top of the World",
    );
    expect(video.closest("div")).toHaveClass("aspect-video");
    expect(
      screen.getByRole("button", {
        name: "Play Tim Howell — Future Project: A Leap from the Top of the World",
      }),
    ).toBeVisible();

    await waitFor(() =>
      expect(video.querySelector("source")).toHaveAttribute(
        "src",
        "/video/tim-howell/Future_project.mp4",
      ),
    );
  });

  it("pauses the teaser video when the section leaves the viewport", async () => {
    render(<FutureProjectFeature athlete={tim()} locale="en" />);
    const video = screen.getByLabelText(
      "Tim Howell — Future Project: A Leap from the Top of the World",
    ) as HTMLVideoElement;
    const pause = vi.spyOn(video, "pause");

    intersectionObservers.at(-1)?.trigger({
      isIntersecting: false,
      intersectionRatio: 0,
    });

    expect(pause).toHaveBeenCalled();
  });

  it("does not render for athletes without future project data", () => {
    const athlete = athletes.find((item) => item.slug === "marcel-geser");

    if (!athlete) {
      throw new Error("Marcel Geser fixture missing");
    }

    const { container } = render(
      <FutureProjectFeature athlete={athlete} locale="en" />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});

function tim() {
  const athlete = athletes.find((item) => item.slug === "tim-howell");

  if (!athlete) {
    throw new Error("Tim Howell fixture missing");
  }

  return athlete;
}
