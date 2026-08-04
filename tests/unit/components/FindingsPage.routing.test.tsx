import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FindingsPage } from "@/components/findings/FindingsPage";
import type {
  FindingChapter,
  FindingChapterKind,
  FindingsPageContent,
} from "@/types/findings";

function sectionMock(label: string) {
  function MockFindingSection({ chapter }: { chapter: FindingChapter }) {
    return (
      <section
        data-testid="finding-section"
        data-component={label}
        data-kind={chapter.kind}
      >
        {chapter.id}
      </section>
    );
  }

  MockFindingSection.displayName = `MockFindingSection(${label})`;

  return MockFindingSection;
}

vi.mock("@/components/findings/FindingsHero", () => ({
  FindingsHero: ({ content }: { content: FindingsPageContent }) => (
    <section id="findings-hero" data-testid="findings-hero">
      {content.hero.title}
    </section>
  ),
}));

vi.mock("@/components/findings/FindingsChapterNav", () => ({
  FindingsChapterNav: ({
    items,
    ariaLabel,
  }: Pick<FindingsPageContent, "nav"> & {
    items: FindingsPageContent["nav"];
    ariaLabel: string;
  }) => (
    <nav aria-label={ariaLabel} data-testid="findings-nav">
      {items.map((item) => item.label).join(", ")}
    </nav>
  ),
}));

vi.mock("@/components/findings/FindingsVisibilitySequence", () => ({
  FindingsVisibilitySequence: sectionMock("visibility"),
}));
vi.mock("@/components/findings/RecognitionComparison", () => ({
  RecognitionComparison: sectionMock("recognition"),
}));
vi.mock("@/components/findings/CameraEquipmentSection", () => ({
  CameraEquipmentSection: sectionMock("camera"),
}));
vi.mock("@/components/findings/VisibleInvisibleProcessSection", () => ({
  VisibleInvisibleProcessSection: sectionMock("visible-invisible"),
}));
vi.mock("@/components/findings/SponsorshipSpectrumSection", () => ({
  SponsorshipSpectrumSection: sectionMock("sponsorship"),
}));
vi.mock("@/components/findings/PressureModelSection", () => ({
  PressureModelSection: sectionMock("pressure"),
}));
vi.mock("@/components/findings/DecisionLayersSection", () => ({
  DecisionLayersSection: sectionMock("decision"),
}));
vi.mock("@/components/findings/ExperienceJourneySection", () => ({
  ExperienceJourneySection: sectionMock("experience"),
}));
vi.mock("@/components/findings/NoJumpDecisionSection", () => ({
  NoJumpDecisionSection: sectionMock("no-jump"),
}));
vi.mock("@/components/findings/SafetyNetworkSection", () => ({
  SafetyNetworkSection: sectionMock("safety"),
}));
vi.mock("@/components/findings/SynthesisSection", () => ({
  SynthesisSection: sectionMock("synthesis"),
}));
vi.mock("@/components/findings/ResearchContextSection", () => ({
  ResearchContextSection: sectionMock("methodology"),
}));

const baseHero = {
  eyebrow: "Findings",
  title: "Findings hero",
  intro: "Intro",
  methodology: "Method",
  centralStatement: "Central statement",
  scrollCue: "Scroll",
  media: {
    src: "/images/findings/hero.jpg",
    alt: "Hero image",
  },
  socialPost: {
    sourceLabel: "Source",
    menuLabel: "Menu",
    username: "athlete",
    role: "BASE jumper",
    caption: "Caption",
    hashtags: ["#base"],
    views: "1k",
    actions: [],
    comments: [],
  },
};

function chapter(kind: FindingChapterKind, id: string = kind): FindingChapter {
  return {
    id,
    kind,
    eyebrow: `Eyebrow ${id}`,
    title: `Title ${id}`,
    summary: `Summary ${id}`,
    finding: `Finding ${id}`,
    accessibleSummary: `Accessible ${id}`,
  };
}

function content(chapters: FindingChapter[]): FindingsPageContent {
  return {
    metadata: {
      title: "Findings",
      description: "Findings description",
    },
    navigationLabel: "Findings chapters",
    skipLabel: "Skip to research context",
    sourcePrefix: "Key insight",
    empiricalLabel: "Empirical finding",
    interpretationLabel: "Interpretation",
    quoteSourceLabel: "Interview participant",
    hero: baseHero,
    nav: [
      { id: "visibility", label: "Visibility" },
      { id: "synthesis", label: "Synthesis" },
    ],
    chapters,
  };
}

function renderedKinds() {
  return screen
    .getAllByTestId("finding-section")
    .map((element) => element.getAttribute("data-kind"));
}

describe("FindingsPage routing", () => {
  it("renders all specialised findings sections and moves no-jump after decision layers", () => {
    render(
      <FindingsPage
        locale="de"
        content={content([
          chapter("media-visibility"),
          chapter("recognition-comparison"),
          chapter("camera-equipment"),
          chapter("visible-invisible"),
          chapter("sponsorship-spectrum"),
          chapter("pressure-model"),
          chapter("no-jump"),
          chapter("decision-layers"),
          chapter("experience-curve"),
          chapter("safety-network"),
          chapter("synthesis-model"),
          chapter("methodology", "research-context"),
        ])}
      />,
    );

    expect(
      screen.getByRole("link", { name: "Skip to research context" }),
    ).toHaveAttribute("href", "#research-context");
    expect(screen.getByTestId("findings-hero")).toHaveTextContent("Findings hero");
    expect(
      screen.getByRole("navigation", { name: "Findings chapters" }),
    ).toHaveTextContent("Visibility, Synthesis");
    expect(renderedKinds()).toEqual([
      "media-visibility",
      "recognition-comparison",
      "camera-equipment",
      "visible-invisible",
      "sponsorship-spectrum",
      "pressure-model",
      "decision-layers",
      "no-jump",
      "experience-curve",
      "safety-network",
      "synthesis-model",
      "methodology",
    ]);
  });

  it("keeps the original chapter order when no no-jump chapter exists", () => {
    render(
      <FindingsPage
        locale="en"
        content={content([
          chapter("synthesis-model", "synthesis"),
          chapter("methodology", "research-context"),
        ])}
      />,
    );

    expect(renderedKinds()).toEqual(["synthesis-model", "methodology"]);
  });

  it("keeps no-jump in place when the decision-layers chapter is absent", () => {
    render(
      <FindingsPage
        locale="en"
        content={content([chapter("no-jump"), chapter("synthesis-model", "synthesis")])}
      />,
    );

    expect(renderedKinds()).toEqual(["no-jump", "synthesis-model"]);
  });
});
