import { describe, expect, it } from "vitest";

import { createLocalizedMetadata, siteName } from "@/lib/metadata";

describe("createLocalizedMetadata", () => {
  it("leaves page titles for the root template and formats social titles once", () => {
    const metadata = createLocalizedMetadata({
      locale: "en",
      path: "/project",
      title: "The Project | Falling for Fame? | Falling for Fame?",
      description: "Project description",
    });

    expect(metadata.title).toBe("The Project");
    expect(metadata.openGraph?.title).toBe("The Project | Falling for Fame?");
    expect(metadata.twitter?.title).toBe("The Project | Falling for Fame?");
  });

  it("uses an absolute site title for localized homepages", () => {
    const metadata = createLocalizedMetadata({
      locale: "de",
      title: "Start",
      description: "Deutsche Beschreibung",
    });

    expect(metadata.title).toEqual({ absolute: siteName });
    expect(metadata.openGraph?.title).toBe(siteName);
    expect(metadata.twitter?.title).toBe(siteName);
  });

  it("builds canonical and language alternates from the localized route", () => {
    const metadata = createLocalizedMetadata({
      locale: "de",
      path: "/athletes/tim-howell",
      title: "Tim Howell",
      description: "Athletenporträt",
    });

    expect(metadata.alternates).toEqual({
      canonical: "/de/athletes/tim-howell",
      languages: {
        en: "/en/athletes/tim-howell",
        de: "/de/athletes/tim-howell",
        "x-default": "/en/athletes/tim-howell",
      },
    });
    expect(metadata.openGraph).toMatchObject({
      url: "/de/athletes/tim-howell",
      locale: "de_CH",
      alternateLocale: ["en_GB"],
    });
  });
});
