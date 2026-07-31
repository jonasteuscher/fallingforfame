import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useScrollProgress } from "@/hooks/useScrollProgress";

function ScrollProgressProbe() {
  const progress = useScrollProgress();

  return <output aria-label="scroll progress">{progress}</output>;
}

function setScrollMetrics({
  scrollHeight,
  innerHeight,
  scrollY,
}: {
  scrollHeight: number;
  innerHeight: number;
  scrollY: number;
}) {
  Object.defineProperty(document.documentElement, "scrollHeight", {
    configurable: true,
    value: scrollHeight,
  });
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    value: innerHeight,
  });
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value: scrollY,
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useScrollProgress", () => {
  it("calculates initial progress from document height", () => {
    setScrollMetrics({ scrollHeight: 3000, innerHeight: 1000, scrollY: 500 });

    render(<ScrollProgressProbe />);

    expect(screen.getByLabelText("scroll progress")).toHaveTextContent("0.25");
  });

  it("updates on scroll and clamps progress to the valid range", () => {
    setScrollMetrics({ scrollHeight: 2000, innerHeight: 1000, scrollY: 0 });
    render(<ScrollProgressProbe />);

    setScrollMetrics({ scrollHeight: 2000, innerHeight: 1000, scrollY: 1800 });
    act(() => window.dispatchEvent(new Event("scroll")));

    expect(screen.getByLabelText("scroll progress")).toHaveTextContent("1");

    setScrollMetrics({ scrollHeight: 2000, innerHeight: 1000, scrollY: -200 });
    act(() => window.dispatchEvent(new Event("scroll")));

    expect(screen.getByLabelText("scroll progress")).toHaveTextContent("0");
  });

  it("updates on resize and handles pages without scrollable height", () => {
    setScrollMetrics({ scrollHeight: 1000, innerHeight: 1000, scrollY: 500 });

    render(<ScrollProgressProbe />);

    act(() => window.dispatchEvent(new Event("resize")));

    expect(screen.getByLabelText("scroll progress")).toHaveTextContent("0");
  });

  it("removes event listeners when unmounted", () => {
    const addListener = vi.spyOn(window, "addEventListener");
    const removeListener = vi.spyOn(window, "removeEventListener");
    setScrollMetrics({ scrollHeight: 2000, innerHeight: 1000, scrollY: 0 });

    const { unmount } = render(<ScrollProgressProbe />);
    unmount();

    expect(addListener).toHaveBeenCalledWith("scroll", expect.any(Function), {
      passive: true,
    });
    expect(addListener).toHaveBeenCalledWith("resize", expect.any(Function));
    expect(removeListener).toHaveBeenCalledWith("scroll", expect.any(Function));
    expect(removeListener).toHaveBeenCalledWith("resize", expect.any(Function));
  });
});
