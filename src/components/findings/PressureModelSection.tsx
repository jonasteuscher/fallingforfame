"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  getPressureFactorPoint,
  interpolate,
  pressureFactorPositions,
} from "@/components/findings/pressureModelProgress";
import type { FindingChapter } from "@/types/findings";

type PressureModelSectionProps = {
  chapter: FindingChapter;
  sourcePrefix: string;
  empiricalLabel: string;
  interpretationLabel: string;
};

export function PressureModelSection({
  chapter,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
}: PressureModelSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const pressureFactors = useMemo(() => chapter.layers ?? [], [chapter.layers]);

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

  if (reducedMotion) {
    return (
      <ReducedMotionPressureModel
        chapter={chapter}
        pressureFactors={pressureFactors}
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
      <MobilePressureModel
        chapter={chapter}
        pressureFactors={pressureFactors}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
      />

      <div className="pressure-sticky-track hidden md:block md:h-[400svh] md:min-h-[2600px]">
        <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden bg-background">
          <div className="pressure-sticky-inner mx-auto grid h-full max-w-7xl grid-rows-[auto_1fr] px-6 py-8 xl:px-10">
            <header className="pressure-header relative z-10 max-w-[70rem]">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                {chapter.eyebrow}
              </p>
              <h2
                id={`${chapter.id}-title`}
                className="pressure-title mt-4 max-w-[62rem] text-[clamp(3rem,5.4vw,6.7rem)] font-semibold uppercase leading-[0.9] text-foreground [text-wrap:balance]"
              >
                {chapter.title}
              </h2>
              <p className="pressure-summary mt-6 max-w-[43rem] text-lg leading-8 text-foreground/76">
                {chapter.summary}
              </p>
            </header>

            <div className="pressure-scene-slot relative min-h-0 pt-2">
              <PressureScene
                chapter={chapter}
                pressureFactors={pressureFactors}
                progress={progress}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pressure-safety-section relative z-10 hidden px-6 pt-16 md:block xl:px-10">
        <PressureSafetySummary chapter={chapter} progress={progress} />
      </div>

      <div
        className="relative z-10 hidden px-6 pt-20 pb-[var(--section-gap-standard)] md:block xl:px-10"
        style={{
          opacity: getPressureInterpretationOpacity(progress),
          transform: `translate3d(0, ${interpolate(getPressureInterpretationOpacity(progress), 0, 1, 16, 0)}px, 0)`,
        }}
      >
        <PressureFindingSummary
          chapter={chapter}
          sourcePrefix={sourcePrefix}
          empiricalLabel={empiricalLabel}
          interpretationLabel={interpretationLabel}
          className="mx-auto max-w-5xl"
        />
      </div>
    </section>
  );
}

function PressureScene({
  chapter,
  pressureFactors,
  progress,
}: {
  chapter: FindingChapter;
  pressureFactors: string[];
  progress: number;
}) {
  const safety = getPressureSafetyOpacity(progress);

  return (
    <div className="relative mx-auto flex h-full max-w-[76rem] flex-col">
      <div className="pressure-scene-canvas relative min-h-0 flex-1">
        <div
          className="pressure-orbit absolute left-1/2 top-[var(--pressure-center-y,38%)] h-[min(52vw,36rem)] w-[min(70vw,55rem)] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-border/42"
          style={{
            opacity: interpolate(progress, 0, 0.2, 0.28, 0.12 + safety * 0.08),
            transform: `translate3d(-50%, -50%, 0) scale(${interpolate(progress, 0.36, 0.87, 1, 0.92 + safety * 0.08)})`,
          }}
          aria-hidden="true"
        />
        <div
          className="pressure-athlete-card absolute left-1/2 top-[var(--pressure-center-y,38%)] grid h-40 w-56 -translate-x-1/2 -translate-y-1/2 place-items-center border border-primary/70 bg-background/88 text-center shadow-[0_26px_90px_color-mix(in_srgb,var(--background)_76%,black)] lg:h-44 lg:w-60"
          data-pressure-athlete
        >
          <span className="px-4 text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
            {chapter.centerLabel}
          </span>
        </div>

        <ol className="absolute inset-0">
          {pressureFactors.map((factor, index) => {
            const position =
              pressureFactorPositions[index % pressureFactorPositions.length];
            const reveal = getPressureFactorReveal(index, progress);
            const point = getPressureFactorPoint(position, reveal);
            const scaledX = `calc(${point.x}px * var(--pressure-label-scale, 1))`;
            const scaledY = `calc(${point.y}px * var(--pressure-label-scale, 1))`;
            const active = reveal > 0.88 && safety < 0.3;
            const anchorTransform =
              position.align === "right"
                ? `translate3d(calc(-100% + ${scaledX}), ${scaledY}, 0)`
                : position.align === "center"
                  ? `translate3d(calc(-50% + ${scaledX}), ${scaledY}, 0)`
                  : `translate3d(${scaledX}, ${scaledY}, 0)`;

            return (
              <li
                key={factor}
                className="pressure-factor-label absolute w-[clamp(10.5rem,14vw,13rem)]"
                style={{
                  left: "50%",
                  top: "var(--pressure-center-y, 38%)",
                  opacity: interpolate(safety, 0, 1, reveal, reveal * 0.82),
                  transform: anchorTransform,
                }}
              >
                <button
                  type="button"
                  className={[
                    "block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
                    active ? "text-foreground" : "text-foreground/72",
                  ].join(" ")}
                >
                  <span className="block text-xs font-semibold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-2 block border-l border-border pl-4 text-sm font-semibold uppercase leading-snug tracking-[0.1em]">
                    {factor}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function PressureSafetySummary({
  chapter,
  progress,
}: {
  chapter: FindingChapter;
  progress: number;
}) {
  const safety = getPressureSafetyOpacity(progress);

  return (
    <div
      className="mx-auto w-[min(48rem,72vw)] border-l-2 border-primary bg-background/76 p-5 backdrop-blur-sm"
      style={{
        opacity: safety,
        transform: `translate3d(0, ${interpolate(safety, 0, 1, 20, 0)}px, 0)`,
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        {chapter.controlLabel}
      </p>
      <p className="mt-3 max-w-[42rem] text-lg leading-8 text-foreground/78">
        {chapter.controlResult}
      </p>
    </div>
  );
}

function MobilePressureModel({
  chapter,
  pressureFactors,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
}: {
  chapter: FindingChapter;
  pressureFactors: string[];
  sourcePrefix: string;
  empiricalLabel: string;
  interpretationLabel: string;
}) {
  return (
    <div className="px-4 py-[var(--section-gap-standard)] sm:px-6 md:hidden">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
        {chapter.eyebrow}
      </p>
      <p
        aria-hidden="true"
        className="mt-4 text-[clamp(2.75rem,11vw,4.2rem)] font-semibold uppercase leading-[0.9] text-foreground [text-wrap:balance]"
      >
        {chapter.title}
      </p>
      <p className="mt-6 text-lg leading-8 text-foreground/76">{chapter.summary}</p>
      <div className="mt-10 border border-border bg-background/52 p-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
          {chapter.centerLabel}
        </p>
      </div>
      <PressureFactorList factors={pressureFactors} className="mt-8" />
      <div className="mt-10 border-l-2 border-primary pl-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          {chapter.controlLabel}
        </p>
        <p className="mt-3 leading-7 text-foreground/76">{chapter.controlResult}</p>
      </div>
      <PressureFindingSummary
        chapter={chapter}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
        className="mt-10"
      />
    </div>
  );
}

function ReducedMotionPressureModel({
  chapter,
  pressureFactors,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
}: {
  chapter: FindingChapter;
  pressureFactors: string[];
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
        <div className="mt-10 grid gap-10 lg:grid-cols-[0.34fr_0.66fr]">
          <div className="border border-border bg-background/52 p-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
              {chapter.centerLabel}
            </p>
          </div>
          <PressureFactorList factors={pressureFactors} />
        </div>
        <div className="mt-10 border-l-2 border-primary pl-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {chapter.controlLabel}
          </p>
          <p className="mt-3 max-w-reading leading-7 text-foreground/76">
            {chapter.controlResult}
          </p>
        </div>
        <PressureFindingSummary
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

function PressureFactorList({
  factors,
  className = "",
}: {
  factors: string[];
  className?: string;
}) {
  return (
    <ol className={["grid gap-3 sm:grid-cols-2", className].join(" ")}>
      {factors.map((factor, index) => (
        <li
          key={factor}
          className="grid grid-cols-[2.75rem_1fr] gap-4 border-l border-border py-2"
        >
          <span className="pl-4 text-xs font-semibold text-primary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.12em] text-foreground/76">
            {factor}
          </span>
        </li>
      ))}
    </ol>
  );
}

function getPressureFactorReveal(index: number, progress: number) {
  const ranges = [
    [0.18, 0.31],
    [0.235, 0.365],
    [0.29, 0.42],
    [0.44, 0.54],
    [0.54, 0.64],
    [0.64, 0.72],
    [0.72, 0.8],
    [0.8, 0.87],
  ] as const;
  const range = ranges[index] ?? ranges[ranges.length - 1];

  return interpolate(progress, range[0], range[1], 0, 1);
}

function getPressureSafetyOpacity(progress: number) {
  return interpolate(progress, 0.875, 0.915, 0, 1);
}

function getPressureInterpretationOpacity(progress: number) {
  return interpolate(progress, 0.97, 1, 0, 1);
}

function PressureFindingSummary({
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
      className={["border border-border bg-background/72 p-5 sm:p-7", className].join(
        " ",
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        {sourcePrefix}
      </p>
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
