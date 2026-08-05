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
    expect(screen.getByText("The Documentary")).toBeVisible();
    expect(screen.getByText("Personal perspective")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Motivation behind the project" }),
    ).toBeVisible();
    expect(screen.getByRole("heading", { name: "Bachelor Thesis" })).toBeVisible();
    expect(
      screen.getByRole("heading", {
        name: "Zwischen Sichtbarkeit und Sicherheit - Bachelorarbeit",
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("img", {
        name: "Cover of the bachelor thesis Zwischen Sichtbarkeit und Sicherheit.",
      }),
    ).toHaveAttribute("src", expect.stringContaining("Thesis_Cover.jpg"));
    expect(screen.getByText("Complete bachelor thesis as a PDF.")).toBeVisible();
    expect(screen.getByText("PDF • 151 pages • 27.5 MB")).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Open Thesis PDF in a new browser tab" }),
    ).toHaveAttribute(
      "href",
      "/document/thesis/Thesis_Zwischen_Sichtbarkeit_und_Sicherheit.pdf",
    );
    expect(
      screen.getByRole("link", { name: "Open Thesis PDF in a new browser tab" }),
    ).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: "Download Thesis PDF" })).toHaveAttribute(
      "href",
      "/document/thesis/Thesis_Zwischen_Sichtbarkeit_und_Sicherheit.pdf",
    );
    expect(screen.getByRole("link", { name: "Download Thesis PDF" })).toHaveAttribute(
      "download",
    );
    expect(screen.getByText("Research question")).toBeVisible();
    expect(screen.getByText("Photo Elicitation")).toBeVisible();
    expect(screen.getAllByText("Behind the scenes")[0]).toBeVisible();
    expect(screen.getByText("Understanding begins with context.")).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Project chapters" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Documentary" })).toHaveAttribute(
      "href",
      "#the-documentary",
    );
  });

  it("renders localized German project content", async () => {
    await renderAsyncPage(ProjectPage({ params: Promise.resolve({ locale: "de" }) }));

    expect(
      screen.getByRole("heading", { name: "Das Projekt", level: 1 }),
    ).toBeVisible();
    expect(screen.getByText("Die Dokumentation")).toBeVisible();
    expect(screen.getByText("Persönlicher Zugang")).toBeVisible();
    expect(
      screen.getByRole("heading", {
        name: "Motivation hinter dem Projekt",
      }),
    ).toBeVisible();
    expect(screen.getByRole("heading", { name: "Bachelorarbeit" })).toBeVisible();
    expect(
      screen.getByRole("heading", {
        name: "Zwischen Sichtbarkeit und Sicherheit - Bachelorarbeit",
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("img", {
        name: "Cover der Bachelorarbeit Zwischen Sichtbarkeit und Sicherheit.",
      }),
    ).toHaveAttribute("src", expect.stringContaining("Thesis_Cover.jpg"));
    expect(screen.getByText("Vollständige Bachelorarbeit als PDF.")).toBeVisible();
    expect(screen.getByText("PDF • 151 pages • 27.5 MB")).toBeVisible();
    expect(
      screen.getByRole("link", {
        name: "Bachelorarbeit als PDF in einem neuen Browser-Tab öffnen",
      }),
    ).toHaveAttribute(
      "href",
      "/document/thesis/Thesis_Zwischen_Sichtbarkeit_und_Sicherheit.pdf",
    );
    expect(
      screen.getByRole("link", {
        name: "Bachelorarbeit als PDF in einem neuen Browser-Tab öffnen",
      }),
    ).toHaveAttribute("target", "_blank");
    expect(
      screen.getByRole("link", { name: "Bachelorarbeit als PDF herunterladen" }),
    ).toHaveAttribute(
      "href",
      "/document/thesis/Thesis_Zwischen_Sichtbarkeit_und_Sicherheit.pdf",
    );
    expect(
      screen.getByRole("link", { name: "Bachelorarbeit als PDF herunterladen" }),
    ).toHaveAttribute(
      "download",
    );
    expect(screen.getAllByText("Forschungsfrage")[0]).toBeVisible();
    expect(screen.getByText("Photo Elicitation")).toBeVisible();
    expect(screen.getByText("Hinter den Kulissen")).toBeVisible();
    expect(screen.getByText("Verständnis beginnt mit Kontext.")).toBeVisible();
  });

  it("generates localized metadata", async () => {
    await expect(
      generateProjectMetadata({ params: Promise.resolve({ locale: "en" }) }),
    ).resolves.toMatchObject({
      title: { absolute: "The Project | Falling for Fame?" },
    });
    await expect(
      generateProjectMetadata({ params: Promise.resolve({ locale: "de" }) }),
    ).resolves.toMatchObject({
      title: { absolute: "Das Projekt | Falling for Fame?" },
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
      title: { absolute: "About the Sport | Falling for Fame?" },
    });
    await expect(
      generateSportMetadata({ params: Promise.resolve({ locale: "de" }) }),
    ).resolves.toMatchObject({
      title: { absolute: "Über den Sport | Falling for Fame?" },
    });
  });
});
