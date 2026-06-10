import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AthletePage from "@/app/[locale]/athletes/[slug]/page";
import { renderAsyncPage } from "../../test-utils/render-pages";

describe("athlete detail page", () => {
  it("renders athlete name, meta line, English content, and experience cards", async () => {
    await renderAsyncPage(
      AthletePage({
        params: Promise.resolve({ locale: "en", slug: "marcel-geser" }),
      }),
    );

    expect(screen.getByRole("heading", { name: "Marcel Geser", level: 1 }))
      .toBeVisible();
    expect(screen.getByText("From Switzerland | Age unknown")).toBeVisible();
    expect(
      screen.getByText(
        "A placeholder athlete profile prepared for future interview material, observation notes and multimedia documentation.",
      ),
    ).toBeVisible();
    expect(screen.getByRole("region", { name: "Athlete experience statistics" }))
      .toBeVisible();
  });

  it("renders German athlete content and translated meta line", async () => {
    await renderAsyncPage(
      AthletePage({
        params: Promise.resolve({ locale: "de", slug: "marcel-geser" }),
      }),
    );

    expect(screen.getByRole("heading", { name: "Marcel Geser", level: 1 }))
      .toBeVisible();
    expect(screen.getByText("Aus der Schweiz | Alter unbekannt")).toBeVisible();
    expect(
      screen.getByText(
        "Ein Platzhalterprofil fuer zukuenftiges Interviewmaterial, Beobachtungsnotizen und multimediale Dokumentation.",
      ),
    ).toBeVisible();
    expect(screen.getAllByText("Unbekannt")).toHaveLength(6);
  });

  it("handles missing experience data in English", async () => {
    await renderAsyncPage(
      AthletePage({
        params: Promise.resolve({ locale: "en", slug: "tim-howell" }),
      }),
    );

    expect(screen.getByRole("heading", { name: "Tim Howell", level: 1 })).toBeVisible();
    expect(screen.getAllByText("Unknown")).toHaveLength(6);
  });
});
