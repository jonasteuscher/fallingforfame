import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FindingsHero } from "@/components/findings/FindingsHero";
import type { FindingsPageContent } from "@/types/findings";

const content = {
  hero: {
    eyebrow: "Research findings",
    title: "Visibility changes decisions",
    intro: "Introductory research copy.",
    methodology: "Methodology",
    centralStatement: "Visibility changes the conditions of decisions.",
    scrollCue: "Scroll",
    media: {
      src: "/images/findings/hero.jpg",
      alt: "Athlete in the mountains",
    },
    socialPost: {
      sourceLabel: "Recommended",
      menuLabel: "Post menu",
      username: "athlete",
      role: "BASE jumper",
      caption: "A visible jump clip.",
      hashtags: ["#base", "#mountains"],
      views: "42k views",
      actions: [
        { icon: "♥", label: "likes", value: "1k" },
        { icon: "↗", label: "shares", value: "200" },
      ],
      comments: [{ author: "viewer", text: "Incredible." }],
    },
  },
} as FindingsPageContent;

function mockMatchMedia(matches: boolean) {
  const mediaQuery = {
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn(() => mediaQuery),
  });

  return mediaQuery;
}

beforeEach(() => {
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    callback(0);
    return 1;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value: 0,
  });
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    value: 800,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  delete (window as Partial<Window>).matchMedia;
});

describe("FindingsHero", () => {
  it("renders the social post and final thesis content", () => {
    mockMatchMedia(false);

    render(<FindingsHero content={content} />);

    expect(
      screen.getByRole("heading", { name: "Visibility changes decisions" }),
    ).toBeVisible();
    expect(screen.getByAltText("Athlete in the mountains")).toHaveAttribute(
      "src",
      "/images/findings/hero.jpg",
    );
    expect(screen.getByText("Recommended")).toBeInTheDocument();
    expect(screen.getByText("A visible jump clip.")).toBeInTheDocument();
    expect(
      screen.getByText("Visibility changes the conditions of decisions."),
    ).toBeInTheDocument();
  });

  it("uses reduced-motion state when the media query matches", () => {
    const mediaQuery = mockMatchMedia(true);

    render(<FindingsHero content={content} />);

    expect(window.matchMedia).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)");
    expect(mediaQuery.addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
    expect(
      screen.getByRole("heading", { name: "Visibility changes decisions" }),
    ).toHaveStyle({ opacity: "1" });
  });

  it("continues rendering when matchMedia is unavailable", () => {
    delete (window as Partial<Window>).matchMedia;

    render(<FindingsHero content={content} />);

    expect(
      screen.getByRole("heading", { name: "Visibility changes decisions" }),
    ).toBeVisible();
  });

  it("updates progress from section scroll bounds and removes listeners on unmount", () => {
    mockMatchMedia(false);
    const addListener = vi.spyOn(window, "addEventListener");
    const removeListener = vi.spyOn(window, "removeEventListener");
    const rectSpy = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockReturnValue({ top: -200 } as DOMRect);
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
      configurable: true,
      get() {
        return this.id === "findings-hero" ? 1600 : 0;
      },
    });
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 400,
    });

    const { unmount } = render(<FindingsHero content={content} />);

    expect(addListener).toHaveBeenCalledWith("scroll", expect.any(Function), {
      passive: true,
    });
    expect(addListener).toHaveBeenCalledWith("resize", expect.any(Function));
    expect(rectSpy).toHaveBeenCalled();

    unmount();

    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(1);
    expect(removeListener).toHaveBeenCalledWith("scroll", expect.any(Function));
    expect(removeListener).toHaveBeenCalledWith("resize", expect.any(Function));
  });
});
