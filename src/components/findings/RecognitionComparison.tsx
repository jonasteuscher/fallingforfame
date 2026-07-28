"use client";

import { useEffect, useRef, useState } from "react";

import {
  getRecognitionComparisonState,
  getRecognitionItemOpacity,
  interpolate,
  recognitionPhases,
} from "@/components/findings/recognitionComparisonProgress";
import type { FindingChapter } from "@/types/findings";

type RecognitionComparisonProps = {
  chapter: FindingChapter;
  sourcePrefix: string;
  empiricalLabel: string;
  interpretationLabel: string;
};

export function RecognitionComparison({
  chapter,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
}: RecognitionComparisonProps) {
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

    return () => motionQuery.removeEventListener("change", updateReducedMotion);
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

  if (!chapter.left || !chapter.right) {
    return null;
  }

  if (reducedMotion) {
    return (
      <section
        id={chapter.id}
        aria-labelledby={`${chapter.id}-title`}
        className="scroll-mt-24 border-t border-border"
      >
        <h2 id={`${chapter.id}-title`} className="sr-only">
          {chapter.title}
        </h2>
        <p className="sr-only">{chapter.accessibleSummary}</p>
        <StaticRecognitionComparison
          chapter={chapter}
          mode="reduced-motion"
          sourcePrefix={sourcePrefix}
          empiricalLabel={empiricalLabel}
          interpretationLabel={interpretationLabel}
        />
      </section>
    );
  }

  const state = getRecognitionComparisonState(progress);
  const conclusionOpacity = interpolate(
    progress,
    recognitionPhases.finalStatement[0],
    recognitionPhases.finalStatement[1],
    0,
    1,
  );

  return (
    <section
      id={chapter.id}
      ref={sectionRef}
      aria-labelledby={`${chapter.id}-title`}
      className="relative scroll-mt-24 border-t border-border md:min-h-[330svh]"
    >
      <h2 id={`${chapter.id}-title`} className="sr-only">
        {chapter.title}
      </h2>
      <p className="sr-only">{chapter.accessibleSummary}</p>
      <StaticRecognitionComparison
        chapter={chapter}
        mode="mobile"
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
      />

      <div className="sticky top-14 hidden h-[calc(100svh-3.5rem)] overflow-hidden bg-background md:block motion-reduce:hidden">
        <div className="mx-auto grid h-full max-w-7xl grid-rows-[auto_1fr_auto] px-6 py-8 xl:px-10">
          <header className="relative z-10 max-w-[64rem]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              {chapter.eyebrow}
            </p>
            <p
              aria-hidden="true"
              className="mt-3 whitespace-pre-line text-[clamp(2.9rem,5.2vw,6.5rem)] font-semibold uppercase leading-[0.9] text-foreground [text-wrap:balance]"
            >
              {chapter.title}
            </p>
            <p className="mt-5 max-w-[38rem] text-base leading-7 text-foreground/72 lg:text-lg lg:leading-8">
              {chapter.summary}
            </p>
          </header>

          <figure className="relative grid min-h-0 content-center" aria-labelledby={`${chapter.id}-caption`}>
            <figcaption id={`${chapter.id}-caption`} className="sr-only">
              {chapter.accessibleSummary} {chapter.disclaimer}
            </figcaption>
            <div
              className="relative grid min-h-[25rem] overflow-hidden border border-border bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface)_62%,transparent),color-mix(in_srgb,var(--background)_84%,black))] shadow-[0_30px_100px_color-mix(in_srgb,var(--background)_74%,black)] lg:min-h-[30rem]"
              aria-hidden="true"
            >
              <div className="absolute inset-0 opacity-70 [background:radial-gradient(circle_at_22%_32%,color-mix(in_srgb,var(--primary)_18%,transparent),transparent_28%),linear-gradient(90deg,color-mix(in_srgb,var(--foreground)_7%,transparent),transparent_42%,color-mix(in_srgb,var(--accent)_14%,transparent))]" />
              <div
                className="absolute bottom-0 top-0 w-px bg-foreground/22"
                style={{ left: `${50 + state.dividerBias * 3}%` }}
              />
              <div
                className="grid h-full grid-cols-2 gap-[clamp(2.5rem,7vw,7rem)] p-6 pb-[11rem] lg:p-9 lg:pb-[12rem]"
                style={{
                  opacity: interpolate(progress, 0.82, 0.98, 1, 0.36),
                  transform: `translate3d(0, ${interpolate(progress, 0.82, 0.98, 0, -10)}px, 0)`,
                }}
              >
                <RecognitionSide
                  side="visibility"
                  title={chapter.left.title}
                  descriptor={chapter.left.descriptor}
                  items={chapter.left.items}
                  progress={progress}
                />
                <RecognitionSide
                  side="recognition"
                  title={chapter.right.title}
                  descriptor={chapter.right.descriptor}
                  items={chapter.right.items}
                  progress={progress}
                />
              </div>
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 border-t border-foreground/14 bg-background/86 px-6 py-5 backdrop-blur-sm lg:px-9 lg:py-6"
                style={{
                  opacity: conclusionOpacity,
                  transform: `translate3d(0, ${interpolate(conclusionOpacity, 0, 1, 22, 0)}px, 0)`,
                }}
              >
                <p className="max-w-[46rem] whitespace-pre-line text-[clamp(1.85rem,3vw,3.7rem)] font-semibold leading-[1.02] text-foreground">
                  {splitConclusion(chapter.finding)}
                </p>
              </div>
            </div>
          </figure>

          <div className="flex items-end justify-between gap-8">
            <p className="max-w-[44rem] text-sm leading-6 text-foreground/58">
              {chapter.disclaimer}
            </p>
            <p
              className="hidden text-right text-xs font-semibold uppercase tracking-[0.18em] text-primary/82 lg:block"
              aria-hidden="true"
            >
              {state.showConclusion ? chapter.right.title : chapter.left.title}
            </p>
          </div>
        </div>
      </div>
      <div className="hidden px-4 pb-[var(--section-gap-standard)] sm:px-6 md:block xl:px-10">
        <div className="mx-auto max-w-7xl">
          <RecognitionFindingSummary
            chapter={chapter}
            sourcePrefix={sourcePrefix}
            empiricalLabel={empiricalLabel}
            interpretationLabel={interpretationLabel}
          />
        </div>
      </div>
    </section>
  );
}

function RecognitionSide({
  side,
  title,
  descriptor,
  items,
  progress,
}: {
  side: "visibility" | "recognition";
  title: string;
  descriptor?: string;
  items: string[];
  progress: number;
}) {
  const state = getRecognitionComparisonState(progress);
  const isVisibility = side === "visibility";
  const emphasis = isVisibility ? state.visibilityEmphasis : state.recognitionEmphasis;
  const opacity = isVisibility ? state.visibilityOpacity : state.recognitionOpacity;
  const drift = isVisibility
    ? interpolate(progress, recognitionPhases.visibilityRecede[0], recognitionPhases.visibilityRecede[1], 0, -18)
    : interpolate(progress, recognitionPhases.recognitionBuild[0], recognitionPhases.recognitionBuild[1], 16, 0);

  return (
    <div
      className={[
        "relative flex min-w-0 flex-col justify-center",
        isVisibility ? "items-start text-left" : "items-start text-left",
      ].join(" ")}
      style={{
        opacity,
        transform: `translate3d(0, ${drift}px, 0) scale(${0.94 + emphasis * 0.06})`,
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        {title}
      </p>
      {descriptor ? (
        <p className="mt-3 max-w-[20rem] text-lg font-semibold leading-tight text-foreground/88 lg:text-2xl">
          {descriptor}
        </p>
      ) : null}
      <div
        className={[
          "mt-7 min-h-[12rem] w-full",
          isVisibility ? "grid content-start gap-3" : "grid content-end gap-3",
        ].join(" ")}
      >
        {items.map((item, index) => {
          const itemOpacity = getRecognitionItemOpacity(
            progress,
            index,
            items.length,
            side,
          );

          if (isVisibility) {
            return (
              <span
                key={item}
                className="w-fit max-w-full border border-foreground/14 bg-background/28 px-3 py-2 text-sm font-semibold uppercase leading-tight text-foreground shadow-[0_12px_42px_color-mix(in_srgb,var(--background)_64%,black)] backdrop-blur-sm"
                style={{
                  opacity: itemOpacity,
                  marginLeft: `${[0, 34, 16, 48, 26][index % 5]}%`,
                  transform: `translate3d(${interpolate(progress, recognitionPhases.visibilityRecede[0], recognitionPhases.visibilityRecede[1], 0, index % 2 === 0 ? -12 : 12)}px, ${interpolate(itemOpacity, 0, 1, 16, 0)}px, 0) scale(${0.94 + itemOpacity * 0.06})`,
                }}
              >
                {item}
              </span>
            );
          }

          return (
            <span
              key={item}
              className="relative grid min-h-11 grid-cols-[1.25rem_1fr] items-center gap-3 border-l border-foreground/16 pl-4 text-base font-semibold leading-tight text-foreground"
              style={{
                opacity: itemOpacity,
                transform: `translate3d(0, ${interpolate(itemOpacity, 0, 1, 16, 0)}px, 0)`,
              }}
            >
              <span className="h-px bg-primary/76" aria-hidden="true" />
              {item}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function StaticRecognitionComparison({
  chapter,
  mode,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
}: {
  chapter: FindingChapter;
  mode: "mobile" | "reduced-motion";
  sourcePrefix: string;
  empiricalLabel: string;
  interpretationLabel: string;
}) {
  if (!chapter.left || !chapter.right) {
    return null;
  }

  return (
    <div
      className={[
        "px-4 py-[var(--section-gap-standard)] sm:px-6 xl:px-10",
        mode === "mobile" ? "md:hidden motion-reduce:block" : "hidden motion-reduce:block",
      ].join(" ")}
      data-recognition-layout={mode === "mobile" ? "sequential" : "static"}
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
          {chapter.eyebrow}
        </p>
        <p
          aria-hidden="true"
          className="mt-4 whitespace-pre-line text-[clamp(2.65rem,10vw,4.8rem)] font-semibold uppercase leading-[0.9] text-foreground [overflow-wrap:anywhere] [text-wrap:balance]"
        >
          {chapter.title}
        </p>
        <p className="mt-6 max-w-[38rem] text-lg leading-8 text-foreground/76">
          {chapter.summary}
        </p>
        <figure className="mt-10" aria-label={chapter.title.replace(/\s+/g, " ")}>
          <div className="grid gap-6 lg:grid-cols-2">
            <StaticSide
              title={chapter.left.title}
              descriptor={chapter.left.descriptor}
              items={chapter.left.items}
            />
            <div className="flex items-center justify-center text-3xl text-primary lg:hidden" aria-hidden="true">
              ↓
            </div>
            <StaticSide
              title={chapter.right.title}
              descriptor={chapter.right.descriptor}
              items={chapter.right.items}
              grounded
            />
          </div>
          <figcaption className="sr-only">
            {chapter.accessibleSummary} {chapter.disclaimer}
          </figcaption>
        </figure>
        <p className="mt-10 max-w-[52rem] whitespace-pre-line text-[clamp(2.2rem,7vw,4.6rem)] font-semibold leading-[0.96] text-foreground">
          {splitConclusion(chapter.finding)}
        </p>
        <p className="mt-6 max-w-[42rem] text-sm leading-6 text-foreground/58">
          {chapter.disclaimer}
        </p>
        <RecognitionFindingSummary
          chapter={chapter}
          sourcePrefix={sourcePrefix}
          empiricalLabel={empiricalLabel}
          interpretationLabel={interpretationLabel}
          className="mt-10"
        />
      </div>
    </div>
  );
}

function StaticSide({
  title,
  descriptor,
  items,
  grounded = false,
}: {
  title: string;
  descriptor?: string;
  items: string[];
  grounded?: boolean;
}) {
  return (
    <article
      className={[
        "border border-border bg-surface/44 p-5 sm:p-7",
        grounded ? "border-primary/42 bg-background/38" : "",
      ].join(" ")}
    >
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
        {title}
      </h3>
      {descriptor ? (
        <p className="mt-4 text-2xl font-semibold leading-tight text-foreground">
          {descriptor}
        </p>
      ) : null}
      <ul className="mt-6 grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 leading-7 text-foreground/78">
            <span className="mt-3 h-px w-5 shrink-0 bg-primary/76" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function splitConclusion(finding: string) {
  return finding.replace(/\. /, ".\n");
}

function RecognitionFindingSummary({
  chapter,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
  className = "",
}: {
  chapter: FindingChapter;
  sourcePrefix: string;
  empiricalLabel: string;
  interpretationLabel: string;
  className?: string;
}) {
  return (
    <aside
      className={[
        "border border-border bg-background/72 p-5 sm:p-7",
        className,
      ].join(" ")}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        {sourcePrefix}
      </p>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/58">
            {empiricalLabel}
          </h3>
          <p className="mt-3 leading-7 text-foreground/78">{chapter.finding}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/58">
            {interpretationLabel}
          </h3>
          <p className="mt-3 leading-7 text-foreground/78">
            {chapter.accessibleSummary}
          </p>
        </div>
      </div>
    </aside>
  );
}
