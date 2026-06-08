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
  it("renders six statistic cards with translated labels", () => {
    const { container } = render(
      <AthleteExperienceCards
        experience={filledExperience}
        labels={enLabels}
        locale="en"
      />,
    );

    expect(container.querySelectorAll("dt")).toHaveLength(6);
    expect(
      screen.getByRole("region", { name: "Athlete experience statistics" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Skydive seasons")).toBeVisible();
    expect(screen.getByText("BASE jumps")).toBeVisible();
    expect(screen.getByText("Social media reach")).toBeVisible();
    expect(screen.getByText("1,200")).toBeVisible();
  });

  it("renders Unknown for null values in English", () => {
    render(
      <AthleteExperienceCards
        experience={unknownExperience}
        labels={enLabels}
        locale="en"
      />,
    );

    expect(screen.getAllByText("Unknown")).toHaveLength(6);
  });

  it("renders Unbekannt for null values in German", () => {
    render(
      <AthleteExperienceCards
        experience={unknownExperience}
        labels={deLabels}
        locale="de"
      />,
    );

    expect(screen.getAllByText("Unbekannt")).toHaveLength(6);
    expect(screen.getByText("Skydive-Saisons")).toBeVisible();
    expect(screen.getByText("Gesponsert")).toBeVisible();
  });

  it("renders Sponsored as Yes, No, or Unknown", () => {
    const { rerender } = render(
      <AthleteExperienceCards
        experience={{ ...filledExperience, sponsored: true }}
        labels={enLabels}
        locale="en"
      />,
    );
    expect(screen.getByText("Yes")).toBeVisible();

    rerender(
      <AthleteExperienceCards
        experience={{ ...filledExperience, sponsored: false }}
        labels={enLabels}
        locale="en"
      />,
    );
    expect(screen.getByText("No")).toBeVisible();

    rerender(
      <AthleteExperienceCards
        experience={{ ...filledExperience, sponsored: null }}
        labels={enLabels}
        locale="en"
      />,
    );
    expect(screen.getByText("Unknown")).toBeVisible();
  });

  it("renders Sponsored as Ja, Nein, or Unbekannt in German", () => {
    const { rerender } = render(
      <AthleteExperienceCards
        experience={{ ...filledExperience, sponsored: true }}
        labels={deLabels}
        locale="de"
      />,
    );
    expect(screen.getByText("Ja")).toBeVisible();

    rerender(
      <AthleteExperienceCards
        experience={{ ...filledExperience, sponsored: false }}
        labels={deLabels}
        locale="de"
      />,
    );
    expect(screen.getByText("Nein")).toBeVisible();

    rerender(
      <AthleteExperienceCards
        experience={{ ...filledExperience, sponsored: null }}
        labels={deLabels}
        locale="de"
      />,
    );
    expect(screen.getByText("Unbekannt")).toBeVisible();
  });
});
