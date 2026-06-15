import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AthletePage from "@/app/[locale]/athletes/[slug]/page";
import { athletes } from "@/data/athletes";
import { renderAsyncPage } from "../../test-utils/render-pages";

describe("athlete detail page", () => {
  it("renders every athlete detail page", async () => {
    for (const athlete of athletes) {
      const { unmount } = await renderAsyncPage(
        AthletePage({
          params: Promise.resolve({ locale: "en", slug: athlete.slug }),
        }),
      );

      expect(
        screen.getByRole("heading", { name: athlete.name, level: 1 }),
      ).toBeVisible();
      unmount();
    }
  });

  it("renders English profile structure and empty states", async () => {
    const { container } = await renderAsyncPage(
      AthletePage({
        params: Promise.resolve({ locale: "en", slug: "marcel-geser" }),
      }),
    );

    expect(screen.getByRole("heading", { name: "Marcel Geser", level: 1 }))
      .toBeVisible();
    expect(screen.getByText("From Switzerland | 45 years")).toBeVisible();
    expect(screen.getByText("Paragliding Pilot")).toBeVisible();
    expect(screen.getAllByText("Hobby BASE Jumper").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Experience" })).toBeVisible();
    expect(screen.getByText("850")).toBeVisible();
    expect(screen.getByText("1,500")).toBeVisible();
    expect(screen.getByText("No")).toBeVisible();
    expect(screen.getAllByText("Unknown")).toHaveLength(2);
    expect(
      screen.getByRole("heading", { name: "How They Got Into BASE Jumping" }),
    ).toBeVisible();
    expect(
      screen.getByText(
        "The detailed story will be added once interview material has been reviewed.",
      ),
    ).toBeVisible();
    expect(screen.getByText("Selected interview quotes will appear here."))
      .toBeVisible();
    expect(screen.getByText("Audio excerpts from the interviews will be added here."))
      .toBeVisible();
    expect(screen.getByText("Video material will be added here.")).toBeVisible();
    expect(screen.getByText("Profile links will be added once confirmed."))
      .toBeVisible();
    expect(
      screen.getByText("Links to articles, podcasts and interviews will be added here."),
    ).toBeVisible();
    expect(screen.getByText("Sponsor information will be added once confirmed."))
      .toBeVisible();
    expect(screen.getByRole("heading", { name: "More Athlete Stories" }))
      .toBeVisible();
    expect(container.querySelector("audio")).toBeNull();
    expect(container.querySelector("video")).toBeNull();
  });

  it("renders German profile structure and translated empty states", async () => {
    await renderAsyncPage(
      AthletePage({
        params: Promise.resolve({ locale: "de", slug: "marcel-geser" }),
      }),
    );

    expect(screen.getByRole("heading", { name: "Marcel Geser", level: 1 }))
      .toBeVisible();
    expect(screen.getByText("Aus der Schweiz | 45 Jahre")).toBeVisible();
    expect(screen.getByText("Gleitschirmpilot")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Wie Sie Zum BASE Jumping Kamen" }),
    ).toBeVisible();
    expect(
      screen.getByText(
        "Die ausführliche Geschichte wird ergänzt, sobald das Interviewmaterial ausgewertet wurde.",
      ),
    ).toBeVisible();
    expect(screen.getByText("Ausgewählte Interviewzitate erscheinen hier."))
      .toBeVisible();
    expect(
      screen.getByText("Audioausschnitte aus den Interviews werden hier ergänzt."),
    ).toBeVisible();
    expect(screen.getByText("Videomaterial wird hier ergänzt.")).toBeVisible();
    expect(screen.getByText("Profil-Links werden ergänzt, sobald sie bestätigt sind."))
      .toBeVisible();
    expect(screen.getByText("Sponsoring-Informationen werden ergänzt, sobald sie bestätigt sind."))
      .toBeVisible();
    expect(screen.getAllByText("Unbekannt")).toHaveLength(2);
  });

  it("renders formatted reach and sponsorship information", async () => {
    const { unmount } = await renderAsyncPage(
      AthletePage({
        params: Promise.resolve({ locale: "en", slug: "niclas-strohmeier" }),
      }),
    );

    expect(screen.getByText("500,000")).toBeVisible();
    expect(screen.getByText("Instagram, YouTube")).toBeVisible();
    unmount();

    await renderAsyncPage(
      AthletePage({
        params: Promise.resolve({ locale: "de", slug: "niclas-strohmeier" }),
      }),
    );

    expect(screen.getByText("500’000")).toBeVisible();
  });

  it("renders confirmed sponsor information", async () => {
    await renderAsyncPage(
      AthletePage({
        params: Promise.resolve({ locale: "en", slug: "lukas-loibl" }),
      }),
    );

    expect(screen.getByText("Yes")).toBeVisible();
    expect(
      screen.getByText(
        "Multiple sponsors since 2022, including canopies, wingsuits, cameras and clothing.",
      ),
    ).toBeVisible();
    expect(screen.getByText("Canopies")).toBeVisible();
    expect(screen.getByText("Wingsuits")).toBeVisible();
  });
});
