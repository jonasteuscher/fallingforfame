import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { allLocalizedRoutes, preparePage, waitForStablePage } from "./fixtures";

test.describe("accessibility, navigation, galleries and media", () => {
  test.beforeEach(async ({ page }) => preparePage(page));

  for (const route of allLocalizedRoutes) {
    test(`${route}: has no serious automated accessibility violations`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await waitForStablePage(page);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      const seriousViolations = results.violations.filter(
        (violation) => violation.impact === "serious" || violation.impact === "critical",
      );

      expect(
        seriousViolations.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          targets: violation.nodes.map((node) => node.target.join(" ")),
        })),
      ).toEqual([]);
    });
  }

  test("mobile menu traps focus, closes with Escape and restores scrolling", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/en");
    await waitForStablePage(page);
    const menuButton = page.locator('button[aria-controls][aria-expanded]').first();
    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    await page.keyboard.press("Escape");
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await expect(menuButton).toBeFocused();
  });

  test("language switching retains the current route", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en/athletes/tim-howell");
    await waitForStablePage(page);
    await page.getByRole("link", { name: "DE", exact: true }).click();
    await expect(page).toHaveURL(/\/de\/athletes\/tim-howell$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
  });

  test("athlete lightbox supports keyboard navigation, scroll lock and focus restoration", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 430, height: 932 });
    await page.goto("/en/athletes/tim-howell");
    await waitForStablePage(page);
    const gallery = page.locator("#gallery");
    await gallery.scrollIntoViewIfNeeded();
    const firstThumbnail = gallery.getByRole("button", { name: /open image full size/i }).first();
    await firstThumbnail.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    await page.keyboard.press("ArrowRight");
    await expect(dialog.getByText(/Image 2 of/i)).toBeVisible();
    await expect(dialog.locator("img")).toHaveCSS("object-fit", "contain");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(firstThumbnail).toBeFocused();
  });

  test("project thesis actions expose open and download behavior", async ({ page }) => {
    await page.goto("/en/project");
    await waitForStablePage(page);
    const openLink = page.getByRole("link", { name: /open thesis/i });
    const downloadLink = page.getByRole("link", { name: /download thesis/i });
    await expect(openLink).toHaveAttribute(
      "href",
      "/document/thesis/Thesis_Zwischen_Sichtbarkeit_und_Sicherheit.pdf",
    );
    await expect(openLink).toHaveAttribute("target", "_blank");
    await expect(downloadLink).toHaveAttribute("download", "");
  });

  test("local cinematic videos coordinate playback", async ({ page }) => {
    await page.goto("/en/athletes/josef-braun");
    await waitForStablePage(page);
    const videos = page.locator("video");
    await expect(videos).toHaveCount(2);
    await videos.nth(0).scrollIntoViewIfNeeded();
    await videos.nth(0).locator("..").getByRole("button", { name: /^Play / }).click();
    await expect
      .poll(() => videos.nth(0).evaluate((video) => !(video as HTMLVideoElement).paused))
      .toBe(true);
    await videos.nth(1).scrollIntoViewIfNeeded();
    await videos.nth(1).locator("..").getByRole("button", { name: /^Play / }).click();
    await expect
      .poll(() => videos.nth(0).evaluate((video) => (video as HTMLVideoElement).paused))
      .toBe(true);
  });
});
