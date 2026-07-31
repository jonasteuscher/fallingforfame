import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import GlobalNotFound, { metadata as globalNotFoundMetadata } from "@/app/not-found";
import sitemap from "@/app/sitemap";
import LocaleNotFound, {
  metadata as localeNotFoundMetadata,
} from "@/app/[locale]/not-found";
import { renderAsyncPage } from "../../test-utils/render-pages";
import { resetMockPathname, setMockPathname } from "../../test-utils/next-navigation";

describe("not found page", () => {
  afterEach(() => {
    resetMockPathname();
  });

  it("renders the custom English 404 page for unknown English routes", async () => {
    setMockPathname("/en/does-not-exist");

    await renderAsyncPage(Promise.resolve(LocaleNotFound()));

    expect(screen.getByText("404 · Page not found")).toBeVisible();
    expect(
      screen.getByRole("heading", {
        name: "This page has taken a different path",
        level: 1,
      }),
    ).toBeVisible();
    expect(
      screen.getByText(
        "The page you are looking for does not exist, has been moved or is no longer available.",
      ),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute(
      "href",
      "/en",
    );
    expect(document.querySelectorAll("h1")).toHaveLength(1);
  });

  it("renders the custom German 404 page for unknown German routes", async () => {
    setMockPathname("/de/nicht-vorhanden");

    await renderAsyncPage(Promise.resolve(LocaleNotFound()));

    expect(screen.getByText("404 · Seite nicht gefunden")).toBeVisible();
    expect(
      screen.getByRole("heading", {
        name: "Diese Seite ist einen anderen Weg gegangen",
        level: 1,
      }),
    ).toBeVisible();
    expect(
      screen.getByText(
        "Die gesuchte Seite existiert nicht, wurde verschoben oder ist nicht mehr verfügbar.",
      ),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Zur Startseite" })).toHaveAttribute(
      "href",
      "/de",
    );
    expect(document.querySelectorAll("h1")).toHaveLength(1);
  });

  it("uses the English fallback for global unknown routes without a locale", async () => {
    setMockPathname("/does-not-exist");

    render(<>{GlobalNotFound()}</>);

    expect(
      screen.getByRole("heading", {
        name: "This page has taken a different path",
        level: 1,
      }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute(
      "href",
      "/en",
    );
  });

  it("marks not found metadata as noindex and nofollow", () => {
    expect(localeNotFoundMetadata).toMatchObject({
      robots: {
        index: false,
        follow: false,
      },
    });
    expect(globalNotFoundMetadata).toMatchObject({
      robots: {
        index: false,
        follow: false,
      },
    });
  });

  it("does not include not found routes in the sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain("https://fallingforfame.vercel.app/en");
    expect(urls).toContain("https://fallingforfame.vercel.app/de");
    expect(urls).toContain("https://fallingforfame.vercel.app/en/athletes/tim-howell");
    expect(urls).not.toContain("https://fallingforfame.vercel.app/en/404");
    expect(urls).not.toContain("https://fallingforfame.vercel.app/en/does-not-exist");
    expect(urls).not.toContain("https://fallingforfame.vercel.app/de/nicht-vorhanden");
  });
});
