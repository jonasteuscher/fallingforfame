import type { Page } from "@playwright/test";

export const athleteSlugs = [
  "tim-howell",
  "lukas-loibl",
  "marcel-geser",
  "niclas-strohmeier",
  "josef-braun",
] as const;

export const localizedRouteSuffixes = [
  "",
  "/sport",
  "/athletes",
  "/findings",
  "/project",
  "/imprint",
  "/privacy",
  ...athleteSlugs.map((slug) => `/athletes/${slug}`),
] as const;

export const allLocalizedRoutes = (["en", "de"] as const).flatMap((locale) =>
  localizedRouteSuffixes.map((suffix) => `/${locale}${suffix}`),
);

export const targetViewports = [
  { name: "iphone-390x844", width: 390, height: 844 },
  { name: "iphone-393x852", width: 393, height: 852 },
  { name: "iphone-430x932", width: 430, height: 932 },
  { name: "ipad-portrait-768x1024", width: 768, height: 1024 },
  { name: "ipad-air-portrait-820x1180", width: 820, height: 1180 },
  { name: "ipad-pro-portrait-1024x1366", width: 1024, height: 1366 },
  { name: "ipad-landscape-1024x768", width: 1024, height: 768 },
  { name: "laptop-1280x720", width: 1280, height: 720 },
  { name: "laptop-1280x800", width: 1280, height: 800 },
  { name: "laptop-1366x768", width: 1366, height: 768 },
  { name: "laptop-1440x900", width: 1440, height: 900 },
  { name: "laptop-1512x982", width: 1512, height: 982 },
  { name: "desktop-1920x1080", width: 1920, height: 1080 },
  { name: "desktop-2560x1440", width: 2560, height: 1440 },
  { name: "ultrawide-2560x1080", width: 2560, height: 1080 },
  { name: "ultrawide-3440x1440", width: 3440, height: 1440 },
] as const;

export async function preparePage(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    localStorage.setItem("falling-for-fame-mobile-notice-dismissed", "true");
    sessionStorage.setItem("sport-safety-warning-accepted", "true");
  });
}

export async function waitForStablePage(page: Page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("load");
  await page.locator("body").waitFor({ state: "visible" });
  await page.waitForFunction(() => document.fonts.status === "loaded");
  await page.evaluate(async () => {
    const nearbyImages = Array.from(document.images).filter(
      (image) => image.getBoundingClientRect().top < innerHeight * 1.5,
    );
    await Promise.race([
      Promise.all(nearbyImages.map((image) => image.decode().catch(() => undefined))),
      new Promise((resolve) => window.setTimeout(resolve, 2_000)),
    ]);
  });
  await page.waitForTimeout(300);
}
