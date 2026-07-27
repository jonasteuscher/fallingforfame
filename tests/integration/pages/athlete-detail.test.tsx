import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AthletePage, {
  generateMetadata as generateAthleteMetadata,
} from "@/app/[locale]/athletes/[slug]/page";
import { athletes } from "@/data/athletes";
import { renderAsyncPage } from "../../test-utils/render-pages";

const expectedHeroQuotes = new Map([
  ["tim-howell", "There is nothing anybody can tell me that's going to make me jump."],
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

const athletePortraitAlt: Record<string, string> = {
  "tim-howell": "Tim Howell wearing a cap and harness in front of mountains",
  "lukas-loibl": "Lukas Loibl smiling in a yellow jacket outdoors",
  "marcel-geser": "Marcel Geser wearing a helmet and blue wingsuit gear",
  "niclas-strohmeier":
    "Niclas Strohmeier in a white helmet flying close to green cliffs",
  "josef-braun": "Josef Braun smiling with a helmet and camera gear in a wooded area",
};

describe("athlete detail page", () => {
  it("generates descriptive localized athlete profile titles", async () => {
    await expect(
      generateAthleteMetadata({
        params: Promise.resolve({ locale: "en", slug: "tim-howell" }),
      }),
    ).resolves.toMatchObject({
      title: {
        absolute: "Tim Howell – Professional BASE Jumper | Falling for Fame?",
      },
    });
    await expect(
      generateAthleteMetadata({
        params: Promise.resolve({ locale: "de", slug: "tim-howell" }),
      }),
    ).resolves.toMatchObject({
      title: {
        absolute: "Tim Howell – Professioneller BASE Jumper | Falling for Fame?",
      },
    });
    await expect(
      generateAthleteMetadata({
        params: Promise.resolve({ locale: "en", slug: "josef-braun" }),
      }),
    ).resolves.toMatchObject({
      title: {
        absolute: "Josef Braun – BASE Coach and Video Creator | Falling for Fame?",
      },
    });
  });

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
      expect(
        screen.getByRole("heading", { name: "Profile and Experience" }),
      ).toBeVisible();
      expect(screen.getByAltText(athletePortraitAlt[athlete.slug])).toHaveAttribute(
        "src",
        athlete.images.portrait,
      );
      expect(screen.getByText("BASE since")).toBeVisible();
      expect(screen.getByText("BASE jumps")).toBeVisible();
      expect(screen.getByText("Skydives")).toBeVisible();
      expect(screen.getByText("Reach")).toBeVisible();
      expect(screen.getByText("Sponsorship")).toBeVisible();
      expect(screen.getByRole("heading", { name: "From Profile To Findings" }))
        .toBeVisible();
      expect(
        screen.getByText(
          `Explore how ${possessiveName(firstName(athlete.name))} perspective relates to the wider research findings.`,
        ),
      ).toBeVisible();
      expect(screen.getByRole("link", { name: "Explore Findings" }))
        .toHaveAttribute("href", "/en/findings");
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

  it("renders Tim Howell's interview features in their documentary positions only on his profile", async () => {
    const { container, unmount } = await renderAsyncPage(
      AthletePage({
        params: Promise.resolve({ locale: "en", slug: "tim-howell" }),
      }),
    );

    const originStory = container.querySelector("#origin-story");
    const careerInterview = container.querySelector(
      '[data-interview-feature-id="career"]',
    );
    const decisionInterview = container.querySelector(
      '[data-interview-feature-id="decision-making"]',
    );
    const audioStory = container.querySelector(
      '[data-audio-story-id="knowledge-dispels-fear"]',
    );
    const gallerySection = screen.getByRole("heading", { name: "Photo Gallery" })
      .closest("section");
    const galleryLayout = gallerySection?.querySelector(
      '[data-gallery-layout="editorial-grid"]',
    );
    const scrollVideo = container.querySelector(
      '[data-scroll-scrub-video-id="iran-jump"]',
    );
    const futureProject = container.querySelector("[data-future-project-feature]");
    const linksSection = screen.getByRole("heading", {
      name: "Personal Links & Socials",
    }).closest("section");
    const findingsSection = screen.getByRole("heading", {
      name: "From Profile To Findings",
    }).closest("section");
    const continuationSection = screen.getByRole("heading", {
      name: "More Athlete Portraits",
    }).closest("section");

    expect(originStory).toBeInTheDocument();
    expect(careerInterview).toBeInTheDocument();
    expect(decisionInterview).toBeInTheDocument();
    expect(audioStory).toBeInTheDocument();
    expect(scrollVideo).toBeInTheDocument();
    expect(futureProject).toBeInTheDocument();
    expect(galleryLayout).toHaveClass(
      "grid",
      "grid-cols-1",
      "items-start",
      "md:grid-cols-12",
    );
    expect(galleryLayout?.querySelector("img")).toHaveClass(
      "h-auto",
      "object-contain",
    );
    expect(
      screen.getByRole("heading", {
        name: /You're Only as Good\s+as Your Last Stunt/,
      }),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Play Tim Howell interview" }))
      .toBeVisible();
    expect(screen.getByText("Decision Making")).toBeVisible();
    expect(
      screen.getByRole("heading", {
        name: /Make the\s+Right Decision/,
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", {
        name: "Play Tim Howell interview about decision making",
      }),
    ).toBeVisible();
    expect(
      container.querySelector(
        'img[src="https://i.ytimg.com/vi/MJ-CSQxONJs/maxresdefault.jpg"]',
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        'img[src="https://i.ytimg.com/vi/N9JUEpIOwkA/maxresdefault.jpg"]',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("AUDIO STORY")).toBeVisible();
    expect(
      screen.getAllByRole("heading", { name: /Knowledge\s+Dispels Fear/ })[0],
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Play Understanding Fear" }),
    ).toBeVisible();
    expect(screen.getByText("Future Project")).toBeVisible();
    expect(
      screen.getByRole("heading", {
        name: /A Leap from\s+the Top of\s+the World/,
      }),
    ).toBeVisible();
    expect(
      screen.getByText(/Tim is preparing another attempt to fly from Lhotse/),
    ).toBeVisible();
    expect(screen.getByText("Teaser (2023)")).toBeVisible();
    expect(
      screen.getByRole("link", { name: /First attempt \(2024\)/ }),
    ).toHaveAttribute(
      "href",
      "https://explorersweb.com/lhotse-wingsuit-update/",
    );
    expect(
      screen.getByRole("link", { name: /Second attempt \(2025\)/ }),
    ).toHaveAttribute(
      "href",
      "https://explorersweb.com/tim-howell-will-return-to-lhotse-to-attempt-the-worlds-highest-wingsuit-jump/",
    );
    expect(
      screen.getByRole("link", { name: /Third attempt \(2026\)/ }),
    ).toHaveAttribute(
      "href",
      "https://explorersweb.com/tim-howell-will-again-try-to-wingsuit-from-lhotse/",
    );
    expect(
      screen.getByRole("link", {
        name: /Read the Jöttnar Project Story \(2025\)/,
      }),
    ).toHaveAttribute(
      "href",
      "https://www.jottnar.com/pages/tim-howell-lhotse-world-record-jump",
    );
    expect(
      screen
        .getByLabelText(
          "Tim Howell — Future Project: A Leap from the Top of the World",
        )
        .closest("div"),
    ).toHaveClass("aspect-video");
    expect(screen.getByRole("heading", { name: "The Jump" })).toBeVisible();
    expect(screen.getByText("SCROLL THROUGH")).toBeVisible();
    expect(screen.queryByText(/Replaceable editorial cue/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Replaceable:/)).not.toBeInTheDocument();
    await waitFor(() =>
      expect(
        container.querySelector('source[src="/video/tim-howell/The_jump.mp4"]'),
      ).toBeInTheDocument(),
    );
    expect(originStory?.compareDocumentPosition(careerInterview as Node))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(
      (careerInterview?.compareDocumentPosition(scrollVideo as Node) ?? 0) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(
      (scrollVideo?.compareDocumentPosition(audioStory as Node) ?? 0) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(
      (audioStory?.compareDocumentPosition(gallerySection as Node) ?? 0) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(
      (audioStory?.compareDocumentPosition(decisionInterview as Node) ?? 0) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(
      (decisionInterview?.compareDocumentPosition(gallerySection as Node) ?? 0) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(gallerySection?.compareDocumentPosition(futureProject as Node))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(
      (futureProject?.compareDocumentPosition(linksSection as Node) ?? 0) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(
      (findingsSection?.compareDocumentPosition(continuationSection as Node) ?? 0) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(screen.getByRole("heading", { name: "Articles & Media Coverage" }))
      .toBeVisible();
    expect(
      screen.getByText(
        "Meet the daredevil BASE jumper who leaped from a Vietnam peak",
      ),
    ).toBeVisible();
    expect(screen.getByText("France BASE jump photo of the day")).toBeVisible();
    expect(
      screen.getByText("Tim Howell completes North BASE paralpinism project"),
    ).toBeVisible();
    expect(screen.queryByText("Travel meets BASE jumper Tim Howell"))
      .not.toBeInTheDocument();
    expect(screen.queryByText("Pro record: Tim Howell")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "More Athlete Portraits" }),
    ).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Tim Howell profile sections" }))
      .toBeVisible();
    expect(screen.getByRole("link", { name: "Biography" })).toHaveAttribute(
      "href",
      "#person",
    );
    expect(screen.getByRole("link", { name: "Career" })).toHaveAttribute(
      "href",
      "#attraction",
    );
    expect(screen.getByRole("link", { name: "Decision" })).toHaveAttribute(
      "href",
      "#decision",
    );
    expect(screen.getByRole("link", { name: "Gallery" })).toHaveAttribute(
      "href",
      "#gallery",
    );
    expect(screen.getByRole("button", { name: "View full gallery" }))
      .toHaveAttribute("aria-expanded", "false");
    fireEvent.click(screen.getByRole("button", { name: "View all coverage" }));
    expect(screen.getByText("Pro record: Tim Howell")).toBeVisible();
    expect(screen.getByRole("button", { name: "Show less" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    unmount();

    await renderAsyncPage(
      AthletePage({
        params: Promise.resolve({ locale: "en", slug: "marcel-geser" }),
      }),
    );

    expect(
      screen.queryByRole("heading", {
        name: "You're Only as Good as Your Last Stunt",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        name: "Make the Right Decision",
      }),
    ).not.toBeInTheDocument();
  });

  it("renders the German Tim Howell interview data for German visitors", async () => {
    await renderAsyncPage(
      AthletePage({
        params: Promise.resolve({ locale: "de", slug: "tim-howell" }),
      }),
    );

    expect(screen.getByText("Social Media")).toBeVisible();
    expect(screen.getByRole("link", { name: "Biografie" })).toHaveAttribute(
      "href",
      "#person",
    );
    expect(screen.getByRole("link", { name: "Karriere" })).toHaveAttribute(
      "href",
      "#attraction",
    );
    expect(screen.getByRole("button", { name: "Tim Howell Interview abspielen" }))
      .toBeVisible();
    expect(
      screen.queryByText(
        "Ein längerer Auszug aus dem Interview, als ruhiger Moment innerhalb des Porträts.",
      ),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Decision Making")).toBeVisible();
    expect(
      screen.getByRole("button", {
        name: "Tim Howell Interview über Decision Making abspielen",
      }),
    ).toBeVisible();
    expect(
      screen.queryByText(
        "Ein ruhigeres Kapitel über Einschätzung, Geduld und den Moment, in dem man zurücktritt.",
      ),
    ).not.toBeInTheDocument();
    expect(
      document.querySelector(
        'img[src="https://i.ytimg.com/vi/nZcqDTgsYGM/maxresdefault.jpg"]',
      ),
    ).toBeInTheDocument();
    expect(
      document.querySelector(
        'img[src="https://i.ytimg.com/vi/Bi4Ba7mDy9Y/maxresdefault.jpg"]',
      ),
    ).toBeInTheDocument();
  });

  it("uses the compact social and media coverage layout for non-Tim athletes", async () => {
    await renderAsyncPage(
      AthletePage({
        params: Promise.resolve({ locale: "en", slug: "lukas-loibl" }),
      }),
    );

    expect(
      screen.getByRole("link", { name: /Official Website/ }),
    ).toHaveClass("min-h-12");
    expect(
      screen.getByRole("link", { name: /Wingsuit School/ }),
    ).toHaveClass("min-h-12");
    expect(
      screen.getByText("Austrian wingsuit pilot claims world record"),
    ).toBeVisible();
    expect(
      screen.getByText(
        "Wingsuit world record at 200 km/h through the Messnerin hole",
      ),
    ).toBeVisible();
    expect(
      screen.getByText("Austrian wingsuit record through a rock opening"),
    ).toBeVisible();
    expect(
      screen.queryByText("Austrian sets world record flying through a rock hole"),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "View all coverage" }));

    expect(
      screen.getByText("Austrian sets world record flying through a rock hole"),
    ).toBeVisible();
  });

  it("renders Lukas Loibl's project, interview, social and gallery chapters in navigation order", async () => {
    const { container } = await renderAsyncPage(
      AthletePage({
        params: Promise.resolve({ locale: "en", slug: "lukas-loibl" }),
      }),
    );

    const gallerySection = screen
      .getByRole("heading", { name: "Photo Gallery" })
      .closest("section");
    const galleryLayout = gallerySection?.querySelector(
      '[data-gallery-layout="editorial-grid"]',
    );
    const projectSection = container.querySelector(
      '[data-current-project-section="lukas-loibl-world-record"]',
    );
    const mountainInterview = container.querySelector(
      '[data-interview-feature-id="the-mountain-will-still-be-here"]',
    );
    const planningInterview = container.querySelector(
      '[data-interview-feature-id="planning-comes-first"]',
    );
    const audioStory = container.querySelector(
      '[data-audio-story-id="social-media-and-sponsorship"]',
    );
    const linksSection = screen
      .getByRole("heading", { name: "Personal Links & Socials" })
      .closest("section");
    const mediaCoverageAnchor = container.querySelector("#media-coverage");

    expect(audioStory).toBeInTheDocument();
    expect(mountainInterview).toBeInTheDocument();
    expect(planningInterview).toBeInTheDocument();
    expect(projectSection).toBeInTheDocument();
    expect(mediaCoverageAnchor).toBeInTheDocument();
    expect(galleryLayout).toHaveAttribute("data-gallery-count", "6");
    expect(galleryLayout?.querySelectorAll("li").item(5)).toHaveClass(
      "md:col-span-6",
      "xl:col-span-4",
    );
    expect(
      galleryLayout?.querySelectorAll("button").item(0),
    ).toHaveClass("aspect-[2/3]", "overflow-hidden");
    expect(galleryLayout?.querySelector("img")).toHaveClass("object-cover");
    expect(
      planningInterview?.compareDocumentPosition(audioStory as Node) ?? 0,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(
      audioStory?.compareDocumentPosition(projectSection as Node) ?? 0,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(
      projectSection?.compareDocumentPosition(mountainInterview as Node) ?? 0,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(
      mountainInterview?.compareDocumentPosition(gallerySection as Node) ?? 0,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(
      gallerySection?.compareDocumentPosition(linksSection as Node) ?? 0,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(
      linksSection?.compareDocumentPosition(mediaCoverageAnchor as Node) ?? 0,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(
      screen.getByRole("navigation", { name: "Lukas Loibl profile sections" }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Planning first" }))
      .toHaveAttribute("href", "#planning-comes-first");
    expect(screen.getByRole("link", { name: "Social media & sponsorship" }))
      .toHaveAttribute("href", "#audio-story");
    expect(screen.getByRole("link", { name: "World Record" })).toHaveAttribute(
      "href",
      "#world-record",
    );
    expect(
      screen.getByRole("link", { name: "Not jumping" }),
    ).toHaveAttribute("href", "#the-mountain-will-still-be-here");
    expect(screen.getByRole("link", { name: "Gallery" }))
      .toHaveAttribute("href", "#gallery");
    expect(screen.queryByRole("link", { name: "Social Media" }))
      .not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /World\s+Record/ }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", {
        name: "The Mountain Will Still Be Here",
      }),
    ).toBeVisible();
    expect(mountainInterview?.querySelector("p")?.textContent).toBe(
      "Choosing Not to Jump",
    );
    expect(
      screen.getByText(
        "Not every summit ends with a jump. Sometimes the safest decision is to hike back down and wait for another day.",
      ),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Planning Comes First" }),
    ).toBeVisible();
    expect(planningInterview?.querySelector("p")?.textContent).toBe(
      "Decision Making",
    );
    expect(planningInterview?.querySelector("[data-interview-layout]"))
      .toHaveAttribute("data-interview-layout", "text-first");
    expect(mountainInterview?.querySelector("[data-interview-layout]"))
      .toHaveAttribute("data-interview-layout", "media-first");
    expect(
      screen.getByText(
        "Every jump begins long before standing at the exit. Weather, conditions, equipment and personal limits determine whether a jump should happen at all.",
      ),
    ).toBeVisible();
    expect(
      screen.getByRole("button", {
        name: "Play Lukas Loibl interview about choosing not to jump",
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", {
        name: "Play Lukas Loibl interview about planning before BASE jumping",
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", {
        name: /Social Media\s+and Sponsorship/,
      }),
    ).toBeVisible();
    expect(screen.getByRole("heading", { name: "Jumping for the camera?" }))
      .toBeVisible();
    expect(
      screen.getByRole("button", {
        name: "Play Jumping for the camera?",
      }),
    ).toBeVisible();
    expect(
      screen.getByAltText(
        "Lukas Loibl smiling in a white shirt in a sunlit forest",
      ),
    ).toHaveAttribute(
      "src",
      "/images/athletes/lukas-loibl/Lukas-audio.jpeg",
    );
    expect(
      screen.getByText(/ten natural rock formations across ten flights/),
    ).toBeVisible();
    expect(
      screen.getByAltText(
        "Lukas Loibl flying in a wingsuit near a steep alpine rock gate",
      ),
    ).toHaveAttribute("src", "/images/athletes/lukas-loibl/Loch1.jpeg");
    expect(
      screen.getByAltText(
        "Natural rock opening in the European Alps used for Lukas Loibl's wingsuit record",
      ),
    ).toHaveAttribute("src", "/images/athletes/lukas-loibl/Loch2.jpeg");
    expect(
      screen.getByLabelText("Lukas Loibl world record wingsuit flight"),
    ).toHaveAttribute("controls");
    expect(
      screen.getByLabelText("Lukas Loibl world record wingsuit flight"),
    ).toHaveAttribute(
      "poster",
      "/video/lukas-loibl/The_hole_thumbnail.png",
    );
    expect(
      screen.getByRole("link", { name: "More about the project" }),
    ).toHaveAttribute("href", "#media-coverage");
  });

  it("renders Lukas Loibl's German world record chapter", async () => {
    await renderAsyncPage(
      AthletePage({
        params: Promise.resolve({ locale: "de", slug: "lukas-loibl" }),
      }),
    );

    expect(screen.getByText("Aktuelles Projekt")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Weltrekord" })).toBeVisible();
    expect(screen.getByText(/zehn natürliche Felsformationen/)).toBeVisible();
    expect(
      screen.getByRole("heading", {
        name: /Socail Media\s+und Sponsoring/,
      }),
    ).toBeVisible();
    expect(screen.getByRole("heading", { name: "Für die Kamera springen?" }))
      .toBeVisible();
    expect(
      screen.getByRole("button", { name: "Für die Kamera springen? abspielen" }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Planung zuerst" }))
      .toHaveAttribute("href", "#planning-comes-first");
    expect(screen.getByRole("link", { name: "Social Media & Sponsoring" }))
      .toHaveAttribute("href", "#audio-story");
    expect(screen.getByRole("link", { name: "Nicht springen" }))
      .toHaveAttribute("href", "#the-mountain-will-still-be-here");
    expect(screen.getByRole("link", { name: "Weltrekord" })).toHaveAttribute(
      "href",
      "#world-record",
    );
    expect(screen.getByText("Entscheidungsfindung")).toBeVisible();
    expect(screen.getAllByText("Nicht springen")).toHaveLength(2);
  });

  it("updates the hero quote when navigating between athlete pages", async () => {
    const { rerender } = await renderAsyncPage(
      AthletePage({
        params: Promise.resolve({ locale: "en", slug: "tim-howell" }),
      }),
    );

    expect(
      screen.getByText(
        "There is nothing anybody can tell me that's going to make me jump.",
      ),
    ).toBeVisible();

    rerender(
      await AthletePage({
        params: Promise.resolve({ locale: "en", slug: "josef-braun" }),
      }),
    );

    expect(
      screen.queryByText(
        "There is nothing anybody can tell me that's going to make me jump.",
      ),
    ).not.toBeInTheDocument();
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
    expect(
      screen.getByRole("heading", { name: "Profile and Experience" }),
    ).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Experience" }))
      .not.toBeInTheDocument();
    expect(container.querySelector("#portrait-introduction")).not.toBeInTheDocument();
    expect(
      screen.getByAltText("Marcel Geser wearing a helmet and blue wingsuit gear"),
    ).toHaveAttribute(
      "src",
      "/images/athletes/marcel-geser/profile.jpg",
    );
    expect(screen.getByText("2014")).toBeInTheDocument();
    expect(screen.getByText("850+")).toBeInTheDocument();
    expect(screen.getByText("1,500+")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("No")).toBeVisible());
    expect(screen.getAllByText("Unknown")).toHaveLength(1);
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
      screen
        .getByRole("heading", { name: "Photo Gallery" })
        .closest("section")
        ?.querySelector('[data-gallery-layout="editorial-grid"]'),
    ).toHaveClass("grid", "grid-cols-1", "items-start", "md:grid-cols-12");
    expect(
      container.querySelector(
        'img[src="/images/athletes/marcel-geser/gallery/DJI_20250607050910_0491_D.jpg"]',
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        'img[src="/images/athletes/marcel-geser/gallery/DJI_20250607050910_0491_D.jpg"]',
      ),
    ).toHaveClass("h-auto", "object-contain");
    fireEvent.click(
      screen.getByRole("button", {
        name: /Open image full size: Wingsuit pilot standing on a grassy launch slope/,
      }),
    );
    expect(screen.getByRole("dialog")).toBeVisible();
    expect(screen.getByText("Image 1 / 9")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Next image" }));
    expect(screen.getByText("Image 2 / 9")).toBeVisible();
    fireEvent.click(screen.getAllByRole("button", { name: "Close full-size image" })[0]);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByText("Interview Quotes")).not.toBeInTheDocument();
    expect(screen.queryByText("Audio Interviews")).not.toBeInTheDocument();
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
    expect(screen.getByRole("heading", { name: "More Athlete Portraits" }))
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
    expect(screen.getByRole("heading", { name: "Profil und Erfahrung" }))
      .toBeVisible();
    expect(screen.getByText("BASE seit")).toBeVisible();
    expect(screen.getByText("Reichweite")).toBeVisible();
    expect(screen.getByText("1’500+")).toBeInTheDocument();
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
    expect(screen.queryByText("Interviewzitate")).not.toBeInTheDocument();
    expect(screen.queryByText("Audio-Interviews")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Persönliche Links & Social Media" }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: /Marcel Geser on YouTube/ }))
      .toBeVisible();
    expect(
      screen.queryByRole("heading", { name: "Sponsoren & Partnerschaften" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Vom Porträt zu den Erkenntnissen" }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Erkenntnisse öffnen" }))
      .toHaveAttribute("href", "/de/findings");
    expect(screen.getAllByText("Unbekannt")).toHaveLength(1);
  });

  it("renders formatted reach and sponsorship information", async () => {
    const { unmount } = await renderAsyncPage(
      AthletePage({
        params: Promise.resolve({ locale: "en", slug: "niclas-strohmeier" }),
      }),
    );

    expect(screen.getByText("500,000+")).toBeInTheDocument();
    expect(screen.getByText("Tourism Professional")).toBeVisible();
    expect(screen.getByText("Terminal")).toBeVisible();
    unmount();

    await renderAsyncPage(
      AthletePage({
        params: Promise.resolve({ locale: "de", slug: "niclas-strohmeier" }),
      }),
    );

    expect(screen.getByText("500’000+")).toBeInTheDocument();
  });

  it("renders sponsor information as neutral profile text", async () => {
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
    expect(screen.getByText("Sponsorship")).toBeVisible();
    await waitFor(() => expect(screen.getByText("Yes")).toBeVisible());
    expect(
      screen.getByText(
        "Lukas Loibl reports sponsorship relationships with Atair Canopies, Squirrel, DJI and Moreboards. These partnerships are documented here as part of the athlete's professional context within BASE jumping.",
      ),
    ).toBeVisible();
    expect(
      screen.queryByRole("heading", { name: "Sponsors & Partnerships" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByAltText(/Atair Canopies logo/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Atair Canopies/i }),
    ).not.toBeInTheDocument();
  });

  it("renders Josef Braun sponsor names without sponsor links or logos", async () => {
    await renderAsyncPage(
      AthletePage({
        params: Promise.resolve({ locale: "en", slug: "josef-braun" }),
      }),
    );

    expect(
      screen.queryByRole("heading", { name: "Sponsors & Partnerships" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(
        "Josef Braun reports sponsorship relationships with Group A and Fly The Earth. These partnerships are documented here as part of the athlete's professional context within BASE jumping.",
      ),
    ).toBeVisible();
    expect(screen.queryByAltText("Group A logo")).not.toBeInTheDocument();
    expect(screen.queryByAltText("Fly The Earth logo")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Group A/i }))
      .not.toBeInTheDocument();
  });
});

function firstName(name: string) {
  return name.split(" ")[0] ?? name;
}

function possessiveName(name: string) {
  return name.endsWith("s") ? `${name}'` : `${name}'s`;
}
