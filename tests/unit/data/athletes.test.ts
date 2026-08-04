import { describe, expect, it } from "vitest";

import { athletes } from "@/data/athletes";

const expectedMediaCounts = new Map([
  ["tim-howell", { images: 11 }],
  ["lukas-loibl", { images: 6 }],
  ["marcel-geser", { images: 9 }],
  ["niclas-strohmeier", { images: 5 }],
  ["josef-braun", { images: 4 }],
]);

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
  ["niclas-strohmeier", "Die langsame Progression ist die sichere Progression."],
  [
    "josef-braun",
    "Es ist wie ein Kampf gegen sich selbst, den man zu hundert Prozent gewinnen muss.",
  ],
]);

describe("athletes data", () => {
  it("contains required fields for every athlete", () => {
    for (const athlete of athletes) {
      const mediaCounts = expectedMediaCounts.get(athlete.slug);

      expect(athlete.id).toBeTruthy();
      expect(athlete.slug).toBeTruthy();
      expect(athlete.name).toBeTruthy();
      expect(athlete.content.en).toBeTruthy();
      expect(athlete.content.de).toBeTruthy();
      expect(athlete.heroQuote.en).toBeTruthy();
      expect(athlete.heroQuote.de).toBeTruthy();
      expect(athlete.experience).toBeTruthy();
      expect(athlete).toHaveProperty("age");
      expect(athlete).toHaveProperty("country");
      expect(athlete.images.gallery).toHaveLength(mediaCounts?.images ?? 0);
      expect(athlete.audio).toEqual([]);
      expect(athlete.video).toEqual([]);
      expect(athlete.quotes).toEqual([]);
      expect(Array.isArray(athlete.links)).toBe(true);
      expect(Array.isArray(athlete.articles)).toBe(true);
      expect(athlete.sponsorship).toBeTruthy();
      expect(athlete.originStory.length).toBeGreaterThanOrEqual(4);
      for (const beat of athlete.originStory) {
        expect(beat.phase.en).toBeTruthy();
        expect(beat.phase.de).toBeTruthy();
        expect(beat.title.en).toBeTruthy();
        expect(beat.title.de).toBeTruthy();
        expect(beat.body.en).toBeTruthy();
        expect(beat.body.de).toBeTruthy();
      }
    }
  });

  it("contains the exact athlete-specific hero quotes for both locales", () => {
    for (const athlete of athletes) {
      const expectedQuote = expectedHeroQuotes.get(athlete.slug);

      expect(expectedQuote).toBeTruthy();
      expect(athlete.heroQuote.en).toBe(expectedQuote);
      expect(athlete.heroQuote.de).toBe(expectedQuote);
    }
  });

  it("contains localized interview feature data on profiles with interview chapters", () => {
    const tim = athletes.find((athlete) => athlete.slug === "tim-howell");
    const lukas = athletes.find((athlete) => athlete.slug === "lukas-loibl");

    expect(tim?.interviewFeatures).toMatchObject([
      {
        id: "career",
        placement: "after-origin",
        chapter: {
          en: "Social Media",
          de: "Social Media",
        },
        quote: "You're Only as Good\nas Your Last Stunt",
        poster: null,
        videos: {
          en: { provider: "youtube", videoId: "MJ-CSQxONJs" },
          de: { provider: "youtube", videoId: "nZcqDTgsYGM" },
        },
      },
      {
        id: "decision-making",
        placement: "after-gallery",
        chapter: {
          en: "Decision Making",
          de: "Decision Making",
        },
        quote: "Make the\nRight Decision",
        poster: null,
        videos: {
          en: { provider: "youtube", videoId: "N9JUEpIOwkA" },
          de: { provider: "youtube", videoId: "Bi4Ba7mDy9Y" },
        },
      },
    ]);
    expect(lukas?.interviewFeatures).toMatchObject([
      {
        id: "the-mountain-will-still-be-here",
        placement: "after-origin",
        title: {
          en: "Choosing Not To Jump",
          de: "Der Berg steht in tausend Jahren noch",
        },
        navTitle: {
          en: "The Mountain Will Still Be Here",
          de: "Der Berg steht in tausend Jahren noch",
        },
        chapter: {
          en: "Choosing Not to Jump",
          de: "Nicht springen",
        },
        quote: "The Mountain\nWill Still Be Here\nin a Thousand Years",
        subtitle: {
          en: "Not every summit ends with a jump. Sometimes the safest decision is to hike back down and wait for another day.",
        },
        poster: null,
        videos: {
          en: { provider: "youtube", videoId: "B4Bsp_ewxik" },
          de: { provider: "youtube", videoId: "mVfu3RBZGVQ" },
        },
      },
      {
        id: "planning-comes-first",
        placement: "after-gallery",
        title: {
          en: "Planning Comes Before Everything",
          de: "Planung ist oberste Priorität",
        },
        navTitle: {
          en: "Planning Comes First",
          de: "Planung ist oberste Priorität",
        },
        chapter: {
          en: "Decision Making",
          de: "Entscheidungsfindung",
        },
        quote: "Planning\nComes First",
        subtitle: {
          en: "Every jump begins long before standing at the exit. Weather, conditions, equipment and personal limits determine whether a jump should happen at all.",
        },
        poster: null,
        videos: {
          en: { provider: "youtube", videoId: "QNf-Gmdh1Ig" },
          de: { provider: "youtube", videoId: "jfAIEg2GOGY" },
        },
      },
    ]);
    expect(
      athletes
        .filter(
          (athlete) => athlete.slug !== "tim-howell" && athlete.slug !== "lukas-loibl",
        )
        .every((athlete) => athlete.interviewFeatures === undefined),
    ).toBe(true);
  });

  it("contains reusable audio story data on the profiles with audio chapters", () => {
    const tim = athletes.find((athlete) => athlete.slug === "tim-howell");
    const lukas = athletes.find((athlete) => athlete.slug === "lukas-loibl");

    expect(tim?.audioStories).toMatchObject([
      {
        id: "knowledge-dispels-fear",
        placement: "after-gallery",
        chapter: {
          en: "AUDIO STORY",
          de: "AUDIO STORY",
        },
        title: {
          en: "Understanding Fear",
          de: "Angst verstehen",
        },
        audio: {
          src: "/audio/tim-howell/Tim_knowledge_dispels_fear - isolated.mp3",
        },
        transcript: {
          en: "/audio/tim-howell/Tim_knowledge_dispels_fear_EN.srt",
          de: "/audio/tim-howell/Tim_knowledge_dispels_fear_DE.srt",
        },
        portrait: "/images/athletes/tim-howell/audio.jpg",
      },
    ]);
    expect(tim?.audioStories?.[0]).not.toHaveProperty("waveform");
    expect(lukas?.audioStories).toMatchObject([
      {
        id: "social-media-and-sponsorship",
        placement: "after-gallery",
        chapter: {
          en: "AUDIO STORY",
          de: "AUDIO STORY",
        },
        title: {
          en: "Jumping for the camera?",
          de: "Für die Kamera springen?",
        },
        audio: {
          src: "/audio/lukas-loibl/Lukas_SocialMedia.wav",
        },
        transcript: {
          en: "/audio/lukas-loibl/Lukas_SocialMedia_EN.srt",
          de: "/audio/lukas-loibl/Lukas_SocialMedia_DE.srt",
        },
        portrait: "/images/athletes/lukas-loibl/Lukas-audio.jpeg",
      },
    ]);
    expect(lukas?.audioStories?.[0]).not.toHaveProperty("waveform");
    expect(
      athletes
        .filter(
          (athlete) => athlete.slug !== "tim-howell" && athlete.slug !== "lukas-loibl",
        )
        .every((athlete) => athlete.audioStories === undefined),
    ).toBe(true);
  });

  it("contains Tim Howell's future project data only on his profile", () => {
    const tim = athletes.find((athlete) => athlete.slug === "tim-howell");

    expect(tim?.futureProject).toMatchObject({
      chapter: {
        en: "FUTURE PROJECT",
        de: "FUTURE PROJECT",
      },
      title: {
        en: "A Leap from the Top of the World",
        de: "A Leap from the Top of the World",
      },
      displayTitle: "A Leap from\nthe Top of\nthe World",
      description: {
        en: "Tim is preparing another attempt to fly from Lhotse in the Himalaya. The project follows the ambition, preparation and uncertainty behind a high-altitude wingsuit objective.",
        de: "Tim bereitet einen weiteren Versuch vor, vom Lhotse im Himalaya zu fliegen. Das Projekt begleitet Ambition, Vorbereitung und Ungewissheit hinter einem Wingsuit-Ziel in grosser Höhe.",
      },
      video: {
        src: "/video/tim-howell/Future_project.mp4",
        poster: null,
        caption: {
          en: "Teaser (2023)",
          de: "Teaser (2023)",
        },
      },
      links: [
        {
          url: "https://explorersweb.com/lhotse-wingsuit-update/",
          label: {
            en: "First attempt (2024)",
          },
        },
        {
          url: "https://explorersweb.com/tim-howell-will-return-to-lhotse-to-attempt-the-worlds-highest-wingsuit-jump/",
          label: {
            en: "Second attempt (2025)",
          },
        },
        {
          url: "https://explorersweb.com/tim-howell-will-again-try-to-wingsuit-from-lhotse/",
          label: {
            en: "Third attempt (2026)",
          },
        },
        {
          url: "https://www.jottnar.com/pages/tim-howell-lhotse-world-record-jump",
          label: {
            en: "Read the Jöttnar Project Story (2025)",
          },
        },
      ],
    });
    expect(
      athletes
        .filter((athlete) => athlete.slug !== "tim-howell")
        .every((athlete) => athlete.futureProject === undefined),
    ).toBe(true);
  });

  it("contains Tim Howell's scroll scrub jump data only on his profile", () => {
    const tim = athletes.find((athlete) => athlete.slug === "tim-howell");

    expect(tim?.scrollVideo).toMatchObject({
      id: "iran-jump",
      chapter: {
        en: "SCROLL THROUGH",
        de: "SCROLL THROUGH",
      },
      title: {
        en: "The Jump",
        de: "Der Sprung",
      },
      displayTitle: "The Jump",
      video: {
        src: "/video/tim-howell/The_jump.mp4",
        type: "video/mp4",
      },
      poster: null,
      scrollLength: 4,
      fallbackLabel: {
        en: "Tim Howell BASE jump in Iran",
        de: "Tim Howell BASE Jump im Iran",
      },
    });
    expect(tim?.scrollVideo?.description).toBeUndefined();
    expect(tim?.scrollVideo?.cues).toEqual([
      {
        start: 0.08,
        end: 0.22,
        text: {
          en: "The line begins long before the exit.",
          de: "Die Linie beginnt lange vor dem Exit.",
        },
      },
      {
        start: 0.38,
        end: 0.52,
        text: {
          en: "Every movement is prepared.",
          de: "Jede Bewegung ist vorbereitet.",
        },
      },
      {
        start: 0.72,
        end: 0.88,
        text: {
          en: "In the end, the decision remains.",
          de: "Am Ende bleibt die Entscheidung.",
        },
      },
    ]);
    expect(
      athletes
        .filter((athlete) => athlete.slug !== "tim-howell")
        .every((athlete) => athlete.scrollVideo === undefined),
    ).toBe(true);
  });

  it("does not contain placeholder origin story copy", () => {
    for (const athlete of athletes) {
      expect(athlete.content.en.baseStoryTitle).not.toBe("Story in development");
      expect(athlete.content.de.baseStoryTitle).not.toBe("Geschichte in Entwicklung");
      expect(athlete.content.en.baseStory).not.toContain(
        "The detailed story will be added",
      );
      expect(athlete.content.de.baseStory).not.toContain(
        "Die ausführliche Geschichte wird ergänzt",
      );
    }
  });

  it("uses descriptive localized alt text for athlete gallery images", () => {
    for (const athlete of athletes) {
      for (const image of athlete.images.gallery) {
        expect(image.alt.en).toBeTruthy();
        expect(image.alt.de).toBeTruthy();
        expect(image.alt.en).not.toMatch(/gallery image|image \d/i);
        expect(image.alt.de).not.toMatch(/Galerie-Bild|Bild \d/i);
        expect(image.alt.en).not.toContain(image.src);
        expect(image.alt.de).not.toContain(image.src);
        expect(image.width).toBeGreaterThan(0);
        expect(image.height).toBeGreaterThan(0);
      }
    }
  });

  it("uses confirmed local portrait images where available", () => {
    expect(
      athletes.find((athlete) => athlete.slug === "tim-howell")?.images.portrait,
    ).toBe("/images/athletes/tim-howell/profile.jpg");
    expect(
      athletes.find((athlete) => athlete.slug === "marcel-geser")?.images.portrait,
    ).toBe("/images/athletes/marcel-geser/profile.jpg");
    expect(
      athletes.find((athlete) => athlete.slug === "lukas-loibl")?.images.portrait,
    ).toBe("/images/athletes/lukas-loibl/profile.jpg");
    expect(
      athletes.find((athlete) => athlete.slug === "josef-braun")?.images.portrait,
    ).toBe("/images/athletes/josef-braun/profile-color.jpg");
    expect(
      athletes.find((athlete) => athlete.slug === "niclas-strohmeier")?.images.portrait,
    ).toBe("/images/athletes/niclas-strohmeier/profile.jpg");
    expect(
      athletes
        .filter(
          (athlete) =>
            athlete.slug !== "tim-howell" &&
            athlete.slug !== "marcel-geser" &&
            athlete.slug !== "lukas-loibl" &&
            athlete.slug !== "josef-braun" &&
            athlete.slug !== "niclas-strohmeier",
        )
        .every((athlete) => athlete.images.portrait === null),
    ).toBe(true);
  });

  it("uses confirmed local hero images where available", () => {
    expect(athletes.find((athlete) => athlete.slug === "tim-howell")?.images.hero).toBe(
      "/images/athletes/tim-howell/hero.jpg",
    );
    expect(
      athletes.find((athlete) => athlete.slug === "marcel-geser")?.images.hero,
    ).toBe("/images/athletes/marcel-geser/hero.jpg");
    expect(
      athletes.find((athlete) => athlete.slug === "lukas-loibl")?.images.hero,
    ).toBe("/images/athletes/lukas-loibl/hero.jpeg");
    expect(
      athletes.find((athlete) => athlete.slug === "josef-braun")?.images.hero,
    ).toBe("/images/athletes/josef-braun/hero.JPG");
    expect(
      athletes.find((athlete) => athlete.slug === "niclas-strohmeier")?.images.hero,
    ).toBe("/images/athletes/niclas-strohmeier/hero.jpg");
    expect(
      athletes
        .filter(
          (athlete) =>
            athlete.slug !== "tim-howell" &&
            athlete.slug !== "marcel-geser" &&
            athlete.slug !== "lukas-loibl" &&
            athlete.slug !== "josef-braun" &&
            athlete.slug !== "niclas-strohmeier",
        )
        .every((athlete) => athlete.images.hero === null),
    ).toBe(true);
  });

  it("has unique ids and slugs", () => {
    const ids = athletes.map((athlete) => athlete.id);
    const slugs = athletes.map((athlete) => athlete.slug);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("uses the exact expected slugs", () => {
    expect(athletes.map((athlete) => athlete.slug)).toEqual([
      "tim-howell",
      "lukas-loibl",
      "marcel-geser",
      "niclas-strohmeier",
      "josef-braun",
    ]);
  });

  it("contains verified athlete metadata and experience values", () => {
    expect(
      athletes.map((athlete) => [athlete.slug, athlete.age, athlete.country]),
    ).toEqual([
      ["tim-howell", 37, "United Kingdom"],
      ["lukas-loibl", 26, "Austria"],
      ["marcel-geser", 45, "Switzerland"],
      ["niclas-strohmeier", 28, "Germany"],
      ["josef-braun", 27, "Germany"],
    ]);
    expect(
      athletes.find((athlete) => athlete.slug === "marcel-geser")?.experience,
    ).toMatchObject({ skydives: 850, basejumps: 1500, sponsored: false });
    expect(
      athletes.find((athlete) => athlete.slug === "niclas-strohmeier")?.experience,
    ).toMatchObject({ socialMediaReach: 500000, sponsored: false });
    expect(
      athletes.find((athlete) => athlete.slug === "josef-braun")?.experience,
    ).toMatchObject({ socialMediaReach: 280000, sponsored: false });
    expect(
      athletes.find((athlete) => athlete.slug === "lukas-loibl")?.experience,
    ).toMatchObject({ skydives: 3500, basejumps: 3000, sponsored: true });
    expect(
      athletes.find((athlete) => athlete.slug === "tim-howell")?.experience,
    ).toMatchObject({ baseSeasons: 14, basejumps: 1450, sponsored: true });
  });

  it("contains athlete-specific sponsor data", () => {
    expect(athletes.find((athlete) => athlete.slug === "tim-howell")?.sponsors).toEqual(
      ["Jöttnar", "Scarpa", "Adrenalin BASE", "Inigo Insurance", "Stirling Timepieces"],
    );
    expect(
      athletes.find((athlete) => athlete.slug === "josef-braun")?.sponsors,
    ).toEqual(["Group A", "Fly The Earth"]);
    expect(
      athletes.find((athlete) => athlete.slug === "lukas-loibl")?.sponsors,
    ).toEqual(["Atair Canopies", "Squirrel", "DJI", "Moreboards"]);
    expect(
      athletes
        .filter(
          (athlete) =>
            athlete.slug !== "tim-howell" &&
            athlete.slug !== "lukas-loibl" &&
            athlete.slug !== "josef-braun",
        )
        .every((athlete) => athlete.sponsors.length === 0),
    ).toBe(true);
  });

  it("contains athlete-specific external links and media coverage", () => {
    expect(
      athletes.find((athlete) => athlete.slug === "josef-braun")?.links,
    ).toHaveLength(3);
    expect(
      athletes.find((athlete) => athlete.slug === "josef-braun")?.articles,
    ).toEqual([
      {
        title: {
          en: "Jack Simpson Podcast with Josef Braun",
          de: "Jack Simpson Podcast with Josef Braun",
        },
        publisher: "Spotify",
        logo: "/images/publishers/spotify.webp",
        url: "https://open.spotify.com/episode/3X4xOWb8lMYXub1Fw96rM6?si=81846fae04874b6c",
      },
    ]);
    expect(
      athletes.find((athlete) => athlete.slug === "lukas-loibl")?.links,
    ).toHaveLength(5);
    expect(
      athletes.find((athlete) => athlete.slug === "lukas-loibl")?.articles,
    ).toHaveLength(5);
    expect(
      athletes.find((athlete) => athlete.slug === "niclas-strohmeier")?.links,
    ).toHaveLength(4);
    expect(
      athletes.find((athlete) => athlete.slug === "niclas-strohmeier")?.articles,
    ).toHaveLength(0);
    expect(
      athletes.find((athlete) => athlete.slug === "marcel-geser")?.links,
    ).toMatchObject([{ type: "youtube" }]);
    expect(
      athletes.find((athlete) => athlete.slug === "marcel-geser")?.articles,
    ).toHaveLength(3);
    expect(
      athletes.find((athlete) => athlete.slug === "tim-howell")?.links,
    ).toHaveLength(4);
    expect(
      athletes.find((athlete) => athlete.slug === "tim-howell")?.articles,
    ).toHaveLength(8);
  });

  it("contains Lukas Loibl's current world record project data only on his profile", () => {
    const lukas = athletes.find((athlete) => athlete.slug === "lukas-loibl");

    expect(lukas?.currentProject).toMatchObject({
      id: "lukas-loibl-world-record",
      chapter: {
        en: "Current Project",
        de: "Aktuelles Projekt",
      },
      title: {
        en: "World Record",
        de: "Weltrekord",
      },
      displayTitle: {
        en: "World\nRecord",
        de: "Weltrekord",
      },
      images: [
        {
          src: "/images/athletes/lukas-loibl/Loch1.jpeg",
        },
        {
          src: "/images/athletes/lukas-loibl/Loch2.jpeg",
        },
      ],
      video: {
        src: "/video/lukas-loibl/The_hole.mp4",
        type: "video/mp4",
        poster: "/video/lukas-loibl/The_hole_thumbnail.png",
      },
      cta: {
        label: {
          en: "More about the project",
          de: "Mehr zum Projekt",
        },
        href: "#media-coverage",
      },
    });
    expect(
      athletes
        .filter((athlete) => athlete.slug !== "lukas-loibl")
        .every((athlete) => athlete.currentProject === undefined),
    ).toBe(true);
  });

  it("uses Josef Braun's story image on the Today step", () => {
    const josef = athletes.find((athlete) => athlete.slug === "josef-braun");
    const todayStep = josef?.originStory.find((beat) => beat.phase.en === "05 — Today");

    expect(todayStep?.media).toMatchObject({
      type: "image",
      src: "/images/athletes/josef-braun/story.jpg",
      alt: {
        en: "Wingsuit flyer exiting beside a rocky cliff face",
        de: "Wingsuit-Flieger springt neben einer felsigen Wand ab",
      },
    });
    expect(josef?.originStory[1]?.media).toBeUndefined();
  });

  it("uses Lukas Loibl's story image on the BASE step", () => {
    const lukas = athletes.find((athlete) => athlete.slug === "lukas-loibl");
    const baseStep = lukas?.originStory.find(
      (beat) => beat.phase.en === "05 — Into BASE",
    );

    expect(baseStep?.media).toMatchObject({
      type: "image",
      src: "/images/athletes/lukas-loibl/story.jpeg",
      alt: {
        en: "Wingsuit flyer passing through a rocky arch",
        de: "Wingsuit-Flieger fliegt durch einen felsigen Bogen",
      },
    });
    expect(lukas?.originStory[1]?.media).toBeUndefined();
  });

  it("uses Niclas Strohmeier's story image on the Skydiving step", () => {
    const niclas = athletes.find((athlete) => athlete.slug === "niclas-strohmeier");
    const skydivingStep = niclas?.originStory.find(
      (beat) => beat.phase.en === "03 — Skydiving",
    );

    expect(skydivingStep?.media).toMatchObject({
      type: "image",
      src: "/images/athletes/niclas-strohmeier/story.jpg",
      alt: {
        en: "Wingsuit flyer in a yellow suit against a bright sky",
        de: "Wingsuit-Flieger in gelbem Anzug vor hellem Himmel",
      },
    });
  });
});
