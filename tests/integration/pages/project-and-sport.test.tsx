import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ProjectPage, {
  generateMetadata as generateProjectMetadata,
} from "@/app/[locale]/project/page";
import SportPage, {
  generateMetadata as generateSportMetadata,
} from "@/app/[locale]/sport/page";
import { renderAsyncPage } from "../../test-utils/render-pages";

describe("project page", () => {
  it("renders localized English project content", async () => {
    await renderAsyncPage(ProjectPage({ params: Promise.resolve({ locale: "en" }) }));

    expect(
      screen.getByRole("heading", { name: "The Project", level: 1 }),
    ).toBeVisible();
    expect(screen.getByText("The documentary")).toBeVisible();
    expect(screen.getByText("Photo elicitation")).toBeVisible();
    expect(screen.getByText("Credits")).toBeVisible();
  });

  it("renders localized German project content", async () => {
    await renderAsyncPage(ProjectPage({ params: Promise.resolve({ locale: "de" }) }));

    expect(
      screen.getByRole("heading", { name: "Das Projekt", level: 1 }),
    ).toBeVisible();
    expect(screen.getByText("Die Dokumentation")).toBeVisible();
    expect(screen.getByText("Photo Elicitation")).toBeVisible();
    expect(screen.getByText("Credits")).toBeVisible();
  });

  it("generates localized metadata", async () => {
    await expect(
      generateProjectMetadata({ params: Promise.resolve({ locale: "en" }) }),
    ).resolves.toMatchObject({
      title: "The Project | Falling for Fame?",
    });
    await expect(
      generateProjectMetadata({ params: Promise.resolve({ locale: "de" }) }),
    ).resolves.toMatchObject({
      title: "Das Projekt | Falling for Fame?",
    });
  });
});

describe("sport page", () => {
  it("renders localized English sport content", async () => {
    await renderAsyncPage(SportPage({ params: Promise.resolve({ locale: "en" }) }));

    expect(
      screen.getByRole("heading", { name: "About the Sport", level: 1 }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "What is BASE Jumping?" }),
    ).toBeVisible();
    expect(screen.getByText("What BASE stands for")).toBeVisible();
    expect(screen.getAllByText("Historical timeline")[0]).toBeVisible();
    expect(screen.getByText("Skydiving vs BASE")).toBeVisible();
    expect(screen.getByText("Safety Hierarchy")).toBeVisible();
    expect(screen.getByText("Disciplines gallery")).toBeVisible();
    expect(screen.getByText("Then vs Now")).toBeVisible();
    expect(screen.getByText("Sources & Further Reading")).toBeVisible();
  });

  it("renders localized German sport content", async () => {
    await renderAsyncPage(SportPage({ params: Promise.resolve({ locale: "de" }) }));

    expect(
      screen.getByRole("heading", { name: "Über den Sport", level: 1 }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Was ist BASE Jumping?" }),
    ).toBeVisible();
    expect(screen.getByText("Wofür BASE steht")).toBeVisible();
    expect(screen.getAllByText("Historische Entwicklung")[0]).toBeVisible();
    expect(screen.getByText("Skydiving vs BASE")).toBeVisible();
    expect(screen.getByText("Sicherheitshierarchie")).toBeVisible();
    expect(screen.getByText("Disziplinen Galerie")).toBeVisible();
    expect(screen.getByText("Damals und Heute")).toBeVisible();
    expect(screen.getByText("Moderne Entwicklungen")).toBeVisible();
    expect(screen.getByText("Quellen & Weiterführende Literatur")).toBeVisible();
  });

  it("generates localized metadata", async () => {
    await expect(
      generateSportMetadata({ params: Promise.resolve({ locale: "en" }) }),
    ).resolves.toMatchObject({
      title: "About the Sport",
    });
    await expect(
      generateSportMetadata({ params: Promise.resolve({ locale: "de" }) }),
    ).resolves.toMatchObject({
      title: "Über den Sport",
    });
  });
});
