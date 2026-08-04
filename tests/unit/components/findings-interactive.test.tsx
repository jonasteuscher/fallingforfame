import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FindingsChapterNav } from "@/components/findings/FindingsChapterNav";
import { ExperienceJourneySection } from "@/components/findings/ExperienceJourneySection";
import { SafetyNetworkSection } from "@/components/findings/SafetyNetworkSection";
import { SynthesisSection } from "@/components/findings/SynthesisSection";
import { FindingsVisibilitySequence } from "@/components/findings/FindingsVisibilitySequence";
import { SponsorshipSpectrumSection } from "@/components/findings/SponsorshipSpectrumSection";
import { DecisionLayersSection } from "@/components/findings/DecisionLayersSection";
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

function setViewport({ width = 1440, height = 900 } = {}) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    value: height,
  });
}

function configureScrollSection(
  section: HTMLElement,
  options: {
    top?: number;
    height?: number;
    scrollY?: number;
  },
) {
  const { top = 0, height = 3600, scrollY = 0 } = options;

  Object.defineProperty(section, "offsetHeight", {
    configurable: true,
    value: height,
  });
  section.getBoundingClientRect = vi.fn(() => ({
    top,
    bottom: top + height,
    left: 0,
    right: 1200,
    width: 1200,
    height,
    x: 0,
    y: top,
    toJSON: () => undefined,
  }));
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value: scrollY,
  });
}

beforeEach(() => {
  mockReducedMotion(true);
  setViewport();
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    callback(0);
    return 1;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
});

afterEach(() => {
  document.body.innerHTML = "";
});

describe("findings interactive sections", () => {
  it("does not render chapter navigation without items", () => {
    const { container } = render(
      <FindingsChapterNav items={[]} ariaLabel="Empty findings navigation" />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("updates chapter navigation from measured section positions", async () => {
    const visibility = document.createElement("section");
    visibility.id = "visibility";
    visibility.getBoundingClientRect = vi.fn(() => ({
      top: -300,
      bottom: -100,
      left: 0,
      right: 0,
      width: 0,
      height: 200,
      x: 0,
      y: -300,
      toJSON: () => undefined,
    }));
    const decision = document.createElement("section");
    decision.id = "decision";
    decision.getBoundingClientRect = vi.fn(() => ({
      top: 120,
      bottom: 320,
      left: 0,
      right: 0,
      width: 0,
      height: 200,
      x: 0,
      y: 120,
      toJSON: () => undefined,
    }));
    document.body.append(visibility, decision);

    render(
      <FindingsChapterNav
        items={[
          { id: "visibility", label: "Visibility" },
          { id: "decision", label: "Decision" },
        ]}
        ariaLabel="Findings chapters"
        compact={false}
      />,
    );

    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: 3000,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 900,
    });
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 500,
    });

    act(() => window.dispatchEvent(new Event("scroll")));

    await waitFor(() => {
      expect(screen.getByLabelText("Decision")).toHaveAttribute(
        "aria-current",
        "location",
      );
    });
  });

  it("cleans up chapter navigation observers on unmount", () => {
    const addListener = vi.spyOn(window, "addEventListener");
    const removeListener = vi.spyOn(window, "removeEventListener");
    const cancelFrame = vi.spyOn(window, "cancelAnimationFrame");

    const { unmount } = render(
      <FindingsChapterNav
        items={[
          { id: "visibility", label: "Visibility" },
          { id: "synthesis", label: "Synthesis" },
        ]}
        ariaLabel="Findings chapters"
      />,
    );

    unmount();

    expect(addListener).toHaveBeenCalledWith("scroll", expect.any(Function), {
      passive: true,
    });
    expect(addListener).toHaveBeenCalledWith("resize", expect.any(Function));
    expect(removeListener).toHaveBeenCalledWith("scroll", expect.any(Function));
    expect(removeListener).toHaveBeenCalledWith("resize", expect.any(Function));
    expect(cancelFrame).toHaveBeenCalled();
  });

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

  it("keeps chapter navigation hidden until the configured hidden section is passed", async () => {
    const hero = document.createElement("section");
    hero.id = "hero";
    vi.spyOn(hero, "getBoundingClientRect").mockReturnValue({
      top: -300,
      bottom: 500,
      left: 0,
      right: 0,
      width: 0,
      height: 800,
      x: 0,
      y: -300,
      toJSON: () => undefined,
    });
    document.body.append(hero);
    setViewport({ scrollY: 300, innerHeight: 800 });

    render(
      <FindingsChapterNav
        items={[{ id: "visibility", label: "Visibility" }]}
        ariaLabel="Findings chapters"
        hiddenUntilId="hero"
        revealAfterHiddenSection
      />,
    );

    const nav = screen.getByRole("navigation", { name: "Findings chapters" });
    expect(nav).toHaveClass("opacity-0", "pointer-events-none");

    vi.mocked(hero.getBoundingClientRect).mockReturnValue({
      top: -560,
      bottom: 240,
      left: 0,
      right: 0,
      width: 0,
      height: 800,
      x: 0,
      y: -560,
      toJSON: () => undefined,
    });
    setViewport({ scrollY: 560, innerHeight: 800 });
    act(() => window.dispatchEvent(new Event("scroll")));

    await waitFor(() => {
      expect(nav).toHaveClass("opacity-100", "pointer-events-auto");
    });
  });

  it("does not reveal hidden-section navigation from near-bottom scroll metrics", async () => {
    const hero = document.createElement("section");
    hero.id = "hero";
    vi.spyOn(hero, "getBoundingClientRect").mockReturnValue({
      top: 0,
      bottom: 760,
      left: 0,
      right: 0,
      width: 0,
      height: 760,
      x: 0,
      y: 0,
      toJSON: () => undefined,
    });
    document.body.append(hero);
    setViewport({ scrollY: 0, innerHeight: 760 });
    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: 760,
    });

    render(
      <FindingsChapterNav
        items={[
          { id: "base", label: "BASE" },
          { id: "today", label: "Today" },
        ]}
        ariaLabel="Sport chapters"
        hiddenUntilId="hero"
        revealAfterHiddenSection
      />,
    );

    act(() => window.dispatchEvent(new Event("scroll")));

    await waitFor(() => {
      expect(screen.getByRole("navigation", { name: "Sport chapters" })).toHaveClass(
        "opacity-0",
        "pointer-events-none",
      );
    });
    expect(screen.getByLabelText("BASE")).toHaveAttribute("aria-current", "location");
  });

  it("renders the synthesis model and practical pathways in reduced motion", () => {
    const chapter = chapterByKind(enFindings, "synthesis-model");

    render(<SynthesisSection chapter={chapter} locale="en" />);

    expect(
      screen.getByRole("heading", { name: "The influence is indirect" }),
    ).toBeVisible();
    expect(screen.getByRole("heading", { name: "Mediating factors" })).toBeVisible();
    expect(
      screen.getByText(/Experience, risk competence and safety culture/),
    ).toBeVisible();
    expect(screen.getByText("What this means")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Social media as learning infrastructure" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Sponsorship as expectation" }),
    ).toBeVisible();
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

    expect(
      screen.getByRole("heading", { name: "Sicherheit entsteht nicht allein" }),
    ).toBeVisible();
    expect(screen.getByLabelText("Sprungpartner:innen")).toBeVisible();
    expect(screen.getByLabelText("Beinaheunfall-Diskussionen")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: /Unterstützender\s*Zustand/ }),
    ).toBeVisible();
    expect(screen.getByText("Wissen")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: /Ambivalenter\s*Zustand/ }),
    ).toBeVisible();
    expect(screen.getByText("Schweigen über Fehler")).toBeVisible();
    expect(screen.getByText(/Die Community stellt Wissen bereit/)).toBeVisible();
  });

  it("renders the full experience journey in reduced motion", () => {
    const chapter = chapterByKind(enFindings, "experience-curve");

    render(
      <ExperienceJourneySection
        chapter={chapter}
        locale="en"
        sourcePrefix={enFindings.sourcePrefix}
        empiricalLabel={enFindings.empiricalLabel}
        interpretationLabel={enFindings.interpretationLabel}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: /Risk\s+looks\s+different\s+with\s+experience/,
      }),
    ).toBeVisible();
    expect(
      screen.getByText("Experience becomes reflection. Not fearlessness."),
    ).toBeVisible();
    expect(screen.getByText(/Based on Dunning & Kruger/)).toBeVisible();
    expect(screen.getByText(/This is a heuristic pattern/)).toBeVisible();
  });

  it("updates the experience journey active stage from section progress", async () => {
    mockReducedMotion(false);
    const chapter = chapterByKind(deFindings, "experience-curve");

    render(
      <ExperienceJourneySection
        chapter={chapter}
        locale="de"
        sourcePrefix={deFindings.sourcePrefix}
        empiricalLabel={deFindings.empiricalLabel}
        interpretationLabel={deFindings.interpretationLabel}
      />,
    );

    const section = document.getElementById(chapter.id);
    expect(section).not.toBeNull();
    configureScrollSection(section as HTMLElement, {
      height: 4000,
      scrollY: 2800,
    });

    act(() => window.dispatchEvent(new Event("scroll")));

    await waitFor(() => {
      expect(screen.getAllByText("Korrektur")[0]).toBeVisible();
      expect(screen.getAllByText(/Fehler, Beinaheunfälle/)[0]).toBeVisible();
    });
  });

  it("removes scroll listeners when the experience journey unmounts", () => {
    mockReducedMotion(false);
    const addListener = vi.spyOn(window, "addEventListener");
    const removeListener = vi.spyOn(window, "removeEventListener");
    const chapter = chapterByKind(enFindings, "experience-curve");

    const { unmount } = render(
      <ExperienceJourneySection
        chapter={chapter}
        locale="en"
        sourcePrefix={enFindings.sourcePrefix}
        empiricalLabel={enFindings.empiricalLabel}
        interpretationLabel={enFindings.interpretationLabel}
      />,
    );

    unmount();

    expect(addListener).toHaveBeenCalledWith("scroll", expect.any(Function), {
      passive: true,
    });
    expect(addListener).toHaveBeenCalledWith("resize", expect.any(Function));
    expect(removeListener).toHaveBeenCalledWith("scroll", expect.any(Function));
    expect(removeListener).toHaveBeenCalledWith("resize", expect.any(Function));
  });

  it("renders the media visibility sequence in reduced motion", () => {
    const chapter = chapterByKind(enFindings, "media-visibility");

    render(
      <FindingsVisibilitySequence
        chapter={chapter}
        sourcePrefix={enFindings.sourcePrefix}
        empiricalLabel={enFindings.empiricalLabel}
        interpretationLabel={enFindings.interpretationLabel}
        quoteSourceLabel={enFindings.quoteSourceLabel}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "More than self-presentation" }),
    ).toBeVisible();
    expect(screen.getByRole("img", { name: /BASE jumper flying away/ })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Learning" })).toBeVisible();
    expect(screen.getByText("Knowledge dispels fear.")).toBeVisible();
    expect(screen.getByText(/Digital media provides access/)).toBeVisible();
  });

  it("scrolls to media visibility states with the expected motion preference", () => {
    mockReducedMotion(false);
    const chapter = chapterByKind(enFindings, "media-visibility");

    render(
      <FindingsVisibilitySequence
        chapter={chapter}
        sourcePrefix={enFindings.sourcePrefix}
        empiricalLabel={enFindings.empiricalLabel}
        interpretationLabel={enFindings.interpretationLabel}
        quoteSourceLabel={enFindings.quoteSourceLabel}
      />,
    );

    const section = document.getElementById(chapter.id);
    expect(section).not.toBeNull();
    configureScrollSection(section as HTMLElement, {
      height: 4200,
      scrollY: 900,
    });

    act(() => window.dispatchEvent(new Event("scroll")));
    screen.getByRole("button", { name: /Learning/ }).click();

    expect(window.scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "smooth" }),
    );

    mockReducedMotion(true);
    screen.getByRole("button", { name: /Reflection/ }).click();

    expect(window.scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "auto" }),
    );
  });

  it("does not render the media visibility sequence without sequence data", () => {
    const chapter = {
      ...chapterByKind(enFindings, "media-visibility"),
      visibilitySequence: undefined,
      states: undefined,
    };
    const { container } = render(
      <FindingsVisibilitySequence
        chapter={chapter}
        sourcePrefix={enFindings.sourcePrefix}
        empiricalLabel={enFindings.empiricalLabel}
        interpretationLabel={enFindings.interpretationLabel}
        quoteSourceLabel={enFindings.quoteSourceLabel}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders the full sponsorship spectrum in reduced motion", () => {
    const chapter = chapterByKind(deFindings, "sponsorship-spectrum");

    render(
      <SponsorshipSpectrumSection
        chapter={chapter}
        sourcePrefix={deFindings.sourcePrefix}
        empiricalLabel={deFindings.empiricalLabel}
        interpretationLabel={deFindings.interpretationLabel}
        quoteSourceLabel={deFindings.quoteSourceLabel}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Unterstützung hat viele Formen" }),
    ).toBeVisible();
    expect(screen.getByRole("heading", { name: "Materialrabatt" })).toBeVisible();
    expect(
      screen.getByRole("heading", { name: /Projekt\s*Unterstützung/ }),
    ).toBeVisible();
    expect(screen.getByText("Damit verbundene Arbeitsbereiche")).toBeVisible();
    expect(
      screen.getByText(/Professionelles Sponsoring umfasst Ressourcen/),
    ).toBeVisible();
  });

  it("uses sponsorship fallbacks when optional quote and insight content are missing", () => {
    const baseChapter = chapterByKind(enFindings, "sponsorship-spectrum");
    const chapter = {
      ...baseChapter,
      quote: undefined,
      quoteSource: undefined,
      insight: undefined,
      spectrum: baseChapter.spectrum?.slice(0, 1),
      layers: [],
    };

    render(
      <SponsorshipSpectrumSection
        chapter={chapter}
        sourcePrefix={enFindings.sourcePrefix}
        empiricalLabel={enFindings.empiricalLabel}
        interpretationLabel={enFindings.interpretationLabel}
        quoteSourceLabel={enFindings.quoteSourceLabel}
      />,
    );

    expect(screen.queryByText(enFindings.quoteSourceLabel)).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Equipment discount" })).toBeVisible();
    expect(screen.getAllByText(chapter.finding).length).toBeGreaterThan(0);
    expect(screen.getAllByText(chapter.accessibleSummary).length).toBeGreaterThan(0);
  });

  it("scrolls to sponsorship stages with smooth and reduced-motion behaviour", () => {
    mockReducedMotion(false);
    const chapter = chapterByKind(enFindings, "sponsorship-spectrum");

    render(
      <SponsorshipSpectrumSection
        chapter={chapter}
        sourcePrefix={enFindings.sourcePrefix}
        empiricalLabel={enFindings.empiricalLabel}
        interpretationLabel={enFindings.interpretationLabel}
        quoteSourceLabel={enFindings.quoteSourceLabel}
      />,
    );

    const section = document.getElementById(chapter.id);
    expect(section).not.toBeNull();
    configureScrollSection(section as HTMLElement, {
      height: 3600,
      scrollY: 600,
    });

    screen.getByRole("button", { name: /Free equipment/ }).click();

    expect(window.scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "smooth" }),
    );

    mockReducedMotion(true);
    screen.getByRole("button", { name: /Professional livelihood/ }).click();

    expect(window.scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "auto" }),
    );
  });

  it("renders the complete decision model in reduced motion", () => {
    const chapter = chapterByKind(deFindings, "decision-layers");

    render(
      <DecisionLayersSection
        chapter={chapter}
        locale="de"
        sourcePrefix={deFindings.sourcePrefix}
        empiricalLabel={deFindings.empiricalLabel}
        interpretationLabel={deFindings.interpretationLabel}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /Der Exit ist\s+nicht der\s+Anfang/ }),
    ).toBeVisible();
    expect(screen.getByText("Exit-Schwelle")).toBeInTheDocument();
    expect(screen.getByText("Go / No-Go?")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /finaler Go- \/ No-Go-Entscheid/i }),
    ).toHaveAttribute("aria-current", "step");
  });

  it("updates decision action cues from focused process steps", async () => {
    mockReducedMotion(false);
    const chapter = chapterByKind(deFindings, "decision-layers");

    render(
      <DecisionLayersSection
        chapter={chapter}
        locale="de"
        sourcePrefix={deFindings.sourcePrefix}
        empiricalLabel={deFindings.empiricalLabel}
        interpretationLabel={deFindings.interpretationLabel}
      />,
    );

    act(() => {
      screen.getByRole("button", { name: /Wetter und Wind/ }).focus();
    });

    await waitFor(() => {
      expect(screen.getByText("Bedingungen vergleichen")).toBeInTheDocument();
    });

    act(() => {
      screen.getByRole("button", { name: /Wetter und Wind/ }).blur();
      screen.getByRole("button", { name: /Visualisierung/ }).focus();
    });

    await waitFor(() => {
      expect(screen.getByText("Ablauf visualisieren")).toBeInTheDocument();
    });
  });

  it("handles a decision model without configured layers", () => {
    mockReducedMotion(false);
    const chapter = {
      ...chapterByKind(enFindings, "decision-layers"),
      layers: [],
      insight: undefined,
    };

    render(
      <DecisionLayersSection
        chapter={chapter}
        locale="en"
        sourcePrefix={enFindings.sourcePrefix}
        empiricalLabel={enFindings.empiricalLabel}
        interpretationLabel={enFindings.interpretationLabel}
      />,
    );

    expect(screen.getAllByText("Exit threshold").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Go / No-Go?").length).toBeGreaterThan(0);
    expect(screen.getAllByText(chapter.finding).length).toBeGreaterThan(0);
    expect(screen.getAllByText(chapter.accessibleSummary).length).toBeGreaterThan(0);
  });
});
