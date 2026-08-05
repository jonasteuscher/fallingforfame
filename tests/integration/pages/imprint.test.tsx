import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import EnglishImprintPage, {
  generateMetadata as generateEnglishImprintMetadata,
} from "@/app/[locale]/imprint/page";
import PrivacyPage, {
  generateMetadata as generateEnglishPrivacyMetadata,
} from "@/app/[locale]/privacy/page";
import sitemap from "@/app/sitemap";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { localizedCurrentPath } from "@/i18n/navigation";
import { renderAsyncPage } from "../../test-utils/render-pages";

describe("imprint page", () => {
  it("renders the English legal notice at /en/imprint", async () => {
    await renderAsyncPage(
      EnglishImprintPage({ params: Promise.resolve({ locale: "en" }) }),
    );

    expect(screen.getByRole("heading", { name: "Imprint", level: 1 })).toBeVisible();
    expect(screen.getByText("Interactive multimedia web documentary")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Responsible person" })).toBeVisible();
    expect(screen.getByText("Jonas Teuscher")).toBeVisible();
    expect(screen.getByText("Bachelor of Science in Media Engineering")).toBeVisible();
    expect(screen.getByText("IMP (Institute of Multimedia Production)")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Image Credits" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Athlete Photography" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Historical Images" })).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "1797 - First Modern Parachute" }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Source: 1797 - First Modern Parachute" }),
    ).toHaveAttribute(
      "href",
      "https://en.wikipedia.org/wiki/File:First_parachute2.jpg",
    );
    expect(screen.getByRole("heading", { name: "Risk Notice" })).toBeVisible();
    expect(document.querySelectorAll("h1")).toHaveLength(1);
  });

  it("renders the German legal notice at /de/imprint", async () => {
    await renderAsyncPage(
      EnglishImprintPage({ params: Promise.resolve({ locale: "de" }) }),
    );

    expect(screen.getByRole("heading", { name: "Impressum", level: 1 })).toBeVisible();
    expect(screen.getByText("Interaktive multimediale Webdokumentation")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Verantwortliche Person" }),
    ).toBeVisible();
    expect(screen.getByRole("heading", { name: "Athletenfotografie" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Historische Bilder" })).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "1797 - Erster moderner Fallschirm" }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Quelle: 1797 - Erster moderner Fallschirm" }),
    ).toHaveAttribute(
      "href",
      "https://en.wikipedia.org/wiki/File:First_parachute2.jpg",
    );
    expect(screen.getByRole("heading", { name: "Risikohinweis" })).toBeVisible();
    expect(document.querySelectorAll("h1")).toHaveLength(1);
  });

  it("generates localized metadata", async () => {
    await expect(
      generateEnglishImprintMetadata({
        params: Promise.resolve({ locale: "en" }),
      }),
    ).resolves.toMatchObject({
      title: "Imprint | Falling for Fame?",
    });
    await expect(
      generateEnglishImprintMetadata({
        params: Promise.resolve({ locale: "de" }),
      }),
    ).resolves.toMatchObject({
      title: "Impressum | Falling for Fame?",
    });
  });

  it("renders the English privacy policy at /en/privacy", async () => {
    await renderAsyncPage(
      PrivacyPage({ params: Promise.resolve({ locale: "en" }) }),
    );

    expect(screen.getByRole("heading", { name: "Privacy", level: 1 })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Responsible person" })).toBeVisible();
    expect(screen.getByText("Jonas Teuscher, Ziegeleiweg 14, 3052 Zollikofen, Switzerland.")).toBeVisible();
    expect(screen.getByRole("heading", { name: "YouTube and embedded third-party media" })).toBeVisible();
    expect(screen.getByText(/youtube-nocookie\.com/)).toBeVisible();
    expect(screen.getByText(/falling-for-fame-mobile-notice-dismissed/)).toBeVisible();
    expect(screen.getByText(/sport-safety-warning-accepted/)).toBeVisible();
    expect(screen.getAllByRole("link", { name: "jonas.teuscher@gmail.com" })[0]).toHaveAttribute(
      "href",
      "mailto:jonas.teuscher@gmail.com",
    );
    expect(document.querySelectorAll("h1")).toHaveLength(1);
  });

  it("renders the German privacy policy at /de/privacy", async () => {
    await renderAsyncPage(
      PrivacyPage({ params: Promise.resolve({ locale: "de" }) }),
    );

    expect(screen.getByRole("heading", { name: "Datenschutz", level: 1 })).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Verantwortliche Person" }),
    ).toBeVisible();
    expect(screen.getByText("Jonas Teuscher, Ziegeleiweg 14, 3052 Zollikofen, Schweiz.")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "YouTube und eingebettete Inhalte" }),
    ).toBeVisible();
    expect(screen.getByText(/youtube-nocookie\.com/)).toBeVisible();
    expect(screen.getByText(/sport-safety-warning-accepted/)).toBeVisible();
    expect(screen.getAllByRole("link", { name: "jonas.teuscher@gmail.com" })[0]).toHaveAttribute(
      "href",
      "mailto:jonas.teuscher@gmail.com",
    );
    expect(document.querySelectorAll("h1")).toHaveLength(1);
  });

  it("generates localized privacy metadata", async () => {
    await expect(
      generateEnglishPrivacyMetadata({
        params: Promise.resolve({ locale: "en" }),
      }),
    ).resolves.toMatchObject({
      title: "Privacy | Falling for Fame?",
      description:
        "Information about the processing of personal data on the Falling for Fame? multimedia documentary website.",
      alternates: {
        canonical: "/en/privacy",
        languages: {
          en: "/en/privacy",
          de: "/de/privacy",
        },
      },
    });
    await expect(
      generateEnglishPrivacyMetadata({
        params: Promise.resolve({ locale: "de" }),
      }),
    ).resolves.toMatchObject({
      title: "Datenschutz | Falling for Fame?",
      description:
        "Informationen zur Verarbeitung personenbezogener Daten auf der multimedialen Webdokumentation Falling for Fame?.",
      alternates: {
        canonical: "/de/privacy",
        languages: {
          en: "/en/privacy",
          de: "/de/privacy",
        },
      },
    });
  });

  it("maps privacy pages correctly when switching languages", () => {
    expect(localizedCurrentPath("/en/privacy", "de")).toBe("/de/privacy");
    expect(localizedCurrentPath("/de/privacy", "en")).toBe("/en/privacy");
  });

  it("adds localized footer legal links without primary navigation", () => {
    const { rerender } = render(<SiteFooter locale="en" />);

    expect(screen.getByRole("link", { name: "Imprint" })).toHaveAttribute(
      "href",
      "/en/imprint",
    );
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute(
      "href",
      "/en/privacy",
    );

    rerender(<SiteFooter locale="de" />);

    expect(screen.getByRole("link", { name: "Impressum" })).toHaveAttribute(
      "href",
      "/de/imprint",
    );
    expect(screen.getByRole("link", { name: "Datenschutz" })).toHaveAttribute(
      "href",
      "/de/privacy",
    );
  });

  it("includes localized legal routes in the sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain("https://fallingforfame.vercel.app/en/imprint");
    expect(urls).toContain("https://fallingforfame.vercel.app/de/imprint");
    expect(urls).toContain("https://fallingforfame.vercel.app/en/privacy");
    expect(urls).toContain("https://fallingforfame.vercel.app/de/privacy");
    expect(urls).not.toContain("https://fallingforfame.vercel.app/de/impressum");
    expect(urls).not.toContain("https://fallingforfame.vercel.app/en/impressum");
  });
});
