import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ScrollScrubVideo } from "@/components/athletes/ScrollScrubVideo";
import { athletes } from "@/data/athletes";

let intersectionObservers: MockIntersectionObserver[] = [];
let rafCallbacks: FrameRequestCallback[] = [];

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

describe("ScrollScrubVideo", () => {
  beforeEach(() => {
    intersectionObservers = [];
    rafCallbacks = [];

    window.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;
    window.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
      rafCallbacks.push(callback);
      return rafCallbacks.length;
    });
    window.cancelAnimationFrame = vi.fn();
    window.matchMedia = vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    Object.defineProperty(window, "innerHeight", {
      value: 1000,
      configurable: true,
    });
    Object.defineProperty(window, "innerWidth", {
      value: 1200,
      configurable: true,
    });
    Object.defineProperty(window, "scrollY", {
      value: 0,
      writable: true,
      configurable: true,
    });
    Element.prototype.getBoundingClientRect = vi.fn(
      () =>
        ({
          top: 0,
          left: 0,
          right: 1200,
          bottom: 4000,
          width: 1200,
          height: 4000,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        }) as DOMRect,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders only when scroll video data exists and lazy-loads the correct source", async () => {
    const { container, rerender } = render(
      <ScrollScrubVideo video={undefined} locale="en" />,
    );

    expect(container).toBeEmptyDOMElement();

    rerender(<ScrollScrubVideo video={scrollVideo()} locale="en" />);

    await waitForScrubMode();
    expect(screen.getByText("SCROLL THROUGH")).toBeVisible();
    expect(screen.getByRole("heading", { name: "THE JUMP" })).toBeVisible();
    expect(screen.getByText("The line begins long before the exit."))
      .toBeInTheDocument();
    expect(screen.getByText("Every movement is prepared.")).toBeInTheDocument();
    expect(screen.getByText("In the end, the decision remains."))
      .toBeInTheDocument();
    await waitFor(() =>
      expect(container.querySelector("source")).toHaveAttribute(
        "src",
        "/video/tim-howell/The_jump.mp4",
      ),
    );
  });

  it("waits for metadata before scrubbing and clamps progress to the video bounds", async () => {
    const { container } = render(<ScrollScrubVideo video={scrollVideo()} locale="en" />);
    await waitForScrubMode();
    const section = container.querySelector(
      '[data-scroll-scrub-video-id="iran-jump"]',
    ) as HTMLElement;
    const video = container.querySelector("video") as HTMLVideoElement;

    await waitFor(() =>
      expect(container.querySelector("source")).toHaveAttribute(
        "src",
        "/video/tim-howell/The_jump.mp4",
      ),
    );
    Object.defineProperty(section, "offsetHeight", {
      value: 4000,
      configurable: true,
    });
    Object.defineProperty(video, "duration", {
      value: 10,
      configurable: true,
    });
    Object.defineProperty(video, "currentTime", {
      value: 0,
      writable: true,
      configurable: true,
    });

    window.scrollY = 10_000;
    window.dispatchEvent(new Event("scroll"));
    runRaf();
    expect(video.currentTime).toBe(0);

    act(() => {
      video.dispatchEvent(new Event("loadedmetadata"));
    });
    runAllRaf();

    expect(video.currentTime).toBeCloseTo(9.95, 2);

    window.scrollY = -10_000;
    window.dispatchEvent(new Event("scroll"));
    runRaf();
    expect(video.currentTime).toBe(0);
  });

  it("schedules scroll updates with requestAnimationFrame and recalculates on resize", async () => {
    const { container } = render(<ScrollScrubVideo video={scrollVideo()} locale="en" />);
    await waitForScrubMode();
    const section = container.querySelector(
      '[data-scroll-scrub-video-id="iran-jump"]',
    ) as HTMLElement;
    const video = container.querySelector("video") as HTMLVideoElement;
    const getBounds = vi.fn(
      () =>
        ({
          top: 25,
          left: 0,
          right: 1200,
          bottom: 4025,
          width: 1200,
          height: 4000,
          x: 0,
          y: 25,
          toJSON: () => ({}),
        }) as DOMRect,
    );

    Object.defineProperty(section, "offsetHeight", {
      value: 4000,
      configurable: true,
    });
    section.getBoundingClientRect = getBounds;
    Object.defineProperty(video, "duration", {
      value: 10,
      configurable: true,
    });
    Object.defineProperty(video, "currentTime", {
      value: 0,
      writable: true,
      configurable: true,
    });

    act(() => {
      video.dispatchEvent(new Event("loadedmetadata"));
    });
    runRaf();
    window.dispatchEvent(new Event("resize"));

    expect(window.requestAnimationFrame).toHaveBeenCalled();
    expect(getBounds).toHaveBeenCalled();
  });

  it("cleans up listeners and pending animation frames", async () => {
    const removeEventListener = vi.spyOn(window, "removeEventListener");
    window.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
      rafCallbacks.push(callback);
      return 77;
    });
    const { unmount } = render(<ScrollScrubVideo video={scrollVideo()} locale="en" />);
    await waitForScrubMode();

    window.dispatchEvent(new Event("scroll"));
    unmount();

    expect(removeEventListener).toHaveBeenCalledWith("scroll", expect.any(Function));
    expect(removeEventListener).toHaveBeenCalledWith("resize", expect.any(Function));
    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(77);
  });

  it("uses reduced-motion fallback with accessible controls", () => {
    window.matchMedia = vi.fn((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<ScrollScrubVideo video={scrollVideo()} locale="en" />);

    expect(screen.getByLabelText("Tim Howell BASE jump in Iran")).toHaveAttribute(
      "controls",
    );
    expect(
      document.querySelector('[data-scroll-scrub-fallback="true"]'),
    ).toBeInTheDocument();
  });

  it("uses mobile fallback on coarse touch devices", () => {
    window.matchMedia = vi.fn((query: string) => ({
      matches: query === "(pointer: coarse)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    Object.defineProperty(window, "innerWidth", {
      value: 390,
      configurable: true,
    });

    render(<ScrollScrubVideo video={scrollVideo()} locale="en" />);

    expect(
      document.querySelector('[data-scroll-scrub-fallback="true"]'),
    ).toBeInTheDocument();
  });

  it("handles missing metadata without crashing", async () => {
    const { container } = render(<ScrollScrubVideo video={scrollVideo()} locale="en" />);
    await waitForScrubMode();
    const video = container.querySelector("video") as HTMLVideoElement;

    Object.defineProperty(video, "duration", {
      value: Number.NaN,
      configurable: true,
    });
    Object.defineProperty(video, "currentTime", {
      value: 0,
      writable: true,
      configurable: true,
    });

    act(() => {
      video.dispatchEvent(new Event("loadedmetadata"));
    });
    runRaf();

    expect(video.currentTime).toBe(0);
  });
});

function scrollVideo() {
  const athlete = athletes.find((item) => item.slug === "tim-howell");

  if (!athlete?.scrollVideo) {
    throw new Error("Tim Howell scroll video fixture missing");
  }

  return athlete.scrollVideo;
}

function runRaf() {
  const callback = rafCallbacks.shift();

  if (callback) {
    callback(performance.now());
  }
}

function runAllRaf() {
  while (rafCallbacks.length > 0) {
    runRaf();
  }
}

async function waitForScrubMode() {
  await waitFor(() =>
    expect(
      document.querySelector('[data-scroll-scrub-fallback="true"]'),
    ).not.toBeInTheDocument(),
  );
}
