import { describe, expect, it } from "vitest";

import { athletes } from "@/data/athletes";

const expectedMediaCounts = new Map([
  ["tim-howell", { images: 18 }],
  ["lukas-loibl", { images: 6 }],
  ["marcel-geser", { images: 9 }],
  ["niclas-strohmeier", { images: 5 }],
  ["josef-braun", { images: 4 }],
]);

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

  it("uses confirmed local portrait images where available", () => {
    expect(athletes.find((athlete) => athlete.slug === "tim-howell")?.images.portrait)
      .toBe("/images/athletes/tim-howell/profile.jpg");
    expect(
      athletes.find((athlete) => athlete.slug === "marcel-geser")?.images.portrait,
    ).toBe("/images/athletes/marcel-geser/profile.jpg");
    expect(athletes.find((athlete) => athlete.slug === "lukas-loibl")?.images.portrait)
      .toBe("/images/athletes/lukas-loibl/profile.jpg");
    expect(athletes.find((athlete) => athlete.slug === "josef-braun")?.images.portrait)
      .toBe("/images/athletes/josef-braun/profile.jpg");
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
    expect(athletes.find((athlete) => athlete.slug === "tim-howell")?.images.hero)
      .toBe("/images/athletes/tim-howell/hero.jpg");
    expect(athletes.find((athlete) => athlete.slug === "marcel-geser")?.images.hero)
      .toBe("/images/athletes/marcel-geser/hero.jpg");
    expect(athletes.find((athlete) => athlete.slug === "lukas-loibl")?.images.hero)
      .toBe("/images/athletes/lukas-loibl/hero.jpeg");
    expect(athletes.find((athlete) => athlete.slug === "josef-braun")?.images.hero)
      .toBe("/images/athletes/josef-braun/hero.JPG");
    expect(athletes.find((athlete) => athlete.slug === "niclas-strohmeier")?.images.hero)
      .toBe("/images/athletes/niclas-strohmeier/hero.jpg");
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
    expect(athletes.map((athlete) => [athlete.slug, athlete.age, athlete.country]))
      .toEqual([
        ["tim-howell", 37, "United Kingdom"],
        ["lukas-loibl", 26, "Austria"],
        ["marcel-geser", 45, "Switzerland"],
        ["niclas-strohmeier", 28, "Germany"],
        ["josef-braun", 27, "Germany"],
      ]);
    expect(athletes.find((athlete) => athlete.slug === "marcel-geser")?.experience)
      .toMatchObject({ skydives: 850, basejumps: 1500, sponsored: false });
    expect(athletes.find((athlete) => athlete.slug === "niclas-strohmeier")?.experience)
      .toMatchObject({ socialMediaReach: 500000, sponsored: false });
    expect(athletes.find((athlete) => athlete.slug === "josef-braun")?.experience)
      .toMatchObject({ socialMediaReach: 280000, sponsored: false });
    expect(athletes.find((athlete) => athlete.slug === "lukas-loibl")?.experience)
      .toMatchObject({ skydives: 3500, basejumps: 3000, sponsored: true });
    expect(athletes.find((athlete) => athlete.slug === "tim-howell")?.experience)
      .toMatchObject({ baseSeasons: 14, basejumps: 1450, sponsored: true });
  });

  it("contains athlete-specific sponsor data", () => {
    expect(athletes.find((athlete) => athlete.slug === "tim-howell")?.sponsors)
      .toMatchObject([
        {
          name: "Jöttnar",
          logo: "/images/sponsors/jottnar_black.png",
          url: "https://www.jottnar.com/pages/pro-tim-howell",
        },
        { name: "Scarpa", logo: "/images/sponsors/scarpa_originla.webp" },
        { name: "Adrenalin BASE", logo: "/images/sponsors/adrenalin_base.png" },
        {
          name: "Inigo Insurance",
          logo: "/images/sponsors/inigo.png",
          url: "https://inigoinsurance.com/risk-ambassadors/tim-howell/",
        },
        {
          name: "Stirling Timepieces",
          logo: "/images/sponsors/stirling.jpg",
          url: "https://stirlingtimepieces.com/",
        },
      ]);
    expect(athletes.find((athlete) => athlete.slug === "josef-braun")?.sponsors)
      .toMatchObject([
        {
          name: "Group A",
          logo: "/images/sponsors/group_a.avif",
          url: "https://www.groupaworldwide.com/pages/josef-braun",
        },
        {
          name: "Fly The Earth",
          logo: "/images/sponsors/flytheearth.png",
          url: "https://flytheearth.com/",
        },
      ]);
    expect(athletes.find((athlete) => athlete.slug === "lukas-loibl")?.sponsors)
      .toMatchObject([
        { name: "Atair Canopies", logo: "/images/sponsors/atair_white.png" },
        { name: "Moreboards", logo: "/images/sponsors/moreboards.avif" },
        { name: "Squirrel", logo: "/images/sponsors/squirrel_blue.png" },
        { name: "DJI", logo: "/images/sponsors/dji_white.webp" },
      ]);
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
    expect(athletes.find((athlete) => athlete.slug === "josef-braun")?.links)
      .toHaveLength(3);
    expect(athletes.find((athlete) => athlete.slug === "josef-braun")?.articles)
      .toEqual([
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
    expect(athletes.find((athlete) => athlete.slug === "lukas-loibl")?.links)
      .toHaveLength(5);
    expect(athletes.find((athlete) => athlete.slug === "lukas-loibl")?.articles)
      .toHaveLength(5);
    expect(athletes.find((athlete) => athlete.slug === "niclas-strohmeier")?.links)
      .toHaveLength(4);
    expect(athletes.find((athlete) => athlete.slug === "niclas-strohmeier")?.articles)
      .toHaveLength(0);
    expect(athletes.find((athlete) => athlete.slug === "marcel-geser")?.links)
      .toMatchObject([{ type: "youtube" }]);
    expect(athletes.find((athlete) => athlete.slug === "marcel-geser")?.articles)
      .toHaveLength(3);
    expect(athletes.find((athlete) => athlete.slug === "tim-howell")?.links)
      .toHaveLength(4);
    expect(athletes.find((athlete) => athlete.slug === "tim-howell")?.articles)
      .toHaveLength(8);
  });

  it("uses Josef Braun's story image on the Today step", () => {
    const josef = athletes.find((athlete) => athlete.slug === "josef-braun");
    const todayStep = josef?.originStory.find(
      (beat) => beat.phase.en === "05 — Today",
    );

    expect(todayStep?.media).toEqual({
      type: "image",
      src: "/images/athletes/josef-braun/story.jpg",
    });
    expect(josef?.originStory[1]?.media).toBeUndefined();
  });

  it("uses Lukas Loibl's story image on the BASE step", () => {
    const lukas = athletes.find((athlete) => athlete.slug === "lukas-loibl");
    const baseStep = lukas?.originStory.find(
      (beat) => beat.phase.en === "05 — Into BASE",
    );

    expect(baseStep?.media).toEqual({
      type: "image",
      src: "/images/athletes/lukas-loibl/story.jpeg",
    });
    expect(lukas?.originStory[1]?.media).toBeUndefined();
  });

  it("uses Niclas Strohmeier's story image on the Skydiving step", () => {
    const niclas = athletes.find((athlete) => athlete.slug === "niclas-strohmeier");
    const skydivingStep = niclas?.originStory.find(
      (beat) => beat.phase.en === "03 — Skydiving",
    );

    expect(skydivingStep?.media).toEqual({
      type: "image",
      src: "/images/athletes/niclas-strohmeier/story.jpg",
    });
  });
});
