"use client";

import { useId } from "react";

import type { Locale } from "@/i18n/config";
import type { AthleteLocalVideoFeature } from "@/types/athlete";

import { CinematicVideoPlayer } from "./CinematicVideoPlayer";
import { SectionTitle } from "./SectionTitle";

type LocalVideoFeatureProps = {
  feature: AthleteLocalVideoFeature;
  locale: Locale;
};

export function LocalVideoFeature({ feature, locale }: LocalVideoFeatureProps) {
  const headingId = useId();
  const displayTitle = feature.displayTitle?.[locale] ?? feature.title[locale];
  const videoLabel = feature.video.label[locale];

  return (
    <section
      id={feature.id}
      aria-labelledby={headingId}
      data-local-video-feature-id={feature.id}
      className="overflow-x-clip border-t border-border px-4 py-[var(--section-gap-immersive)] sm:px-6 xl:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            {feature.chapter[locale]}
          </p>
          <SectionTitle id={headingId}>{displayTitle}</SectionTitle>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-foreground/72">
            {feature.intro[locale]}
          </p>
        </header>

        <figure className="mt-10 motion-safe:animate-[fade-in-up_700ms_ease-out_160ms_forwards] motion-safe:translate-y-4 motion-safe:opacity-0 sm:mt-12">
          <CinematicVideoPlayer
            src={feature.video.src}
            type={feature.video.type}
            poster={feature.video.poster}
            label={videoLabel}
            locale={locale}
            objectFit={feature.video.objectFit}
          />
          {feature.video.caption ? (
            <figcaption className="mt-3 text-sm leading-6 text-foreground/65">
              {feature.video.caption[locale]}
            </figcaption>
          ) : null}
        </figure>
      </div>
    </section>
  );
}
