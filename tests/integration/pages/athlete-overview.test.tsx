import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AthletesPage from "@/app/[locale]/athletes/page";
import { athletes } from "@/data/athletes";
import { renderAsyncPage } from "../../test-utils/render-pages";

describe("athlete overview page", () => {
  it("renders all athlete cards", async () => {
    await renderAsyncPage(AthletesPage({ params: Promise.resolve({ locale: "en" }) }));

    expect(screen.getAllByRole("article")).toHaveLength(athletes.length);
  });

  it("renders the expected athlete names", async () => {
    await renderAsyncPage(AthletesPage({ params: Promise.resolve({ locale: "en" }) }));

    expect(screen.getByRole("heading", { name: "Marcel Geser" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Niclas Strohmeier" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Lukas Loibl" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Josef Braun" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Tim Howell" })).toBeVisible();
  });

  it("links to the correct localized English routes", async () => {
    await renderAsyncPage(AthletesPage({ params: Promise.resolve({ locale: "en" }) }));

    const portraitLinks = screen.getAllByRole("link", { name: "Open portrait" });
    expect(portraitLinks.map((link) => link.getAttribute("href"))).toEqual([
      "/en/athletes/marcel-geser",
      "/en/athletes/niclas-strohmeier",
      "/en/athletes/lukas-loibl",
      "/en/athletes/josef-braun",
      "/en/athletes/tim-howell",
    ]);
  });

  it("links to the correct localized German routes", async () => {
    await renderAsyncPage(AthletesPage({ params: Promise.resolve({ locale: "de" }) }));

    const portraitLinks = screen.getAllByRole("link", { name: "Open portrait" });
    expect(portraitLinks.map((link) => link.getAttribute("href"))).toEqual([
      "/de/athletes/marcel-geser",
      "/de/athletes/niclas-strohmeier",
      "/de/athletes/lukas-loibl",
      "/de/athletes/josef-braun",
      "/de/athletes/tim-howell",
    ]);
  });
});
