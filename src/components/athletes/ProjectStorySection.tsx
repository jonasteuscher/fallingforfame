"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

import type { Locale } from "@/i18n/config";
import {
  clearActiveVideo,
  registerVideoPlayer,
  requestVideoPlayback,
} from "@/lib/videoPlaybackManager";
import type { AthleteCurrentProject } from "@/types/athlete";

type ProjectStorySectionProps = {
  project?: AthleteCurrentProject;
  locale: Locale;
};

export function ProjectStorySection({
  project,
  locale,
}: ProjectStorySectionProps) {
  if (!project) {
    return null;
  }

  return <ProjectStory project={project} locale={locale} />;
}

function ProjectStory({
  project,
  locale,
}: {
  project: AthleteCurrentProject;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingId = useId();
  const firstImage = project.images[0];
  const secondImage = project.images[1];

  return (
    <section
      ref={sectionRef}
      aria-labelledby={headingId}
      data-current-project-section={project.id}
      className="overflow-x-clip border-t border-border bg-background px-4 py-20 sm:px-6 sm:py-28 xl:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <header className="max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary motion-safe:animate-[fade-in-up_700ms_ease-out_forwards] motion-safe:translate-y-4 motion-safe:opacity-0">
            {project.chapter[locale]}
          </p>
          <h2
            id={headingId}
            className="mt-5 max-w-6xl whitespace-pre-line break-words text-[clamp(3.5rem,10vw,9rem)] font-semibold uppercase leading-[0.86] text-foreground [overflow-wrap:anywhere] motion-safe:animate-[fade-in-up_700ms_ease-out_100ms_forwards] motion-safe:translate-y-4 motion-safe:opacity-0"
          >
            {project.displayTitle}
          </h2>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-foreground/74 motion-safe:animate-[fade-in-up_700ms_ease-out_200ms_forwards] motion-safe:translate-y-4 motion-safe:opacity-0 sm:text-xl sm:leading-9">
            {project.intro[locale]}
          </p>
        </header>

        {firstImage ? (
          <ProjectStoryImage
            image={firstImage}
            locale={locale}
            priority={false}
            className="mt-14 sm:mt-20 lg:-mr-16"
            imageClassName="aspect-[16/10] sm:aspect-[16/9]"
            sizes="(min-width: 1280px) 1280px, 100vw"
          />
        ) : null}

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-[minmax(0,0.82fr)_minmax(18rem,0.46fr)] lg:items-start">
          <ProjectStoryText
            title={project.passages[0]?.title?.[locale]}
            body={project.passages[0]?.body[locale]}
          />
          {secondImage ? (
            <ProjectStoryImage
              image={secondImage}
              locale={locale}
              className="lg:mt-20 lg:-mr-10"
              imageClassName="aspect-[4/5]"
              sizes="(min-width: 1024px) 420px, 100vw"
            />
          ) : null}
        </div>

        <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-[minmax(12rem,0.34fr)_minmax(0,0.86fr)] lg:items-end">
          <p className="max-w-sm text-3xl font-semibold uppercase leading-none text-primary sm:text-5xl">
            {project.statement[locale]}
          </p>
          <ProjectStoryText
            title={project.passages[1]?.title?.[locale]}
            body={project.passages[1]?.body[locale]}
          />
        </div>

        <ProjectStoryVideo project={project} locale={locale} />

        <p className="ml-auto mt-12 max-w-2xl text-xl font-semibold leading-8 text-foreground sm:text-3xl sm:leading-tight">
          {project.closing[locale]}
        </p>
        {project.cta ? (
          <div className="mt-8 flex justify-end">
            <a
              href={project.cta.href}
              className="inline-flex min-h-12 items-center border border-primary bg-primary px-5 text-sm font-semibold uppercase tracking-[0.18em] text-background transition hover:bg-transparent hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
            >
              {project.cta.label[locale]}
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ProjectStoryImage({
  image,
  locale,
  className,
  imageClassName,
  priority,
  sizes,
}: {
  image: AthleteCurrentProject["images"][number];
  locale: Locale;
  className?: string;
  imageClassName: string;
  priority?: boolean;
  sizes: string;
}) {
  return (
    <figure
      className={[
        "motion-safe:animate-[fade-in-up_700ms_ease-out_forwards] motion-safe:translate-y-4 motion-safe:opacity-0",
        className ?? "",
      ].join(" ")}
    >
      <Image
        src={image.src}
        alt={image.alt[locale]}
        width={1600}
        height={1000}
        priority={priority}
        sizes={sizes}
        className={[
          "w-full bg-surface object-cover shadow-[0_30px_90px_color-mix(in_srgb,var(--background)_74%,black)]",
          imageClassName,
        ].join(" ")}
      />
    </figure>
  );
}

function ProjectStoryText({
  title,
  body,
}: {
  title?: string;
  body?: string;
}) {
  if (!body) {
    return null;
  }

  return (
    <article className="max-w-2xl motion-safe:animate-[fade-in-up_700ms_ease-out_forwards] motion-safe:translate-y-4 motion-safe:opacity-0">
      {title ? (
        <h3 className="text-3xl font-semibold leading-tight text-foreground sm:text-5xl">
          {title}
        </h3>
      ) : null}
      <p className={title ? "mt-6 text-lg leading-8 text-foreground/74" : "text-lg leading-8 text-foreground/74"}>
        {body}
      </p>
    </article>
  );
}

function ProjectStoryVideo({
  project,
  locale,
}: {
  project: AthleteCurrentProject;
  locale: Locale;
}) {
  const figureRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoId = useId();
  const [sourceEnabled, setSourceEnabled] = useState(false);

  useEffect(() => {
    return registerVideoPlayer(videoId, () => {
      videoRef.current?.pause();
    });
  }, [videoId]);

  useEffect(() => {
    const node = figureRef.current;

    if (!node || typeof IntersectionObserver === "undefined") {
      const timeout = window.setTimeout(() => setSourceEnabled(true), 0);

      return () => window.clearTimeout(timeout);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSourceEnabled(true);
        }

        if (!entry?.isIntersecting || entry.intersectionRatio < 0.28) {
          videoRef.current?.pause();
        }
      },
      { rootMargin: "500px 0px", threshold: [0, 0.28, 0.7] },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <figure
      ref={figureRef}
      className="mt-16 motion-safe:animate-[fade-in-up_700ms_ease-out_forwards] motion-safe:translate-y-4 motion-safe:opacity-0 lg:mt-24"
    >
      <div className="aspect-video w-full overflow-hidden bg-black shadow-[0_28px_90px_color-mix(in_srgb,var(--background)_78%,black)]">
        <video
          ref={videoRef}
          controls
          preload="metadata"
          playsInline
          poster={project.video.poster ?? undefined}
          aria-label={project.video.label[locale]}
          title={project.video.label[locale]}
          onPlay={() => requestVideoPlayback(videoId)}
          onPause={() => clearActiveVideo(videoId)}
          onEnded={() => clearActiveVideo(videoId)}
          className="h-full w-full bg-black object-cover"
        >
          {sourceEnabled ? (
            <source src={project.video.src} type={project.video.type} />
          ) : null}
        </video>
      </div>
    </figure>
  );
}
