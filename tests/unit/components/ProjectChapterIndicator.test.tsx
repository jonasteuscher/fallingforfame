import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProjectChapterIndicator } from "@/components/project/ProjectChapterIndicator";

const chapters = [
  { id: "motivation", label: "Motivation" },
  { id: "research", label: "Research" },
  { id: "credits", label: "Credits" },
];

function setViewport(scrollY: number, innerHeight: number, scrollHeight: number) {
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value: scrollY,
  });
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    value: innerHeight,
  });
  Object.defineProperty(document.documentElement, "scrollHeight", {
    configurable: true,
    value: scrollHeight,
  });
}

function appendMeasuredSection(id: string, top: number, bottom = top + 100) {
  const section = document.createElement("section");
  section.id = id;
  section.getBoundingClientRect = vi.fn(() => ({
    top,
    bottom,
    left: 0,
    right: 0,
    width: 0,
    height: bottom - top,
    x: 0,
    y: top,
    toJSON: () => undefined,
  }));
  document.body.append(section);
  return section;
}

beforeEach(() => {
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    callback(0);
    return 1;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
  setViewport(0, 900, 3000);
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

describe("ProjectChapterIndicator", () => {
  it("renders chapter links and highlights the first chapter by default", () => {
    render(<ProjectChapterIndicator chapters={chapters} />);

    expect(screen.getByRole("navigation", { name: "Project chapters" })).toBeVisible();
    expect(screen.getByLabelText("Motivation")).toHaveAttribute("href", "#motivation");
    expect(screen.getByLabelText("Motivation")).toHaveAttribute(
      "aria-current",
      "location",
    );
  });

  it("activates the last chapter when the page reaches the bottom", async () => {
    render(<ProjectChapterIndicator chapters={chapters} hiddenUntilId="intro" />);

    setViewport(1900, 1095, 3000);
    act(() => window.dispatchEvent(new Event("scroll")));

    await waitFor(() => {
      expect(screen.getByLabelText("Credits")).toHaveAttribute(
        "aria-current",
        "location",
      );
    });
  });

  it("uses section positions to update the active chapter after the intro", async () => {
    appendMeasuredSection("intro", -300, -100);
    appendMeasuredSection("motivation", -200, -100);
    appendMeasuredSection("research", 100, 200);
    appendMeasuredSection("credits", 900, 1000);

    render(<ProjectChapterIndicator chapters={chapters} hiddenUntilId="intro" />);

    setViewport(500, 900, 4000);
    act(() => window.dispatchEvent(new Event("scroll")));

    await waitFor(() => {
      expect(screen.getByLabelText("Research")).toHaveAttribute(
        "aria-current",
        "location",
      );
    });
  });

  it("falls back cleanly when intro or chapter elements are missing", async () => {
    render(
      <ProjectChapterIndicator chapters={chapters} hiddenUntilId="missing-intro" />,
    );

    act(() => window.dispatchEvent(new Event("resize")));

    await waitFor(() => {
      expect(screen.getByLabelText("Motivation")).toHaveAttribute(
        "aria-current",
        "location",
      );
    });
  });

  it("cancels pending animation frames and removes listeners on unmount", () => {
    const addListener = vi.spyOn(window, "addEventListener");
    const removeListener = vi.spyOn(window, "removeEventListener");
    const cancelFrame = vi.spyOn(window, "cancelAnimationFrame");

    const { unmount } = render(<ProjectChapterIndicator chapters={chapters} />);

    unmount();

    expect(addListener).toHaveBeenCalledWith("scroll", expect.any(Function), {
      passive: true,
    });
    expect(addListener).toHaveBeenCalledWith("resize", expect.any(Function));
    expect(removeListener).toHaveBeenCalledWith("scroll", expect.any(Function));
    expect(removeListener).toHaveBeenCalledWith("resize", expect.any(Function));
    expect(cancelFrame).toHaveBeenCalled();
  });
});
