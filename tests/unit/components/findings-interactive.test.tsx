import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { FindingsChapterNav } from "@/components/findings/FindingsChapterNav";
import { SafetyNetworkSection } from "@/components/findings/SafetyNetworkSection";
import { SynthesisSection } from "@/components/findings/SynthesisSection";
import { findingsPage as deFindings } from "@/content/de/findings";
import { findingsPage as enFindings } from "@/content/en/findings";
import type { FindingChapter } from "@/types/findings";

function chapterByKind(content: typeof enFindings, kind: FindingChapter["kind"]) {
  const chapter = content.chapters.find((item) => item.kind === kind);

  if (!chapter) {
    throw new Error(`Missing chapter kind: ${kind}`);
  }

  return chapter;
}

function mockReducedMotion(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

beforeEach(() => {
  mockReducedMotion(true);
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    callback(0);
    return 1;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
});

describe("findings interactive sections", () => {
  it("updates chapter navigation to the last item near the page bottom", async () => {
    render(
      <>
        <section id="intro" />
        <section id="visibility" />
        <section id="synthesis" />
        <FindingsChapterNav
          items={[
            { id: "visibility", label: "Visibility" },
            { id: "synthesis", label: "Synthesis" },
          ]}
          ariaLabel="Findings chapters"
          hiddenUntilId="intro"
        />
      </>,
    );

    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 995,
    });
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 0,
    });

    act(() => window.dispatchEvent(new Event("scroll")));

    await waitFor(() => {
      expect(screen.getByLabelText("Synthesis")).toHaveAttribute(
        "aria-current",
        "location",
      );
    });
  });

  it("renders the synthesis model and practical pathways in reduced motion", () => {
    const chapter = chapterByKind(enFindings, "synthesis-model");

    render(<SynthesisSection chapter={chapter} locale="en" />);

    expect(screen.getByRole("heading", { name: "The influence is indirect" }))
      .toBeVisible();
    expect(screen.getByRole("heading", { name: "Mediating factors" }))
      .toBeVisible();
    expect(screen.getByText(/Experience, risk competence and safety culture/))
      .toBeVisible();
    expect(screen.getByText("What this means")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Social media as learning infrastructure" }))
      .toBeVisible();
    expect(screen.getByRole("heading", { name: "Sponsorship as expectation" }))
      .toBeVisible();
  });

  it("renders the German safety network dual states and wrapped node labels", () => {
    const chapter = chapterByKind(deFindings, "safety-network");

    render(
      <SafetyNetworkSection
        chapter={chapter}
        locale="de"
        sourcePrefix={deFindings.sourcePrefix}
        empiricalLabel={deFindings.empiricalLabel}
        interpretationLabel={deFindings.interpretationLabel}
      />,
    );

    expect(screen.getByRole("heading", { name: "Sicherheit entsteht nicht allein" }))
      .toBeVisible();
    expect(screen.getByLabelText("Sprungpartner:innen")).toBeVisible();
    expect(screen.getByLabelText("Beinaheunfall-Diskussionen")).toBeVisible();
    expect(screen.getByRole("heading", { name: /Unterstützender\s*Zustand/ }))
      .toBeVisible();
    expect(screen.getByText("Wissen")).toBeVisible();
    expect(screen.getByRole("heading", { name: /Ambivalenter\s*Zustand/ }))
      .toBeVisible();
    expect(screen.getByText("Schweigen über Fehler")).toBeVisible();
    expect(screen.getByText(/Die Community stellt Wissen bereit/)).toBeVisible();
  });
});
