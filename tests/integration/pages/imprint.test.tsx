import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import EnglishImprintPage, {
  generateMetadata as generateEnglishImprintMetadata,
} from "@/app/[locale]/imprint/page";
import GermanImprintPage, {
  generateMetadata as generateGermanImpressumMetadata,
} from "@/app/[locale]/impressum/page";
import sitemap from "@/app/sitemap";
import { SiteFooter } from "@/components/layout/SiteFooter";
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
    expect(screen.getByRole("heading", { name: "1797 - First Modern Parachute" })).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Source: 1797 - First Modern Parachute" }),
    ).toHaveAttribute(
      "href",
      "https://en.wikipedia.org/wiki/File:First_parachute2.jpg",
    );
    expect(screen.getByRole("heading", { name: "Risk Notice" })).toBeVisible();
    expect(document.querySelectorAll("h1")).toHaveLength(1);
  });

  it("renders the German legal notice at /de/impressum", async () => {
    await renderAsyncPage(
      GermanImprintPage({ params: Promise.resolve({ locale: "de" }) }),
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
      generateGermanImpressumMetadata({
        params: Promise.resolve({ locale: "de" }),
      }),
    ).resolves.toMatchObject({
      title: "Impressum | Falling for Fame?",
    });
  });

  it("adds one localized footer imprint link without primary navigation", () => {
    const { rerender } = render(<SiteFooter locale="en" />);

    expect(screen.getByRole("link", { name: "Imprint" })).toHaveAttribute(
      "href",
      "/en/imprint",
    );

    rerender(<SiteFooter locale="de" />);

    expect(screen.getByRole("link", { name: "Impressum" })).toHaveAttribute(
      "href",
      "/de/impressum",
    );
  });

  it("includes localized imprint routes in the sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain("https://fallingforfame.vercel.app/en/imprint");
    expect(urls).toContain("https://fallingforfame.vercel.app/de/impressum");
    expect(urls).not.toContain("https://fallingforfame.vercel.app/de/imprint");
    expect(urls).not.toContain("https://fallingforfame.vercel.app/en/impressum");
  });
});
