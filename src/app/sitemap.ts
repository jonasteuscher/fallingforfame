import type { MetadataRoute } from "next";

import { athletes } from "@/data/athletes";
import { locales } from "@/i18n/config";
import { localizedPath } from "@/i18n/navigation";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fallingforfame.vercel.app";

const staticPaths = ["", "/sport", "/athletes", "/project", "/findings"];

export default function sitemap(): MetadataRoute.Sitemap {
  const localizedStaticRoutes = locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: absoluteUrl(localizedPath(locale, path)),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
  );

  const athleteRoutes = locales.flatMap((locale) =>
    athletes.map((athlete) => ({
      url: absoluteUrl(localizedPath(locale, `/athletes/${athlete.slug}`)),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  );

  return [...localizedStaticRoutes, ...athleteRoutes];
}

function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}
