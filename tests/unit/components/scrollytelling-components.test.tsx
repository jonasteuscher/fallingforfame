import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import type { Athlete } from "@/types/athlete";
import {
  AthleteStoryCard,
  AudioStoryBlock,
  ChapterDivider,
  ChapterIntro,
  FindingCard,
  ImageStoryBlock,
  InteractiveTimeline,
  ScrollySection,
  ScrollProgressIndicator,
  StickyMediaBlock,
  VideoStoryBlock,
} from "@/components/scrollytelling";

describe("scrollytelling primitives", () => {
  it("renders chapter intro content with optional metadata", () => {
    render(
      <ChapterIntro
        kicker="Chapter 01"
        title="Visibility and Safety"
        body="A short documentary introduction."
        meta="12 minutes"
      />,
    );

    expect(screen.getByText("Chapter 01")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Visibility and Safety", level: 1 }),
    ).toBeVisible();
    expect(screen.getByText("A short documentary introduction.")).toBeVisible();
    expect(screen.getByText("12 minutes")).toBeVisible();
  });

  it("renders story blocks with media wrappers", () => {
    render(
      <>
        <ImageStoryBlock
          title="Image story"
          body="The image explains the setting."
          image={{ src: "/image.jpg", alt: "Mountain exit" }}
        />
        <AudioStoryBlock
          title="Audio story"
          body="The audio explains the interview."
          audio={{ src: "/audio.mp3", title: "Interview audio" }}
        />
        <VideoStoryBlock
          title="Video story"
          body="The video explains the movement."
          video={{ src: "/video.mp4", title: "Wingsuit clip" }}
        />
      </>,
    );

    expect(screen.getByRole("heading", { name: "Image story" })).toBeVisible();
    expect(screen.getByRole("img", { name: "Mountain exit" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Audio story" })).toBeVisible();
    expect(screen.getByText("Interview audio")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Video story" })).toBeVisible();
    expect(screen.getByText("Wingsuit clip")).toBeVisible();
  });

  it("switches interactive timeline items through tabs", async () => {
    const user = userEvent.setup();
    render(
      <InteractiveTimeline
        items={[
          { date: "2019", title: "First jump", body: "The beginning." },
          { date: "2026", title: "Documentary", body: "The research output." },
        ]}
      />,
    );

    expect(screen.getByRole("tab", { name: "2019" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("heading", { name: "First jump" })).toBeVisible();

    await user.click(screen.getByRole("tab", { name: "2026" }));

    expect(screen.getByRole("tab", { name: "2026" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("heading", { name: "Documentary" })).toBeVisible();
    expect(screen.getByText("The research output.")).toBeVisible();
  });

  it("renders layout containers and section helpers", () => {
    render(
      <ScrollySection id="chapter" fullHeight={false}>
        <StickyMediaBlock media={<div>Sticky image</div>}>
          <ChapterDivider label="Chapter break" />
          <FindingCard
            finding={{
              id: "visibility",
              theme: "visibility",
              title: "Finding title",
              summary: "Finding summary",
            }}
          />
        </StickyMediaBlock>
      </ScrollySection>,
    );

    expect(document.querySelector("#chapter")).toBeInTheDocument();
    expect(screen.getByText("Sticky image")).toBeVisible();
    expect(screen.getByText("Chapter break")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Finding title" })).toBeVisible();
    expect(screen.getByText("Finding summary")).toBeVisible();
  });

  it("renders athlete story cards with localized links and placeholders", () => {
    const athlete = {
      name: "Test Athlete",
      slug: "test-athlete",
      images: {},
      content: {
        en: {
          title: "Portrait",
          shortBio: "English biography.",
        },
        de: {
          title: "Porträt",
          shortBio: "Deutsche Biografie.",
        },
      },
    } as unknown as Athlete;

    render(<AthleteStoryCard athlete={athlete} locale="en" />);

    expect(screen.getByText("Image placeholder")).toBeVisible();
    expect(screen.getByText("Portrait")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Test Athlete" })).toBeVisible();
    expect(screen.getByText("English biography.")).toBeVisible();
    expect(screen.getByRole("link", { name: "Open portrait" })).toHaveAttribute(
      "href",
      "/en/athletes/test-athlete",
    );
  });

  it("renders the scroll progress indicator width from the scroll hook", () => {
    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: 2000,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 250,
    });

    render(<ScrollProgressIndicator />);

    const progress = document.querySelector("[aria-hidden='true']") as HTMLElement;
    expect(progress).toHaveStyle({ width: "25%" });
  });
});
