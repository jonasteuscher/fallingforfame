import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SportPage } from "@/components/sport/SportPage";
import { sport as deSport } from "@/content/de/sport";
import { sport as enSport } from "@/content/en/sport";

vi.mock("@/components/findings/FindingsChapterNav", () => ({
  FindingsChapterNav: ({
    items,
    ariaLabel,
    hiddenUntilId,
  }: {
    items: Array<{ id: string; label: string }>;
    ariaLabel: string;
    hiddenUntilId?: string;
  }) => (
    <nav aria-label={ariaLabel} data-hidden-until={hiddenUntilId}>
      {items.map((item) => (
        <a key={item.id} href={`#${item.id}`}>
          {item.label}
        </a>
      ))}
    </nav>
  ),
}));

vi.mock("@/components/sport/SportSafetyDisclaimerModal", () => ({
  SportSafetyDisclaimerModal: ({ content }: { content: { headline: string } }) => (
    <aside data-testid="sport-safety-disclaimer">{content.headline}</aside>
  ),
}));

const defaultRect = {
  top: 0,
  right: 800,
  bottom: 600,
  left: 0,
  width: 800,
  height: 600,
  x: 0,
  y: 0,
  toJSON: () => ({}),
} as DOMRect;

let frame = 0;

beforeEach(() => {
  frame = 0;
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    frame += 1;
    callback(performance.now());
    return frame;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
  vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue(defaultRect);
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    value: 900,
  });
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value: 0,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("SportPage", () => {
  it("renders the English sport page sections and final comparison table", () => {
    render(<SportPage content={enSport} />);

    expect(screen.getByRole("heading", { name: "About the Sport" })).toBeVisible();
    expect(screen.getByTestId("sport-safety-disclaimer")).toHaveTextContent(
      "BASE jumping is an extremely dangerous activity",
    );

    const nav = screen.getByRole("navigation", {
      name: "About the sport sections",
    });
    expect(nav).toHaveAttribute("data-hidden-until", "what-is-base-jumping");
    expect(within(nav).getByRole("link", { name: "Comparison" })).toHaveAttribute(
      "href",
      "#skydiving-vs-base",
    );

    expect(
      screen.getAllByRole("heading", { name: "What is BASE Jumping?" }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole("heading", {
        name: "Difference Between Skydiving and BASE Jumping",
      }),
    ).toBeVisible();
    expect(screen.getByRole("heading", { name: "Equipment" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Community and Ethics" })).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Sources & Further Reading" }),
    ).toBeVisible();

    const comparisonTable = screen.getByRole("table", {
      name: /comparison summary/i,
    });
    expect(
      within(comparisonTable).getByRole("columnheader", { name: "Metric" }),
    ).toBeVisible();
    expect(within(comparisonTable).getByText("Fixed object")).toBeVisible();
    expect(within(comparisonTable).getByText("Very limited time")).toBeVisible();
  });

  it("renders German localized sport content with translated navigation", () => {
    render(<SportPage content={deSport} />);

    expect(screen.getByRole("heading", { name: "Über den Sport" })).toBeVisible();

    const nav = screen.getByRole("navigation", {
      name: "Kapitel über den Sport",
    });
    expect(nav).toHaveAttribute("data-hidden-until", "was-ist-base-jumping");
    expect(within(nav).getByRole("link", { name: "Vergleich" })).toHaveAttribute(
      "href",
      "#skydiving-vs-base",
    );

    expect(
      screen.getByRole("heading", {
        name: "Unterschied zwischen Skydiving und BASE Jumping",
      }),
    ).toBeVisible();
    const comparisonTable = screen.getByRole("table", {
      name: /vergleich im überblick/i,
    });
    expect(within(comparisonTable).getByText("Festes Objekt")).toBeVisible();
    expect(within(comparisonTable).getByText("Sehr begrenzte Zeit")).toBeVisible();
  });

  it("uses fallback section ids and titles when section metadata is missing", () => {
    const contentWithoutSections = { ...enSport, sections: [] };

    render(<SportPage content={contentWithoutSections} />);

    expect(
      screen.getByRole("navigation", { name: "About the sport sections" }),
    ).toHaveAttribute("data-hidden-until", "sport-hero");
    expect(
      screen.getAllByRole("heading", { name: "What is BASE Jumping?" }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("heading", { name: "Historical timeline" }).length,
    ).toBeGreaterThan(0);
  });
});
