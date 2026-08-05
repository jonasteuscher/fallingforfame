import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { sectionSpacing } from "@/components/athletes/AthleteDocumentaryPage";
import { athletes } from "@/data/athletes";

describe("AthleteDocumentaryPage shared section system", () => {
  it("defines semantic spacing variants for reusable athlete sections", () => {
    expect(sectionSpacing).toEqual({
      compact: "py-16 md:py-24",
      standard: "py-24 md:py-36",
      immersive: "py-32 md:py-48",
    });
  });

  it("stores reference athlete page composition in typed athlete data", () => {
    const tim = athletes.find((athlete) => athlete.slug === "tim-howell");
    const lukas = athletes.find((athlete) => athlete.slug === "lukas-loibl");
    const marcel = athletes.find((athlete) => athlete.slug === "marcel-geser");
    const standardProfiles = athletes.filter(
      (athlete) => athlete.slug === "josef-braun",
    );

    expect(tim?.page?.sections.map((section) => section.type)).toEqual([
      "interview-video",
      "scroll-video",
      "audio-story",
      "interview-video",
      "project-feature",
      "gallery",
      "social-media",
      "media-coverage",
    ]);
    expect(lukas?.page?.sections.map((section) => section.id)).toEqual([
      "planning-comes-first",
      "audio-story",
      "world-record",
      "the-mountain-will-still-be-here",
      "gallery",
      "social-media",
      "media-coverage",
    ]);
    expect(
      lukas?.page?.sections.find(
        (section) =>
          section.type === "interview-video" && section.id === "planning-comes-first",
      ),
    ).toMatchObject({ layout: "text-first", spacing: "immersive" });
    expect(
      lukas?.page?.sections.find(
        (section) =>
          section.type === "interview-video" &&
          section.id === "the-mountain-will-still-be-here",
      ),
    ).toMatchObject({ layout: "media-first", spacing: "immersive" });

    expect(standardProfiles).toHaveLength(1);
    for (const athlete of standardProfiles) {
      expect(athlete.page?.progress.slice(0, 4).map((section) => section.id)).toEqual([
        "biography",
        "origin",
        "gallery",
        "social-media",
      ]);
      expect(athlete.page?.sections.map((section) => section.type)).toEqual([
        "gallery",
        "social-media",
        "media-coverage",
      ]);
      expect(athlete.page?.sections[0]).toMatchObject({
        id: "gallery",
        spacing: "standard",
        includeInProgress: true,
      });
      expect(athlete.page?.sections[1]).toMatchObject({
        id: "social-media",
        spacing: "compact",
        includeInProgress: true,
      });
    }

    expect(marcel?.page?.progress.map((section) => section.id)).toEqual([
      "biography",
      "origin",
      "media-perception",
      "stockhorn-reflection",
      "proximity-flight",
      "audio-story",
      "career-highlights",
      "gallery",
    ]);
    expect(marcel?.page?.sections.map((section) => section.type)).toEqual([
      "interview-video",
      "interview-video",
      "scroll-video",
      "audio-story",
      "local-video",
      "gallery",
      "social-media",
      "media-coverage",
    ]);
    expect(marcel?.page?.sections[3]).toMatchObject({
      id: "audio-story",
      storyId: "process-behind-the-highlight",
      spacing: "standard",
      includeInProgress: true,
    });
    expect(marcel?.page?.sections[5]).toMatchObject({
      type: "gallery",
      id: "gallery",
      includeInProgress: true,
    });

    const niclas = athletes.find((athlete) => athlete.slug === "niclas-strohmeier");
    expect(niclas?.page?.progress.map((section) => section.id)).toEqual([
      "biography",
      "origin",
      "experience-and-caution",
      "slow-progression",
      "gallery",
      "social-media",
    ]);
    expect(niclas?.page?.sections.map((section) => section.type)).toEqual([
      "audio-story",
      "audio-story",
      "gallery",
      "social-media",
      "media-coverage",
    ]);
    expect(niclas?.page?.sections.slice(0, 2)).toMatchObject([
      {
        id: "experience-and-caution",
        storyId: "experience-and-caution",
        includeInProgress: true,
      },
      {
        id: "slow-progression",
        storyId: "slow-progression",
        includeInProgress: true,
      },
    ]);

    expect(
      athletes.find((athlete) => athlete.slug === "niclas-strohmeier")?.page?.progress,
    ).not.toContainEqual(expect.objectContaining({ id: "media-coverage" }));
    expect(
      athletes.find((athlete) => athlete.slug === "marcel-geser")?.page?.progress,
    ).not.toContainEqual(expect.objectContaining({ id: "media-coverage" }));
    expect(
      athletes.find((athlete) => athlete.slug === "josef-braun")?.page?.progress,
    ).toContainEqual(expect.objectContaining({ id: "media-coverage" }));
  });

  it("keeps athlete route composition data-driven instead of slug-mapped", () => {
    const routeSource = readFileSync(
      join(process.cwd(), "src/app/[locale]/athletes/[slug]/page.tsx"),
      "utf8",
    );

    expect(routeSource).toContain("athlete.page?.sections");
    expect(routeSource).toContain("athlete.page?.progress");
    expect(routeSource).not.toContain("athletePageSectionConfigs");
    expect(routeSource).not.toContain("layoutByAthlete");
  });
});
