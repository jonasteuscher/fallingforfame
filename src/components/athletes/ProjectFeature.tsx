"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import type { Locale } from "@/i18n/config";
import {
  clearActiveVideo,
  registerVideoPlayer,
  requestVideoPlayback,
} from "@/lib/videoPlaybackManager";
import type {
  AthleteCurrentProject,
  AthleteFutureProject,
  LocalizedText,
  ProjectStatus,
} from "@/types/athlete";

import { SectionTitle } from "./SectionTitle";

export const projectStatusLabels: Record<ProjectStatus, LocalizedText> = {
  current: {
    en: "Current Project",
    de: "Aktuelles Projekt",
  },
  future: {
    en: "Future Project",
    de: "Zukünftiges Projekt",
  },
  completed: {
    en: "Completed Project",
    de: "Abgeschlossenes Projekt",
  },
};

type ProjectFeatureProps = {
  athleteName: string;
  project?: AthleteCurrentProject | AthleteFutureProject;
  status: ProjectStatus;
  locale: Locale;
};

export function ProjectFeature({
  athleteName,
  project,
  status,
  locale,
}: ProjectFeatureProps) {
  const headingId = useId();

  if (!project) {
    return null;
  }

  const isCurrentProject = "intro" in project;
  const description = isCurrentProject ? project.intro : project.description;
  const displayTitle =
    typeof project.displayTitle === "string"
      ? project.displayTitle
      : project.displayTitle[locale];
  const links = isCurrentProject
    ? project.cta
      ? [{ href: project.cta.href, label: project.cta.label, external: false }]
      : []
    : (project.links ?? []).map((link) => ({
        href: link.url,
        label: link.label,
        external: true,
      }));

  return (
    <section
      aria-labelledby={headingId}
      data-project-feature-status={status}
      data-future-project-feature={status === "future" ? "" : undefined}
      data-current-project-section={
        isCurrentProject && status === "current" ? project.id : undefined
      }
      className="overflow-x-clip border-t border-border bg-background px-4 py-[var(--section-gap-immersive)] sm:px-6 xl:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <header className="max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary motion-safe:animate-[fade-in-up_700ms_ease-out_forwards] motion-safe:translate-y-4 motion-safe:opacity-0">
            {projectStatusLabels[status][locale]}
          </p>
          <SectionTitle id={headingId} size="project">
            {displayTitle}
          </SectionTitle>
          {description ? (
            <p className="mt-8 max-w-3xl text-lg leading-8 text-foreground/74 motion-safe:animate-[fade-in-up_700ms_ease-out_200ms_forwards] motion-safe:translate-y-4 motion-safe:opacity-0 sm:text-xl sm:leading-9">
              {description[locale]}
            </p>
          ) : null}
          {links.length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-3 motion-safe:animate-[fade-in-up_700ms_ease-out_260ms_forwards] motion-safe:translate-y-4 motion-safe:opacity-0">
              {links.map((link) =>
                link.external ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center border border-primary bg-primary px-5 text-sm font-semibold uppercase tracking-[0.18em] text-background transition hover:bg-transparent hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                  >
                    {link.label[locale]}
                    <span className="ml-3" aria-hidden="true">
                      ↗
                    </span>
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    className="inline-flex min-h-12 items-center border border-primary bg-primary px-5 text-sm font-semibold uppercase tracking-[0.18em] text-background transition hover:bg-transparent hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
                  >
                    {link.label[locale]}
                  </a>
                ),
              )}
            </div>
          ) : null}
        </header>

        {isCurrentProject ? (
          <CurrentProjectBody project={project} locale={locale} />
        ) : null}

        <ProjectVideo
          athleteName={athleteName}
          project={project}
          status={status}
          locale={locale}
        />

        {isCurrentProject ? (
          <p className="ml-auto mt-12 max-w-2xl text-xl font-semibold leading-8 text-foreground sm:text-3xl sm:leading-tight">
            {project.closing[locale]}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function CurrentProjectBody({
  project,
  locale,
}: {
  project: AthleteCurrentProject;
  locale: Locale;
}) {
  const firstImage = project.images[0];
  const secondImage = project.images[1];

  return (
    <>
      {firstImage ? (
        <ProjectImage
          image={firstImage}
          locale={locale}
          className="mt-14 sm:mt-20 lg:-mr-16"
          imageClassName="aspect-[16/10] sm:aspect-[16/9]"
          sizes="(min-width: 1280px) 1280px, 100vw"
        />
      ) : null}

      <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-[minmax(0,0.82fr)_minmax(18rem,0.46fr)] lg:items-start">
        <ProjectText
          title={project.passages[0]?.title?.[locale]}
          body={project.passages[0]?.body[locale]}
        />
        {secondImage ? (
          <ProjectImage
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
        <ProjectText
          title={project.passages[1]?.title?.[locale]}
          body={project.passages[1]?.body[locale]}
        />
      </div>
    </>
  );
}

function ProjectImage({
  image,
  locale,
  className,
  imageClassName,
  sizes,
}: {
  image: AthleteCurrentProject["images"][number];
  locale: Locale;
  className?: string;
  imageClassName: string;
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
        sizes={sizes}
        className={[
          "w-full bg-surface object-cover shadow-[0_30px_90px_color-mix(in_srgb,var(--background)_74%,black)]",
          imageClassName,
        ].join(" ")}
      />
    </figure>
  );
}

function ProjectText({ title, body }: { title?: string; body?: string }) {
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
      <p
        className={
          title
            ? "mt-6 text-lg leading-8 text-foreground/74"
            : "text-lg leading-8 text-foreground/74"
        }
      >
        {body}
      </p>
    </article>
  );
}

function ProjectVideo({
  athleteName,
  project,
  status,
  locale,
}: {
  athleteName: string;
  project: AthleteCurrentProject | AthleteFutureProject;
  status: ProjectStatus;
  locale: Locale;
}) {
  const figureRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoId = useId();
  const [sourceEnabled, setSourceEnabled] = useState(false);
  let videoLabel: string;
  let videoType = "video/mp4";
  let videoCaption: string | undefined;

  if ("intro" in project) {
    videoLabel = project.video.label[locale];
    videoType = project.video.type;
  } else {
    videoLabel = `${athleteName} — ${projectStatusLabels[status][locale]}: ${project.title[locale]}`;
    videoCaption = project.video.caption?.[locale];
  }

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
          aria-label={videoLabel}
          title={videoLabel}
          onPlay={() => requestVideoPlayback(videoId)}
          onPause={() => clearActiveVideo(videoId)}
          onEnded={() => clearActiveVideo(videoId)}
          className="h-full w-full bg-black object-cover"
        >
          {sourceEnabled ? <source src={project.video.src} type={videoType} /> : null}
        </video>
      </div>
      {videoCaption ? (
        <figcaption className="mt-3 text-sm leading-6 text-foreground/65">
          {videoCaption}
        </figcaption>
      ) : null}
    </figure>
  );
}
