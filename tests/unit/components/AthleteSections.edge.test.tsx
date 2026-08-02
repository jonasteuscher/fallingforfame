import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
  AthleteArticlesSection,
  AthleteBaseStory,
  AthleteFindingsLinkSection,
  AthleteGallerySection,
  AthleteLinksSection,
  AthleteMediaSection,
  AthleteQuoteSection,
  MoreAthletes,
} from "@/components/athletes/AthleteSections";
import { athletes } from "@/data/athletes";
import type { Athlete } from "@/types/athlete";

describe("AthleteSections branch behaviour", () => {
  it("renders a fallback base story when no origin-story beats are configured", () => {
    const athlete = withOverrides({
      originStory: [],
      content: {
        ...fixture().content,
        en: {
          ...fixture().content.en,
          baseStoryTitle: "A condensed origin",
          baseStory: "The base story fallback remains readable.",
        },
      },
    });

    render(<AthleteBaseStory athlete={athlete} locale="en" title="Origin" />);

    expect(screen.getByRole("heading", { name: "A condensed origin" })).toBeVisible();
    expect(screen.getByText("The base story fallback remains readable.")).toBeVisible();
  });

  it("renders beat media, quotes and pending placeholders from the origin story", () => {
    const athlete = withOverrides({
      originStory: [
        {
          phase: { en: "Phase one", de: "Phase eins" },
          title: { en: "First object", de: "Erstes Objekt" },
          body: { en: "A real image appears.", de: "Ein Bild erscheint." },
          quote: { en: "A quoted memory.", de: "Eine Erinnerung." },
          media: {
            type: "image",
            src: "/images/test/origin.jpg",
          },
        },
        {
          phase: { en: "Phase two", de: "Phase zwei" },
          title: { en: "Unconfirmed media", de: "Unbestätigte Medien" },
          body: { en: "A placeholder appears.", de: "Ein Platzhalter erscheint." },
          media: {
            type: "video",
            src: null,
          },
        },
      ],
    });

    const { container } = render(
      <AthleteBaseStory athlete={athlete} locale="en" title="Origin" />,
    );

    expect(screen.getByText("A quoted memory.")).toBeVisible();
    expect(
      container.querySelector('img[src="/images/test/origin.jpg"]'),
    ).toHaveAttribute("src", "/images/test/origin.jpg");
    expect(screen.getByText("Documentary media pending")).toBeVisible();
  });

  it("shows empty states for missing quotes, gallery images and media sources", () => {
    render(
      <>
        <AthleteQuoteSection
          athlete={withOverrides({ quotes: [] })}
          locale="en"
          title="Quotes"
          emptyText="No quotes available."
        />
        <AthleteGallerySection
          images={[{ src: "", alt: { en: "Empty", de: "Leer" } }]}
          locale="en"
          title="Gallery"
          emptyText="No gallery yet."
        />
        <AthleteMediaSection
          locale="en"
          title="Media"
          emptyText="No media yet."
          audio={[{ title: { en: "Audio", de: "Audio" }, src: null }]}
          video={[{ title: { en: "Video", de: "Video" }, src: null }]}
        />
      </>,
    );

    expect(screen.getByText("No quotes available.")).toBeVisible();
    expect(screen.getByText("No gallery yet.")).toBeVisible();
    expect(screen.getByText("No media yet.")).toBeVisible();
  });

  it("renders localized audio and video media with caption fallbacks", () => {
    render(
      <AthleteMediaSection
        locale="de"
        title="Medien"
        emptyText="Keine Medien."
        audio={[
          {
            title: { en: "Audio title", de: "Audiotitel" },
            description: { en: "Audio caption", de: "Audiobeschreibung" },
            src: "/audio/interview.mp3",
            duration: "01:20",
          },
          {
            title: { en: "Duration title", de: "Dauer-Titel" },
            src: "/audio/duration.mp3",
            duration: "02:10",
          },
        ]}
        video={[
          {
            title: { en: "Video title", de: "Videotitel" },
            description: { en: "Video caption", de: "Videobeschreibung" },
            src: "/video/profile.mp4",
            poster: "/images/poster.jpg",
          },
        ]}
      />,
    );

    expect(screen.getByText("Audiobeschreibung")).toBeVisible();
    expect(screen.getByText("02:10")).toBeVisible();
    expect(screen.getByText("Videobeschreibung")).toBeVisible();
    expect(screen.getByRole("button", { name: "Play video" })).toBeVisible();
    expect(screen.getByLabelText("Video progress")).toBeVisible();
  });

  it("filters links without URLs and localizes custom and platform labels", () => {
    const { container } = render(
      <AthleteLinksSection
        compact
        title="Links"
        locale="de"
        links={[
          { type: "instagram", label: "Instagram profile", url: null },
          {
            type: "website",
            label: { en: "Official site", de: "Offizielle Website" },
            url: "https://example.com",
          },
          {
            type: "other",
            label: "Project dossier",
            url: "https://example.com/dossier",
            icon: "/custom/icon.svg",
          },
        ]}
      />,
    );

    expect(screen.queryByText("Instagram profile")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Offizielle Website/ })).toHaveAttribute(
      "href",
      "https://example.com",
    );
    expect(screen.getByRole("link", { name: /Project dossier/ })).toBeVisible();
    expect(container.querySelector('img[src="/custom/icon.svg"]')).toBeInTheDocument();
  });

  it("renders nothing when no confirmed links or articles exist", () => {
    const links = render(
      <AthleteLinksSection
        title="Links"
        locale="en"
        links={[{ type: "website", label: "Missing", url: null }]}
      />,
    );

    expect(links.container).toBeEmptyDOMElement();

    const articles = render(
      <AthleteArticlesSection
        articles={[{ title: { en: "Draft", de: "Entwurf" }, url: null }]}
        locale="en"
        title="Articles"
        viewAllLabel="View all"
        showLessLabel="Show less"
      />,
    );

    expect(articles.container).toBeEmptyDOMElement();
  });

  it("renders confirmed articles with domain and logo fallbacks", async () => {
    const user = userEvent.setup();

    render(
      <AthleteArticlesSection
        articles={[
          {
            title: { en: "Feature interview", de: "Feature Interview" },
            publisher: "Magazine",
            logo: "/logos/magazine.svg",
            logoScale: 0.8,
            url: "https://magazine.example/article",
          },
          {
            publisher: null,
            url: "https://www.example.org/story",
          },
          {
            title: undefined,
            publisher: null,
            url: "not-a-url",
          },
        ]}
        locale="en"
        title="Articles"
        viewAllLabel="View all"
        showLessLabel="Show less"
        initialVisibleCount={1}
      />,
    );

    expect(screen.getByRole("link", { name: /Feature interview/ })).toBeVisible();
    const toggle = screen.getByRole("button", { name: "View all" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: /example.org/ })).toBeVisible();
    expect(screen.getByRole("link", { name: /not-a-url/ })).toBeVisible();
  });

  it("links to findings with the active locale and renders related athlete cards", () => {
    const related = [
      withOverrides({ slug: "first-related", name: "Related One", country: "CH" }),
      withOverrides({
        slug: "second-related",
        name: "Related Two",
        country: null,
        images: { ...fixture().images, portrait: null },
      }),
    ];

    render(
      <>
        <AthleteFindingsLinkSection
          locale="de"
          eyebrow="Erkenntnisse"
          title="Zur Einordnung"
          body="Die Forschung erklärt den Kontext."
          cta="Erkenntnisse lesen"
        />
        <MoreAthletes
          athletes={related}
          locale="de"
          title="Weitere Athlet:innen"
          cta="Profil ansehen"
          placeholder="Porträt folgt"
          countryLabels={{ CH: "Schweiz" }}
          cardLabels={{
            profession: "Beruf",
            role: "Rolle",
            primary: "Disziplinen",
          }}
        />
      </>,
    );

    expect(screen.getByRole("link", { name: "Erkenntnisse lesen" })).toHaveAttribute(
      "href",
      "/de/findings",
    );
    expect(screen.getByRole("link", { name: /Related One/ })).toHaveAttribute(
      "href",
      "/de/athletes/first-related",
    );
    expect(screen.getByText("Schweiz")).toBeVisible();
    expect(screen.getByText("Porträt folgt")).toBeVisible();

    const secondCard = screen.getByRole("link", { name: /Related Two/ });
    expect(within(secondCard).queryByText("Schweiz")).not.toBeInTheDocument();
  });
});

function fixture() {
  const athlete = athletes[0];

  if (!athlete) {
    throw new Error("Athlete fixture missing");
  }

  return athlete;
}

function withOverrides(overrides: Partial<Athlete>): Athlete {
  return {
    ...fixture(),
    ...overrides,
    images: {
      ...fixture().images,
      ...overrides.images,
    },
    content: {
      ...fixture().content,
      ...overrides.content,
    },
  };
}
