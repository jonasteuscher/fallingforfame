import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AthletesPage from "@/app/[locale]/athletes/page";
import { athletes } from "@/data/athletes";
import { renderAsyncPage } from "../../test-utils/render-pages";

describe("athlete overview page", () => {
  it("renders the English documentary overview and all athlete cards", async () => {
    await renderAsyncPage(AthletesPage({ params: Promise.resolve({ locale: "en" }) }));

    expect(
      screen.getByRole("heading", {
        name: "Five perspectives on visibility, risk and safety.",
        level: 1,
      }),
    ).toBeVisible();
    expect(screen.getAllByRole("article")).toHaveLength(athletes.length);
    expect(screen.queryAllByText("Portrait media pending")).toHaveLength(
      athletes.filter((athlete) => athlete.images.portrait === null).length,
    );
    expect(screen.getByText("Paragliding Pilot")).toBeVisible();
    expect(screen.getByText("BASE Jumping Instructor / Coach")).toBeVisible();
    expect(screen.getByText("Professional Mountain Athlete")).toBeVisible();
  });

  it("renders the German documentary overview", async () => {
    await renderAsyncPage(AthletesPage({ params: Promise.resolve({ locale: "de" }) }));

    expect(
      screen.getByRole("heading", {
        name: "Fünf Perspektiven auf Sichtbarkeit, Risiko und Sicherheit.",
        level: 1,
      }),
    ).toBeVisible();
    expect(screen.getAllByText("Profil ansehen")).toHaveLength(athletes.length);
  });

  it("links to the correct localized English routes in athlete order", async () => {
    await renderAsyncPage(AthletesPage({ params: Promise.resolve({ locale: "en" }) }));

    const profileLinks = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"))
      .filter((href): href is string => Boolean(href?.startsWith("/en/athletes/")));

    expect(profileLinks).toEqual([
      "/en/athletes/marcel-geser",
      "/en/athletes/niclas-strohmeier",
      "/en/athletes/josef-braun",
      "/en/athletes/lukas-loibl",
      "/en/athletes/tim-howell",
    ]);
  });

  it("links to the correct localized German routes in athlete order", async () => {
    await renderAsyncPage(AthletesPage({ params: Promise.resolve({ locale: "de" }) }));

    const profileLinks = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"))
      .filter((href): href is string => Boolean(href?.startsWith("/de/athletes/")));

    expect(profileLinks).toEqual([
      "/de/athletes/marcel-geser",
      "/de/athletes/niclas-strohmeier",
      "/de/athletes/josef-braun",
      "/de/athletes/lukas-loibl",
      "/de/athletes/tim-howell",
    ]);
  });
});
