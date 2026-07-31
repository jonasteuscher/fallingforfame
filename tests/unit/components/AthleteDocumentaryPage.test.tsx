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

    expect(tim?.page?.sections.map((section) => section.type)).toEqual([
      "interview-video",
      "scroll-video",
      "audio-story",
      "interview-video",
      "gallery",
      "project-feature",
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
