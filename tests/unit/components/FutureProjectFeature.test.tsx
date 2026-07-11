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

    expect(screen.getByText("FUTURE PROJECT")).toBeVisible();
    expect(
      screen.getByRole("heading", {
        name: /A LEAP FROM\s+THE TOP OF\s+THE WORLD/,
      }),
    ).toBeVisible();
    expect(screen.getByText("An upcoming project by Tim Howell.")).toBeVisible();

    const video = screen.getByLabelText(
      "Tim Howell — Future Project: A Leap from the Top of the World",
    );

    expect(video).toHaveAttribute("controls");
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveAttribute("preload", "metadata");
    expect(video).toHaveAttribute(
      "title",
      "Tim Howell — Future Project: A Leap from the Top of the World",
    );
    expect(video.closest("div")).toHaveClass("aspect-video");

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
