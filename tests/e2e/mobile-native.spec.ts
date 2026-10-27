import { expect, test } from "@playwright/test";

import { preparePage, waitForStablePage } from "./fixtures";

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });
test.beforeEach(async ({ page }) => preparePage(page));

test("first-time phone visitors enter the story directly with zoom enabled", async ({
  page,
}) => {
  await page.goto("/en");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await waitForStablePage(page);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const viewport = await page.locator('meta[name="viewport"]').getAttribute("content");
  expect(viewport).toContain("viewport-fit=cover");
  expect(viewport).toContain("interactive-widget=resizes-content");
  expect(viewport).not.toMatch(/user-scalable=no|maximum-scale=1/);
  await expect(page.locator('meta[name="theme-color"]')).toHaveCount(2);
  await expect(page.locator("html")).toHaveCSS(
    "-webkit-tap-highlight-color",
    "rgba(0, 0, 0, 0)",
  );
  await expect(page.locator(".site-header button")).toHaveCSS(
    "-webkit-tap-highlight-color",
    "rgba(0, 0, 0, 0)",
  );
  await expect(page.locator("main p").first()).toHaveCSS("user-select", "auto");
});

test("menu keeps the current reading position through opening and rotation", async ({
  page,
}) => {
  await page.goto("/de/findings");
  await waitForStablePage(page);
  await page.evaluate(() => scrollTo({ top: 700, behavior: "instant" }));
  const scrollY = await page.evaluate(() => window.scrollY);
  await page.locator(".site-header button").tap();
  await expect(page.locator("body")).toHaveCSS("position", "fixed");
  await page.setViewportSize({ width: 844, height: 390 });
  const dialog = page.getByRole("dialog");
  const language = dialog.getByRole("link", { name: "EN", exact: true });
  await language.scrollIntoViewIfNeeded();
  await expect(language).toBeInViewport();
  await dialog.getByRole("button").tap();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("position", "fixed");
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(scrollY);
});

test("safe-area spacing reaches headers, chapter bars and the safety dialog", async ({
  page,
}) => {
  await page.goto("/en/findings");
  await waitForStablePage(page);
  // Simulate non-zero insets to verify propagation; real cutouts need hardware.
  await page.addStyleTag({
    content:
      ":root { --safe-area-top: 44px; --safe-area-bottom: 34px; --safe-area-left: 20px; --safe-area-right: 20px; }",
  });
  await expect(page.locator(".site-header")).toHaveCSS("padding-top", "44px");
  await expect(page.locator("main")).toHaveCSS("padding-top", "100px");
  await expect(page.locator(".site-section-nav")).toHaveCSS("bottom", "46px");
  await page.evaluate(() => sessionStorage.removeItem("sport-safety-warning-accepted"));
  await page.locator(".site-header button").tap();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "About the Sport", exact: true })
    .tap();
  await expect(page).toHaveURL(/\/en\/sport$/);
  await expect(page.getByRole("dialog")).toBeVisible();
  const overlay = page.locator(".safe-area-overlay");
  await expect(overlay).toHaveCSS("padding-top", "44px");
  await expect(overlay).toHaveCSS("padding-bottom", "34px");
  const button = page.getByRole("dialog").getByRole("button");
  await button.scrollIntoViewIfNeeded();
  await expect(button).toBeInViewport();
});

test("sport cards snap in their actual horizontal scroll container", async ({
  page,
}) => {
  await page.goto("/en/sport");
  await waitForStablePage(page);
  const track = page.locator('[aria-labelledby="disciplines-title"] .overflow-x-auto');
  await expect(track).toHaveCSS("scroll-snap-type", "x mandatory");
  await track.evaluate((node) => node.scrollTo({ left: 350, behavior: "instant" }));
  await expect.poll(() => track.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBe(true);
});

test("touch controls keep vertical panning and mouse hover remains gated", async ({
  page,
}) => {
  await page.goto("/en/athletes/tim-howell");
  await waitForStablePage(page);
  const seek = page.getByRole("slider").first();
  await expect(seek).toHaveCSS("touch-action", "pan-y pinch-zoom");
  await expect(seek).toHaveCSS("user-select", "none");
  const styles = await page
    .locator('link[rel="stylesheet"]')
    .evaluateAll(async (links) =>
      (
        await Promise.all(
          links.map((link) =>
            fetch((link as HTMLLinkElement).href).then((r) => r.text()),
          ),
        )
      ).join("\n"),
    );
  expect(styles).toMatch(/@media[^{}]*\(hover:\s*hover\)[^{}]*\(pointer:\s*fine\)/);
  expect(styles).toContain("group-hover");
});

for (const route of ["/en/athletes/tim-howell", "/en/project"]) {
  test(`gallery uses available screen space and restores reading position: ${route}`, async ({
    page,
  }, testInfo) => {
    await page.goto(route);
    await waitForStablePage(page);
    const thumbnail = page
      .locator(
        route.includes("athletes")
          ? "[data-gallery-layout] button"
          : '[aria-labelledby="documentation-gallery-title"] button',
      )
      .first();
    await thumbnail.scrollIntoViewIfNeeded();
    const scrollY = await page.evaluate(() => window.scrollY);
    await thumbnail.tap();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(page.locator("body")).toHaveCSS("position", "fixed");
    for (const viewport of [
      { width: 390, height: 844 },
      { width: 844, height: 390 },
    ]) {
      await page.setViewportSize(viewport);
      const image = dialog.locator("img");
      await expect(image).toBeInViewport();
      await expect
        .poll(() =>
          image.evaluate(
            (node: HTMLImageElement) => node.complete && node.naturalWidth > 0,
          ),
        )
        .toBe(true);
      expect((await image.boundingBox())!.height).toBeGreaterThan(44);
      await page.screenshot({
        path: testInfo.outputPath(`gallery-${viewport.width}.png`),
      });
    }
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(scrollY);
  });
}
