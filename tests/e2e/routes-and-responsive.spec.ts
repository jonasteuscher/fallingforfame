import { expect, test } from "@playwright/test";

import {
  allLocalizedRoutes,
  preparePage,
  targetViewports,
  waitForStablePage,
} from "./fixtures";

test.describe("public route and responsive regression audit", () => {
  test.setTimeout(240_000);
  test.beforeEach(async ({ page }) => preparePage(page));

  for (const viewport of targetViewports) {
    test(`${viewport.name}: all public routes render without overflow or broken visible media`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);

      for (const route of allLocalizedRoutes) {
        const response = await page.goto(route, { waitUntil: "domcontentloaded" });
        expect(response?.status(), `${route} should return a successful status`).toBeLessThan(400);
        await waitForStablePage(page);

        const audit = await page.evaluate(() => {
          const documentWidth = Math.max(
            document.documentElement.scrollWidth,
            document.body.scrollWidth,
          );
          const brokenVisibleImages = Array.from(document.images)
            .filter((image) => {
              const rect = image.getBoundingClientRect();
              return rect.top < innerHeight * 1.5 && image.complete && image.naturalWidth === 0;
            })
            .map((image) => image.currentSrc || image.src);
          const clippedText = Array.from(
            document.querySelectorAll<HTMLElement>("h1, h2, h3, button, nav a, footer a"),
          )
            .filter((element) => {
              if (element.classList.contains("sr-only") || element.getBoundingClientRect().width < 2) {
                return false;
              }

              const style = getComputedStyle(element);
              return (
                style.overflowX === "hidden" &&
                element.scrollWidth > element.clientWidth + 2 &&
                style.textOverflow !== "ellipsis"
              );
            })
            .map((element) => element.textContent?.trim())
            .filter(Boolean);

          return {
            documentWidth,
            viewportWidth: innerWidth,
            brokenVisibleImages,
            clippedText,
            h1Count: document.querySelectorAll("h1").length,
          };
        });

        expect(
          audit.documentWidth,
          `${route} at ${viewport.name} has horizontal overflow`,
        ).toBeLessThanOrEqual(audit.viewportWidth + 1);
        expect(audit.brokenVisibleImages, `${route} has broken visible images`).toEqual([]);
        expect(audit.clippedText, `${route} has clipped headings or controls`).toEqual([]);
        expect(audit.h1Count, `${route} should contain one H1`).toBe(1);
      }
    });
  }

  test("localized 404 route renders recovery navigation", async ({ page }) => {
    const response = await page.goto("/de/diese-seite-existiert-nicht");
    expect(response?.status()).toBe(404);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("link").first()).toBeVisible();
  });
});
