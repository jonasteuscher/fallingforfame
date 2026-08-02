import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AthleteNarrativeNav } from "@/components/athletes/AthleteNarrativeNav";

const items = [
  { id: "profile", label: "Profile" },
  { id: "story", label: "Story" },
  { id: "media", label: "Media" },
];

function setScrollState({
  scrollY = 0,
  innerHeight = 800,
  scrollHeight = 2400,
}: {
  scrollY?: number;
  innerHeight?: number;
  scrollHeight?: number;
}) {
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

beforeEach(() => {
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    callback(0);
    return 1;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
  setScrollState({});
});

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

describe("AthleteNarrativeNav", () => {
  it("does not render when no navigation items are provided", () => {
    const { container } = render(
      <AthleteNarrativeNav items={[]} ariaLabel="Athlete sections" />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("marks the first item active before later sections enter the viewport", () => {
    render(<AthleteNarrativeNav items={items} ariaLabel="Athlete sections" />);

    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute(
      "aria-current",
      "location",
    );
  });

  it("updates the active item from section positions while scrolling", () => {
    document.body.innerHTML = `
      <section id="profile"></section>
      <section id="story"></section>
      <section id="media"></section>
    `;
    vi.spyOn(
      document.getElementById("profile")!,
      "getBoundingClientRect",
    ).mockReturnValue({ top: -600 } as DOMRect);
    vi.spyOn(
      document.getElementById("story")!,
      "getBoundingClientRect",
    ).mockReturnValue({ top: 150 } as DOMRect);
    vi.spyOn(
      document.getElementById("media")!,
      "getBoundingClientRect",
    ).mockReturnValue({ top: 900 } as DOMRect);
    setScrollState({ scrollY: 500, innerHeight: 800, scrollHeight: 2600 });

    render(<AthleteNarrativeNav items={items} ariaLabel="Athlete sections" />);

    expect(screen.getByRole("link", { name: "Story" })).toHaveAttribute(
      "aria-current",
      "location",
    );
  });

  it("activates the final item near the bottom of the page", () => {
    setScrollState({ scrollY: 1594, innerHeight: 800, scrollHeight: 2400 });

    render(<AthleteNarrativeNav items={items} ariaLabel="Athlete sections" />);

    expect(screen.getByRole("link", { name: "Media" })).toHaveAttribute(
      "aria-current",
      "location",
    );
  });

  it("registers and removes scroll and resize listeners", () => {
    const addListener = vi.spyOn(window, "addEventListener");
    const removeListener = vi.spyOn(window, "removeEventListener");

    const { unmount } = render(
      <AthleteNarrativeNav items={items} ariaLabel="Athlete sections" />,
    );

    expect(addListener).toHaveBeenCalledWith("scroll", expect.any(Function), {
      passive: true,
    });
    expect(addListener).toHaveBeenCalledWith("resize", expect.any(Function));

    unmount();

    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(1);
    expect(removeListener).toHaveBeenCalledWith("scroll", expect.any(Function));
    expect(removeListener).toHaveBeenCalledWith("resize", expect.any(Function));
  });
});
