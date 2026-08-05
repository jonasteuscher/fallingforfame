import { expect, test } from "@playwright/test";

import { allLocalizedRoutes, preparePage, waitForStablePage } from "./fixtures";

test.describe("metadata and public links", () => {
  test.beforeEach(async ({ page }) => preparePage(page));

  for (const route of allLocalizedRoutes) {
    test(`${route}: exposes localized canonical and social metadata`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await waitForStablePage(page);

      const expectedCanonical = `https://fallingforfame.com${route}`;
      const suffix = route.replace(/^\/(en|de)/, "");
      const expectedLocale = route.startsWith("/de") ? "de" : "en";
      const title = await page.title();
      const siteNameOccurrences = title.split("Falling for Fame?").length - 1;

      expect(siteNameOccurrences, `${route} should contain the site name once`).toBe(1);
      expect(title).not.toContain("| Falling for Fame? |");
      await expect(page.locator("html")).toHaveAttribute("lang", expectedLocale);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        /\S/,
      );
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        expectedCanonical,
      );
      await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
        "href",
        `https://fallingforfame.com/en${suffix}`,
      );
      await expect(page.locator('link[rel="alternate"][hreflang="de"]')).toHaveAttribute(
        "href",
        `https://fallingforfame.com/de${suffix}`,
      );
      await expect(
        page.locator('link[rel="alternate"][hreflang="x-default"]'),
      ).toHaveAttribute("href", `https://fallingforfame.com/en${suffix}`);
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
        "content",
        title,
      );
      await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
        "content",
        /\S/,
      );
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
        "content",
        expectedCanonical,
      );
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        "content",
        "https://fallingforfame.com/og/og-image.jpg",
      );
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        "content",
        "summary_large_image",
      );
      await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
        "content",
        title,
      );

      const metadataUrls = await page
        .locator('link[rel="canonical"], link[rel="alternate"], meta[property="og:url"], meta[property="og:image"], meta[name="twitter:image"]')
        .evaluateAll((elements) =>
          elements.map(
            (element) =>
              element.getAttribute("href") ?? element.getAttribute("content") ?? "",
          ),
        );
      expect(metadataUrls.join("\n")).not.toMatch(/localhost|vercel\.app/i);
    });
  }

  test("internal document and footer links resolve", async ({ page, request }) => {
    await page.goto("/en/project");
    await waitForStablePage(page);

    const internalLinks = await page.locator('a[href^="/"]').evaluateAll((links) =>
      Array.from(new Set(links.map((link) => (link as HTMLAnchorElement).getAttribute("href"))))
        .filter((href): href is string => Boolean(href))
        .filter((href) => !href.startsWith("/#")),
    );

    for (const href of internalLinks) {
      const response = await request.get(href.split("#")[0]);
      expect(response.status(), `${href} should resolve`).toBeLessThan(400);
    }

    const thesis = await request.get(
      "/document/thesis/Thesis_Zwischen_Sichtbarkeit_und_Sicherheit.pdf",
    );
    expect(thesis.ok()).toBe(true);
    expect(thesis.headers()["content-type"]).toContain("application/pdf");
  });
});
