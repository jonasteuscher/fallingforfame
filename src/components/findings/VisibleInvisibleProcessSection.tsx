"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { interpolate } from "@/components/findings/mediaVisibilitySequence";
import type { FindingChapter } from "@/types/findings";

type VisibleInvisibleProcessSectionProps = {
  chapter: FindingChapter;
  sourcePrefix: string;
  empiricalLabel: string;
  interpretationLabel: string;
};

const PROCESS_IMAGE_SRC = "/images/findings/Results-2.jpg";

export function VisibleInvisibleProcessSection({
  chapter,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
}: VisibleInvisibleProcessSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const motionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");

    if (!motionQuery) {
      return;
    }

    function updateReducedMotion() {
      setReducedMotion(motionQuery.matches);
    }

    updateReducedMotion();
    motionQuery.addEventListener("change", updateReducedMotion);

    return () => {
      motionQuery.removeEventListener("change", updateReducedMotion);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || reducedMotion) {
      return;
    }

    let frame = 0;

    function updateProgress() {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      frame = window.requestAnimationFrame(() => {
        const section = sectionRef.current;

        if (!section) {
          return;
        }

        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        const scrubDistance = section.offsetHeight - window.innerHeight;
        const nextProgress =
          scrubDistance <= 0 ? 1 : (window.scrollY - sectionTop) / scrubDistance;

        setProgress(Math.min(Math.max(nextProgress, 0), 1));
      });
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [reducedMotion]);

  const processItems = useMemo(
    () => chapter.right?.items ?? [],
    [chapter.right?.items],
  );

  if (reducedMotion) {
    return (
      <ReducedMotionVisibleInvisible
        chapter={chapter}
        processItems={processItems}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
      />
    );
  }

  return (
    <section
      id={chapter.id}
      ref={sectionRef}
      aria-labelledby={`${chapter.id}-title`}
      className="relative scroll-mt-24 border-t border-border"
    >
      <p className="sr-only">{chapter.accessibleSummary}</p>
      <MobileVisibleInvisible
        chapter={chapter}
        processItems={processItems}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
      />

      <div className="hidden md:block md:h-[390svh] md:min-h-[2500px]">
        <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden bg-background">
          <div className="mx-auto flex h-full max-w-7xl flex-col px-6 py-10 xl:px-10">
            <header
              className="relative z-20"
              style={{
                opacity: interpolate(progress, 0, 0.08, 1, 0.92),
                transform: `translate3d(0, ${interpolate(progress, 0, 0.18, 0, -8)}px, 0)`,
              }}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                {chapter.eyebrow}
              </p>
              <h2
                id={`${chapter.id}-title`}
                className="mt-4 max-w-[72rem] text-[clamp(3rem,5.8vw,7.3rem)] font-semibold uppercase leading-[0.9] text-foreground [text-wrap:balance]"
              >
                {chapter.title}
              </h2>
              <p className="mt-6 max-w-[42rem] text-lg leading-8 text-foreground/76">
                {chapter.summary}
              </p>
            </header>

            <div className="relative mt-8 min-h-0 flex-1">
              <DocumentaryVisibleFrame chapter={chapter} progress={progress} />
              <InvisibleProcessLayer
                chapter={chapter}
                processItems={processItems}
                progress={progress}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 hidden px-6 pb-[var(--section-gap-standard)] md:block xl:px-10">
        <ProcessFindingSummaryStatic
          chapter={chapter}
          sourcePrefix={sourcePrefix}
          empiricalLabel={empiricalLabel}
          interpretationLabel={interpretationLabel}
          className="mx-auto max-w-5xl"
          showFinding={false}
        />
      </div>
    </section>
  );
}

function DocumentaryVisibleFrame({
  chapter,
  progress,
}: {
  chapter: FindingChapter;
  progress: number;
}) {
  const revealInvisible = interpolate(progress, 0.22, 0.82, 0, 1);
  const visibleScale = interpolate(progress, 0.1, 0.9, 1.04, 1);
  const imageContrast = interpolate(progress, 0.2, 0.72, 1.08, 0.9);
  const imageBrightness = interpolate(progress, 0.2, 0.72, 1, 0.78);

  return (
    <figure
      className="absolute bottom-0 left-0 top-0 w-[78%] max-w-[62rem] overflow-hidden bg-surface shadow-[0_34px_110px_color-mix(in_srgb,var(--background)_78%,black)]"
      style={{
        transform: `translate3d(0, 0, 0) scale(${interpolate(progress, 0.75, 1, 1, 0.98)})`,
      }}
      aria-labelledby={`${chapter.id}-visible-label`}
    >
      <Image
        src={PROCESS_IMAGE_SRC}
        alt=""
        fill
        sizes="(max-width: 1024px) 76vw, 62rem"
        className="object-cover"
        style={{
          objectPosition: "58% 34%",
          transform: `scale(${visibleScale})`,
          filter: `contrast(${imageContrast}) brightness(${imageBrightness})`,
        }}
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_72%_26%,transparent_0%,transparent_24%,color-mix(in_srgb,var(--background)_24%,transparent)_56%,color-mix(in_srgb,var(--background)_58%,transparent)_100%)]"
        style={{ opacity: interpolate(progress, 0.18, 0.52, 0.08, 0.62) }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,transparent_48%,color-mix(in_srgb,var(--background)_72%,transparent)_100%)]"
        style={{ opacity: revealInvisible }}
        aria-hidden="true"
      />
      <div className="absolute left-5 top-5 max-w-[26rem]">
        <p
          id={`${chapter.id}-visible-label`}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-primary"
        >
          {chapter.visibleLabel}
        </p>
        <p className="mt-3 max-w-[18rem] text-3xl font-semibold uppercase leading-none text-foreground [text-shadow:0_2px_28px_var(--background)]">
          {chapter.left?.title}
        </p>
      </div>
      <ul
        className="absolute bottom-5 left-5 flex max-w-[32rem] flex-wrap gap-2"
        style={{
          opacity: interpolate(progress, 0.24, 0.46, 1, 0.35),
          transform: `translate3d(0, ${interpolate(progress, 0.24, 0.46, 0, 10)}px, 0)`,
        }}
      >
        {chapter.left?.items.map((item) => (
          <li
            key={item}
            className="border border-foreground/28 bg-background/42 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/86 backdrop-blur-sm"
          >
            {item}
          </li>
        ))}
      </ul>
    </figure>
  );
}

function InvisibleProcessLayer({
  chapter,
  processItems,
  progress,
}: {
  chapter: FindingChapter;
  processItems: string[];
  progress: number;
}) {
  const layerOpacity = interpolate(progress, 0.24, 0.58, 0, 1);
  const clip = interpolate(progress, 0.24, 0.68, 100, 0);
  const isCompact = chapter.processDensity === "compact";

  return (
    <div
      className="absolute bottom-0 right-0 top-0 z-10 w-[48%] min-w-[28rem] bg-[linear-gradient(90deg,color-mix(in_srgb,var(--background)_0%,transparent),var(--background)_18%,var(--background)_100%)] pl-14 pt-6"
      style={{
        opacity: layerOpacity,
        clipPath: `inset(0 0 0 ${clip}%)`,
      }}
    >
      <div className="visible-process-content flex h-full flex-col justify-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          {chapter.invisibleLabel}
        </p>
        <p
          className={[
            "visible-process-title mt-3 max-w-[26rem] font-semibold uppercase leading-tight text-foreground",
            isCompact ? "text-[1.7rem]" : "text-3xl",
          ].join(" ")}
        >
          {chapter.right?.title}
        </p>
        <ol
          className={[
            "visible-process-list grid max-w-[34rem]",
            isCompact ? "mt-4 gap-1.5" : "mt-5 gap-2",
          ].join(" ")}
        >
          {processItems.map((item, index) => {
            const itemProgress = interpolate(
              progress,
              0.34 + index * 0.045,
              0.48 + index * 0.045,
              0,
              1,
            );

            return (
              <li
                key={item}
                className={[
                  "visible-process-item grid grid-cols-[2.5rem_1fr] border-l border-primary/40",
                  isCompact ? "gap-3 py-0.5" : "gap-4 py-1",
                ].join(" ")}
                style={{
                  opacity: itemProgress,
                  transform: `translate3d(${interpolate(itemProgress, 0, 1, 18, 0)}px, 0, 0)`,
                }}
              >
                <span className="pl-4 text-xs font-semibold text-primary/88">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={[
                    "font-semibold uppercase tracking-[0.08em] text-foreground/78",
                    isCompact ? "text-[0.95rem] leading-tight" : "text-base",
                  ].join(" ")}
                >
                  {item}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function MobileVisibleInvisible({
  chapter,
  processItems,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
}: {
  chapter: FindingChapter;
  processItems: string[];
  sourcePrefix: string;
  empiricalLabel: string;
  interpretationLabel: string;
}) {
  return (
    <div className="px-4 py-[var(--section-gap-standard)] sm:px-6 md:hidden">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
        {chapter.eyebrow}
      </p>
      <h2
        id={`${chapter.id}-mobile-title`}
        className="mt-4 text-[clamp(2.7rem,11vw,4.2rem)] font-semibold uppercase leading-[0.9] text-foreground [text-wrap:balance]"
      >
        {chapter.title}
      </h2>
      <p className="mt-6 text-lg leading-8 text-foreground/76">{chapter.summary}</p>
      <VisibleResultStatic chapter={chapter} className="mt-10" />
      <InvisibleProcessStatic
        chapter={chapter}
        processItems={processItems}
        className="mt-10"
      />
      <ProcessFindingSummaryStatic
        chapter={chapter}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
        className="mt-10"
        showFinding={false}
      />
    </div>
  );
}

function ReducedMotionVisibleInvisible({
  chapter,
  processItems,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
}: {
  chapter: FindingChapter;
  processItems: string[];
  sourcePrefix: string;
  empiricalLabel: string;
  interpretationLabel: string;
}) {
  return (
    <section
      id={chapter.id}
      aria-labelledby={`${chapter.id}-title`}
      className="scroll-mt-24 border-t border-border px-4 py-[var(--section-gap-standard)] sm:px-6 xl:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
          {chapter.eyebrow}
        </p>
        <h2
          id={`${chapter.id}-title`}
          className="mt-4 max-w-6xl text-[clamp(3rem,7vw,7rem)] font-semibold uppercase leading-[0.9] text-foreground [text-wrap:balance]"
        >
          {chapter.title}
        </h2>
        <p className="mt-6 max-w-reading text-lg leading-8 text-foreground/76">
          {chapter.summary}
        </p>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <VisibleResultStatic chapter={chapter} />
          <InvisibleProcessStatic chapter={chapter} processItems={processItems} />
        </div>
        <ProcessFindingSummaryStatic
          chapter={chapter}
          sourcePrefix={sourcePrefix}
          empiricalLabel={empiricalLabel}
          interpretationLabel={interpretationLabel}
          className="mt-10"
        />
      </div>
    </section>
  );
}

function VisibleResultStatic({
  chapter,
  className = "",
}: {
  chapter: FindingChapter;
  className?: string;
}) {
  return (
    <figure
      className={["relative aspect-[16/10] overflow-hidden bg-surface", className].join(
        " ",
      )}
    >
      <Image
        src={PROCESS_IMAGE_SRC}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
        style={{ objectPosition: "58% 34%" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_20%,color-mix(in_srgb,var(--background)_70%,transparent)_100%)]" />
      <figcaption className="absolute inset-x-5 bottom-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {chapter.visibleLabel}
        </p>
        <p className="mt-2 text-2xl font-semibold uppercase leading-tight text-foreground">
          {chapter.left?.title}
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {chapter.left?.items.map((item) => (
            <li
              key={item}
              className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/82"
            >
              {item}
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}

function InvisibleProcessStatic({
  chapter,
  processItems,
  className = "",
}: {
  chapter: FindingChapter;
  processItems: string[];
  className?: string;
}) {
  const isCompact = chapter.processDensity === "compact";

  return (
    <div className={className}>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
        {chapter.invisibleLabel}
      </p>
      <p
        className={[
          "mt-3 font-semibold uppercase leading-tight text-foreground",
          isCompact ? "text-[1.7rem]" : "text-3xl",
        ].join(" ")}
      >
        {chapter.right?.title}
      </p>
      <ol className={["grid", isCompact ? "mt-5 gap-2" : "mt-6 gap-3"].join(" ")}>
        {processItems.map((item, index) => (
          <li
            key={item}
            className={[
              "grid grid-cols-[2.5rem_1fr] border-l border-border",
              isCompact ? "gap-3 py-1" : "gap-4 py-1.5",
            ].join(" ")}
          >
            <span className="pl-4 text-xs font-semibold text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span
              className={[
                "font-semibold uppercase tracking-[0.08em] text-foreground/76",
                isCompact ? "text-[0.95rem] leading-tight" : "",
              ].join(" ")}
            >
              {item}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ProcessFindingSummaryStatic({
  chapter,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
  className = "",
  showFinding = true,
}: {
  chapter: FindingChapter;
  sourcePrefix: string;
  empiricalLabel: string;
  interpretationLabel: string;
  className?: string;
  showFinding?: boolean;
}) {
  return (
    <aside
      className={["border border-border bg-background/72 p-5 sm:p-7", className].join(
        " ",
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        {sourcePrefix}
      </p>
      {showFinding ? (
        <p className="mt-3 whitespace-pre-line text-2xl font-semibold leading-tight text-foreground">
          {chapter.finding}
        </p>
      ) : null}
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/58">
            {empiricalLabel}
          </h3>
          <p className="mt-3 whitespace-pre-line leading-7 text-foreground/78">
            {chapter.insight?.empirical ?? chapter.finding}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/58">
            {interpretationLabel}
          </h3>
          <p className="mt-3 leading-7 text-foreground/78">
            {chapter.insight?.interpretation ?? chapter.accessibleSummary}
          </p>
        </div>
      </div>
    </aside>
  );
}
