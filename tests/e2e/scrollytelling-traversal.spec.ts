import { expect, test } from "@playwright/test";

import { athleteSlugs, preparePage, waitForStablePage } from "./fixtures";

const storytellingRoutes = [
  "/de/sport",
  "/de/findings",
  "/de/project",
  ...athleteSlugs.map((slug) => `/de/athletes/${slug}`),
] as const;

const traversalViewports = [
  { name: "iphone", width: 390, height: 844 },
  { name: "ipad-portrait", width: 768, height: 1024 },
  { name: "ipad-landscape", width: 1024, height: 768 },
  { name: "short-laptop", width: 1366, height: 768 },
  { name: "ultrawide", width: 3440, height: 1440 },
] as const;

test.describe("full scrollytelling traversal", () => {
  test.setTimeout(240_000);
  test.beforeEach(async ({ page }) => {
    await preparePage(page);
    await page.emulateMedia({ reducedMotion: "no-preference" });
  });

  for (const viewport of traversalViewports) {
    test(`${viewport.name}: all storytelling routes remain usable through the full scroll`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);

      for (const route of storytellingRoutes) {
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await waitForStablePage(page);

        const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
        const maxScroll = Math.max(0, pageHeight - viewport.height);
        const sampleCount = Math.min(72, Math.max(12, Math.ceil(pageHeight / viewport.height)));

        for (let sample = 0; sample <= sampleCount; sample += 1) {
          const y = Math.round((maxScroll * sample) / sampleCount);
          await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
          await page.waitForTimeout(16);

          const audit = await page.evaluate(() => {
            const viewportPadding = 2;
            const documentWidth = Math.max(
              document.documentElement.scrollWidth,
              document.body.scrollWidth,
            );
            const visibleBrokenImages = Array.from(document.images)
              .filter((image) => {
                const rect = image.getBoundingClientRect();
                return (
                  rect.bottom > 0 &&
                  rect.top < innerHeight &&
                  image.complete &&
                  image.naturalWidth === 0
                );
              })
              .map((image) => image.currentSrc || image.src);
            const outOfBoundsFixedContent = Array.from(
              document.querySelectorAll<HTMLElement>("header, nav, [class*='sticky'], [class*='fixed']"),
            )
              .filter((element) => {
                const style = getComputedStyle(element);
                const rect = element.getBoundingClientRect();
                const visible = rect.bottom > 0 && rect.top < innerHeight && rect.width > 2;
                const positioned = style.position === "fixed" || style.position === "sticky";

                return (
                  visible &&
                  positioned &&
                  (rect.left < -viewportPadding || rect.right > innerWidth + viewportPadding)
                );
              })
              .map((element) => element.getAttribute("aria-label") || element.className);
            const clippedVisibleControls = Array.from(
              document.querySelectorAll<HTMLElement>("button, nav a, footer a"),
            )
              .filter((element) => {
                const rect = element.getBoundingClientRect();
                if (rect.bottom <= 0 || rect.top >= innerHeight || rect.width < 2) {
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
              visibleBrokenImages,
              outOfBoundsFixedContent,
              clippedVisibleControls,
            };
          });

          expect(audit.documentWidth, `${route} overflow at y=${y}`).toBeLessThanOrEqual(
            audit.viewportWidth + 1,
          );
          expect(audit.visibleBrokenImages, `${route} broken image at y=${y}`).toEqual([]);
          expect(audit.outOfBoundsFixedContent, `${route} fixed content at y=${y}`).toEqual([]);
          expect(audit.clippedVisibleControls, `${route} clipped control at y=${y}`).toEqual([]);
        }
      }
    });
  }
});
