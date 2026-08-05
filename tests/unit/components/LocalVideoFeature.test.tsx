import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LocalVideoFeature } from "@/components/athletes/LocalVideoFeature";
import { athletes } from "@/data/athletes";

let intersectionCallback: IntersectionObserverCallback | null = null;
let isPaused = true;

describe("LocalVideoFeature", () => {
  beforeEach(() => {
    isPaused = true;

    class MockIntersectionObserver {
      readonly root = null;
      readonly rootMargin = "";
      readonly thresholds = [];

      constructor(callback: IntersectionObserverCallback) {
        intersectionCallback = callback;
      }

      observe = vi.fn(() => {
        intersectionCallback?.(
          [{ isIntersecting: true, intersectionRatio: 1 } as IntersectionObserverEntry],
          this as unknown as IntersectionObserver,
        );
      });
      disconnect = vi.fn();
      unobserve = vi.fn();
      takeRecords = vi.fn(() => []);
    }

    window.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;

    Object.defineProperty(HTMLMediaElement.prototype, "paused", {
      configurable: true,
      get: () => isPaused,
    });
    Object.defineProperty(HTMLMediaElement.prototype, "play", {
      configurable: true,
      value: vi.fn(function play(this: HTMLMediaElement) {
        isPaused = false;
        this.dispatchEvent(new Event("play"));
        return Promise.resolve();
      }),
    });
    Object.defineProperty(HTMLMediaElement.prototype, "pause", {
      configurable: true,
      value: vi.fn(function pause(this: HTMLMediaElement) {
        isPaused = true;
        this.dispatchEvent(new Event("pause"));
      }),
    });
    Object.defineProperty(HTMLMediaElement.prototype, "load", {
      configurable: true,
      value: vi.fn(),
    });
  });

  afterEach(() => {
    intersectionCallback = null;
    vi.restoreAllMocks();
  });

  it("renders Niclas's lazy cinematic player and pauses it off screen", async () => {
    const feature = athletes.find((athlete) => athlete.slug === "niclas-strohmeier")
      ?.localVideoFeatures?.[0];

    expect(feature).toBeDefined();

    const { container } = render(<LocalVideoFeature feature={feature!} locale="en" />);
    const video = screen.getByLabelText("Niclas Strohmeier BASE jump");

    expect(video).toHaveAttribute(
      "poster",
      "/video/niclas-strohmeier/The_jump_thumbnail.jpg",
    );
    expect(video).not.toHaveAttribute("controls");
    await waitFor(() => {
      expect(container.querySelector("source")).toHaveAttribute(
        "src",
        "/video/niclas-strohmeier/The_jump.MP4",
      );
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Play Niclas Strohmeier BASE jump" }),
    );

    await waitFor(() => {
      expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByRole("slider", { name: "Seek through video" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Mute video" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Open video fullscreen" })).toBeVisible();

    fireEvent.click(video);
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledTimes(1);

    fireEvent.click(video);
    await waitFor(() => {
      expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
    });

    intersectionCallback?.(
      [{ isIntersecting: false, intersectionRatio: 0 } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });
});
