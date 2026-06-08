import { describe, expect, it } from "vitest";

import { athletes } from "@/data/athletes";

describe("athletes data", () => {
  it("contains required fields for every athlete", () => {
    for (const athlete of athletes) {
      expect(athlete.id).toBeTruthy();
      expect(athlete.slug).toBeTruthy();
      expect(athlete.name).toBeTruthy();
      expect(athlete.content.en).toBeTruthy();
      expect(athlete.content.de).toBeTruthy();
      expect(athlete.experience).toBeTruthy();
      expect(athlete).toHaveProperty("age");
      expect(athlete).toHaveProperty("country");
    }
  });

  it("has unique ids and slugs", () => {
    const ids = athletes.map((athlete) => athlete.id);
    const slugs = athletes.map((athlete) => athlete.slug);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("uses the exact expected slugs", () => {
    expect(athletes.map((athlete) => athlete.slug)).toEqual([
      "marcel-geser",
      "niclas-strohmeier",
      "lukas-loibl",
      "josef-braun",
      "tim-howell",
    ]);
  });
});
