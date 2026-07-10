import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AthletePage from "@/app/[locale]/athletes/[slug]/page";
import { athletes } from "@/data/athletes";
import { renderAsyncPage } from "../../test-utils/render-pages";

const expectedHeroQuotes = new Map([
  ["tim-howell", "Knowledge dispels fear."],
  [
    "lukas-loibl",
    "Wenn jemand wegen schlechter Bedingungen wieder herunterläuft, sollte das mehr gefeiert werden als der riskante Sprung.",
  ],
  [
    "marcel-geser",
    "Ich glaube, der Sport ist viel zu gefährlich, um ihn nur für einen Social Media Post zu machen.",
  ],
  [
    "niclas-strohmeier",
    "Die langsame Progression ist die sichere Progression.",
  ],
  [
    "josef-braun",
    "Es ist wie ein Kampf gegen sich selbst, den man zu hundert Prozent gewinnen muss.",
  ],
]);

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
      expect(screen.getByText(athlete.heroQuote.en)).toBeVisible();
      unmount();
    }
  });

  it("renders only the matching hero quote for each athlete", async () => {
    for (const athlete of athletes) {
      const { unmount } = await renderAsyncPage(
        AthletePage({
          params: Promise.resolve({ locale: "en", slug: athlete.slug }),
        }),
      );

      for (const [slug, quote] of expectedHeroQuotes) {
        if (slug === athlete.slug) {
          expect(screen.getByText(quote)).toBeVisible();
        } else {
          expect(screen.queryByText(quote)).not.toBeInTheDocument();
        }
      }

      unmount();
    }
  });

  it("updates the hero quote when navigating between athlete pages", async () => {
    const { rerender } = await renderAsyncPage(
      AthletePage({
        params: Promise.resolve({ locale: "en", slug: "tim-howell" }),
      }),
    );

    expect(screen.getByText("Knowledge dispels fear.")).toBeVisible();

    rerender(
      await AthletePage({
        params: Promise.resolve({ locale: "en", slug: "josef-braun" }),
      }),
    );

    expect(screen.queryByText("Knowledge dispels fear.")).not.toBeInTheDocument();
    expect(
      screen.getByText(
        "Es ist wie ein Kampf gegen sich selbst, den man zu hundert Prozent gewinnen muss.",
      ),
    ).toBeVisible();
  });

  it("renders localized hero quotes", async () => {
    for (const locale of ["en", "de"] as const) {
      const { unmount } = await renderAsyncPage(
        AthletePage({
          params: Promise.resolve({ locale, slug: "marcel-geser" }),
        }),
      );

      expect(
        screen.getByText(
          "Ich glaube, der Sport ist viel zu gefährlich, um ihn nur für einen Social Media Post zu machen.",
        ),
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
    expect(
      screen.getByText(
        "Ich glaube, der Sport ist viel zu gefährlich, um ihn nur für einen Social Media Post zu machen.",
      ),
    ).toBeVisible();
    expect(screen.getByText("Paragliding Pilot")).toBeVisible();
    expect(screen.getAllByText("Hobby BASE Jumper").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Experience" })).toBeVisible();
    expect(await screen.findByText("850+", undefined, { timeout: 2500 }))
      .toBeVisible();
    expect(await screen.findByText("1,500+", undefined, { timeout: 2500 }))
      .toBeVisible();
    expect(screen.getByText("No")).toBeVisible();
    expect(screen.getAllByText("Unknown")).toHaveLength(2);
    expect(screen.getByText("Where It All Began")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Discovering a passion for flight" }),
    ).toBeVisible();
    expect(screen.getByText("01 — Before BASE")).toBeVisible();
    expect(screen.getByText("A life already shaped by sport")).toBeVisible();
    expect(screen.getByText("One video changes the direction")).toBeVisible();
    expect(
      screen.getByText(
        /One day, YouTube recommended a BASE jumping video/,
      ),
    ).toBeVisible();
    expect(
      screen.getByText(
        "One recommendation was enough for BASE jumping to enter his imagination.",
      ),
    ).toBeVisible();
    expect(
      container.querySelector(
        'img[src="/images/athletes/marcel-geser/story.jpg"]',
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        "The detailed story will be added once interview material has been reviewed.",
      ),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Photo Gallery" })).toBeVisible();
    expect(
      container.querySelector(
        'img[src="/images/athletes/marcel-geser/gallery/DJI_20250607050910_0491_D.jpg"]',
      ),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", {
        name: /Open image full size: Marcel Geser gallery image 1/,
      }),
    );
    expect(screen.getByRole("dialog")).toBeVisible();
    expect(screen.getByText("Image 1 / 9")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Next image" }));
    expect(screen.getByText("Image 2 / 9")).toBeVisible();
    fireEvent.click(screen.getAllByRole("button", { name: "Close full-size image" })[0]);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByText("Selected interview quotes will appear here."))
      .toBeVisible();
    expect(screen.getByText("Audio excerpts from the interviews will be added here."))
      .toBeVisible();
    expect(screen.getByText("Video material will be added here.")).toBeVisible();
    expect(container.querySelector("video")).toBeNull();
    expect(screen.queryByRole("button", { name: "Play video" })).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Personal Links & Socials" }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: /Marcel Geser on YouTube/ }))
      .toHaveAttribute("target", "_blank");
    expect(
      screen.getByRole("heading", { name: "Articles & Media Coverage" }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: /Spotify/ })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
    expect(screen.getByAltText("Watson logo")).toBeVisible();
    expect(screen.getByAltText("Spotify logo")).toBeVisible();
    expect(
      screen.queryByRole("heading", { name: "Sponsors & Partnerships" }),
    ).not.toBeInTheDocument();
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
    expect(screen.getByText("Wie alles begann")).toBeVisible();
    expect(
      screen.getByRole("heading", {
        name: "Die Entdeckung einer Leidenschaft fürs Fliegen",
      }),
    ).toBeVisible();
    expect(screen.getByText("01 — Vor BASE")).toBeVisible();
    expect(screen.getByText("Der Weg in die Luft")).toBeVisible();
    expect(
      screen.getByText(
        /Eines Tages schlug ihm YouTube ein BASE-Jumping-Video vor/,
      ),
    ).toBeVisible();
    expect(
      screen.getByText(
        "Eine Empfehlung reichte, damit BASE Jumping in seiner Vorstellung auftauchte.",
      ),
    ).toBeVisible();
    expect(
      screen.queryByText(
        "Die ausführliche Geschichte wird ergänzt, sobald das Interviewmaterial ausgewertet wurde.",
      ),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Fotogalerie" })).toBeVisible();
    expect(screen.getByText("Ausgewählte Interviewzitate erscheinen hier."))
      .toBeVisible();
    expect(
      screen.getByText("Audioausschnitte aus den Interviews werden hier ergänzt."),
    ).toBeVisible();
    expect(screen.getByText("Videomaterial wird hier ergänzt.")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Persönliche Links & Social Media" }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: /Marcel Geser on YouTube/ }))
      .toBeVisible();
    expect(
      screen.queryByRole("heading", { name: "Sponsoren & Partnerschaften" }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByText("Unbekannt")).toHaveLength(2);
  });

  it("renders formatted reach and sponsorship information", async () => {
    const { unmount } = await renderAsyncPage(
      AthletePage({
        params: Promise.resolve({ locale: "en", slug: "niclas-strohmeier" }),
      }),
    );

    expect(await screen.findByText("500,000", undefined, { timeout: 2500 }))
      .toBeVisible();
    expect(screen.getByText("Instagram, YouTube")).toBeVisible();
    unmount();

    await renderAsyncPage(
      AthletePage({
        params: Promise.resolve({ locale: "de", slug: "niclas-strohmeier" }),
      }),
    );

    expect(await screen.findByText("500’000", undefined, { timeout: 2500 }))
      .toBeVisible();
  });

  it("renders confirmed sponsor information", async () => {
    const { container } = await renderAsyncPage(
      AthletePage({
        params: Promise.resolve({ locale: "en", slug: "lukas-loibl" }),
      }),
    );

    expect(
      container.querySelector(
        'img[src="/images/athletes/lukas-loibl/hero.jpeg"]',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Sponsored")).toBeVisible();
    expect(screen.getByText("Yes")).toBeVisible();
    expect(
      screen.getByText(
        "Multiple sponsors since 2022, including canopies, wingsuits, cameras and clothing.",
      ),
    ).toBeVisible();
    expect(screen.getByAltText("Atair Canopies logo")).toBeVisible();
    expect(screen.getByAltText("Moreboards logo")).toBeVisible();
    expect(screen.getByAltText("Squirrel logo")).toBeVisible();
    expect(screen.getByAltText("DJI logo")).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Atair Canopies logo" }),
    ).toHaveAttribute("target", "_blank");
    expect(
      screen.getByRole("link", { name: "Atair Canopies logo" }),
    ).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders Josef Braun ambassador partnerships", async () => {
    await renderAsyncPage(
      AthletePage({
        params: Promise.resolve({ locale: "en", slug: "josef-braun" }),
      }),
    );

    expect(
      screen.getByRole("heading", { name: "Sponsors & Partnerships" }),
    ).toBeVisible();
    expect(screen.getByAltText("Group A logo")).toBeVisible();
    expect(screen.getByAltText("Fly The Earth logo")).toBeVisible();
    expect(screen.getByRole("link", { name: "Group A logo" })).toHaveAttribute(
      "href",
      "https://www.groupaworldwide.com/pages/josef-braun",
    );
    expect(screen.getByRole("link", { name: "Fly The Earth logo" }))
      .toHaveAttribute("href", "https://flytheearth.com/");
  });
});
