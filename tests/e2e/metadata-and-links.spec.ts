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

      await expect(page).toHaveTitle(/Falling for Fame\?/);
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
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        "content",
        "https://fallingforfame.com/og/og-image.jpg",
      );
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        "content",
        "summary_large_image",
      );
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
