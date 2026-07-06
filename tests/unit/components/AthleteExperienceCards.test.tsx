import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AthleteExperienceCards } from "@/components/scrollytelling/AthleteExperienceCards";
import { athleteExperience as deLabels } from "@/content/de/site";
import { athleteExperience as enLabels } from "@/content/en/site";
import type { AthleteExperience } from "@/types/athlete";

const filledExperience: AthleteExperience = {
  skydiveSeasons: 7,
  skydives: 1200,
  baseSeasons: 4,
  basejumps: 230,
  sponsored: true,
  socialMediaReach: 54000,
};

const unknownExperience: AthleteExperience = {
  skydiveSeasons: null,
  skydives: null,
  baseSeasons: null,
  basejumps: null,
  sponsored: null,
  socialMediaReach: null,
};

describe("AthleteExperienceCards", () => {
  it("renders five experience milestones with translated labels", async () => {
    const { container } = render(
      <AthleteExperienceCards
        experience={filledExperience}
        labels={enLabels}
        locale="en"
      />,
    );

    expect(
      screen.getByRole("region", { name: "Athlete experience progression" }),
    ).toBeInTheDocument();
    expect(container.querySelectorAll("li")).toHaveLength(5);
    expect(screen.getByRole("heading", { name: "Skydiving Foundation" }))
      .toBeVisible();
    expect(screen.getByRole("heading", { name: "Entering BASE" })).toBeVisible();
    expect(screen.getByText("Skydive seasons")).toBeVisible();
    expect(screen.getByText("BASE jumps")).toBeVisible();
    expect(screen.getByText("Overall social media reach")).toBeVisible();
    expect(await screen.findByText("1,200+", undefined, { timeout: 2500 }))
      .toBeVisible();
    expect(screen.queryByText("Sponsored")).not.toBeInTheDocument();
  });

  it("renders Unknown for null values in English", () => {
    render(
      <AthleteExperienceCards
        experience={unknownExperience}
        labels={enLabels}
        locale="en"
      />,
    );

    expect(screen.getAllByText("Unknown")).toHaveLength(5);
    expect(screen.getByRole("heading", { name: "Public Visibility" })).toBeVisible();
  });

  it("renders Unbekannt for null values in German", () => {
    render(
      <AthleteExperienceCards
        experience={unknownExperience}
        labels={deLabels}
        locale="de"
      />,
    );

    expect(screen.getAllByText("Unbekannt")).toHaveLength(5);
    expect(screen.getByText("Skydive Saisons")).toBeVisible();
    expect(screen.getByText("BASE Jumper seit")).toBeVisible();
    expect(screen.queryByText("Gesponsert")).not.toBeInTheDocument();
  });
});
