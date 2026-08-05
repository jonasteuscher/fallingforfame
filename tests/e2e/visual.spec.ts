import { expect, test } from "@playwright/test";

import { athleteSlugs, preparePage, waitForStablePage } from "./fixtures";

const visualRoutes = [
  { name: "home", path: "/en" },
  { name: "sport", path: "/en/sport" },
  { name: "findings", path: "/en/findings" },
  { name: "project", path: "/en/project" },
  ...athleteSlugs.map((slug) => ({ name: `athlete-${slug}`, path: `/en/athletes/${slug}` })),
  { name: "imprint", path: "/en/imprint" },
  { name: "privacy", path: "/en/privacy" },
] as const;

const visualViewports = [
  { name: "iphone", width: 390, height: 844 },
  { name: "ipad", width: 768, height: 1024 },
  { name: "macbook", width: 1440, height: 900 },
  { name: "desktop", width: 1920, height: 1080 },
  { name: "ultrawide", width: 3440, height: 1440 },
] as const;

test.describe("visual baselines", () => {
  test.beforeEach(async ({ page }) => preparePage(page));

  for (const viewport of visualViewports) {
    for (const route of visualRoutes) {
      test(`${viewport.name}: ${route.name}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(route.path, { waitUntil: "domcontentloaded" });
        await waitForStablePage(page);
        await page.addStyleTag({
          content: `
            *, *::before, *::after {
              animation-duration: 0s !important;
              animation-delay: 0s !important;
              transition-duration: 0s !important;
              caret-color: transparent !important;
            }
          `,
        });
        await expect(page).toHaveScreenshot(`${viewport.name}-${route.name}.png`, {
          animations: "disabled",
          caret: "hide",
          maxDiffPixelRatio: 0.02,
        });
      });
    }
  }
});
