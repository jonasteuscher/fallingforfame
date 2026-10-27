import { expect, test } from "@playwright/test";

import { preparePage, waitForStablePage } from "./fixtures";

test.beforeEach(async ({ page }) => preparePage(page));

test("touch-down gives feedback and dragging away cancels menu activation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  await waitForStablePage(page);
  const trigger = page.getByRole("button", { name: "Open navigation menu" });
  const box = await trigger.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.mouse.down();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect
    .poll(() => trigger.evaluate((node) => getComputedStyle(node).filter))
    .not.toBe("none");
  await page.mouse.move(10, 300);
  await page.mouse.up();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("resizing an open mobile menu restores desktop scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  await waitForStablePage(page);
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("floating chrome respects contrast and transparency preferences independently", async ({
  page,
}) => {
  await page.goto("/en");
  const header = page.locator("header").first();
  const session = await page.context().newCDPSession(page);
  for (const feature of ["prefers-reduced-transparency", "prefers-contrast"]) {
    await session.send("Emulation.setEmulatedMedia", {
      features: [
        { name: feature, value: feature === "prefers-contrast" ? "more" : "reduce" },
      ],
    });
    await expect(header).toHaveCSS("backdrop-filter", "none");
    await expect(header).toHaveCSS("background-color", "rgb(10, 26, 47)");
  }
});

test("reduced-motion findings start with readable content and no empty scroll track", async ({
  page,
}) => {
  await page.goto("/en/findings");
  await waitForStablePage(page);
  const hero = page.locator("#findings-hero");
  await expect(hero.locator("h1")).toBeVisible();
  await expect(hero.locator("h1")).toHaveCSS("opacity", "1");
  const box = await hero.boundingBox();
  expect(box!.height).toBeLessThanOrEqual(1000);
});

test("navigation and page content remain reachable with larger text", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/de/athletes/tim-howell");
  await waitForStablePage(page);
  await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  await page
    .getByRole("button", { name: /Navigationsmenü öffnen|Navigation öffnen/ })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const links = dialog.getByRole("link");
  for (const link of await links.all()) {
    await link.scrollIntoViewIfNeeded();
    await expect(link).toBeInViewport();
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
});
