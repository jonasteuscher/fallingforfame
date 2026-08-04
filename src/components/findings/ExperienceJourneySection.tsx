"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { SectionTitle } from "@/components/athletes/SectionTitle";
import { interpolate } from "@/components/findings/pressureModelProgress";
import type { Locale } from "@/i18n/config";
import type { FindingChapter } from "@/types/findings";

type ExperienceJourneySectionProps = {
  chapter: FindingChapter;
  locale: Locale;
  sourcePrefix: string;
  empiricalLabel: string;
  interpretationLabel: string;
};

type JourneyPoint = {
  x: number;
  y: number;
};

const journeyAnnotations = {
  en: [
    "Everything still feels unfamiliar.",
    "Experience creates routine. Not certainty.",
    "Confidence can temporarily outpace judgement.",
    "Mistakes, close calls, observation and feedback reshape judgement.",
    "Experience becomes reflection. Not fearlessness.",
  ],
  de: [
    "Alles fühlt sich noch ungewohnt an.",
    "Erfahrung schafft Routine. Nicht Gewissheit.",
    "Vertrauen kann Urteilskraft zeitweise überholen.",
    "Fehler, Beinaheunfälle, Beobachtung und Feedback formen Urteilskraft neu.",
    "Erfahrung wird zu Reflexion. Nicht zu Furchtlosigkeit.",
  ],
} as const satisfies Record<Locale, readonly string[]>;

const journeyPoints = [
  { x: 32, y: 78 },
  { x: 50, y: 58 },
  { x: 70, y: 27 },
  { x: 84, y: 48 },
  { x: 96, y: 43 },
] as const;

const journeySegments = [
  [
    { x: 32, y: 78 },
    { x: 40, y: 75 },
    { x: 44, y: 64 },
    { x: 50, y: 58 },
  ],
  [
    { x: 50, y: 58 },
    { x: 60, y: 48 },
    { x: 63, y: 25 },
    { x: 70, y: 27 },
  ],
  [
    { x: 70, y: 27 },
    { x: 78, y: 29 },
    { x: 75, y: 55 },
    { x: 84, y: 48 },
  ],
  [
    { x: 84, y: 48 },
    { x: 88, y: 43 },
    { x: 93, y: 42 },
    { x: 96, y: 43 },
  ],
] as const;

const journeyStageStops = [0, 0.2451, 0.5914, 0.852, 1] as const;
const journeyPath =
  "M32 78 C40 75 44 64 50 58 C60 48 63 25 70 27 C78 29 75 55 84 48 C88 43 93 42 96 43";

const sourceNotes = {
  en: "Based on Dunning & Kruger (1999). Qualitative interpretation from the interview findings.",
  de: "Anlehnung an Dunning & Kruger (1999). Qualitative Interpretation auf Grundlage der Interviewbefunde.",
} as const satisfies Record<Locale, string>;

export function ExperienceJourneySection({
  chapter,
  locale,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
}: ExperienceJourneySectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const stages = useMemo(() => chapter.states ?? [], [chapter.states]);

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
      <ReducedMotionExperienceJourney
        chapter={chapter}
        locale={locale}
        stages={stages}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
      />
    );
  }

  const pathProgress = getJourneyPathProgress(progress);
  const activeStage = getJourneyActiveStage(pathProgress, stages.length);
  const summaryProgress = interpolate(progress, 0.94, 1, 0, 1);

  return (
    <section
      id={chapter.id}
      ref={sectionRef}
      aria-labelledby={`${chapter.id}-title`}
      className="relative scroll-mt-24 border-t border-border"
    >
      <p className="sr-only">{chapter.accessibleSummary}</p>
      <MobileExperienceJourney
        chapter={chapter}
        locale={locale}
        stages={stages}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
      />

      <div className="hidden md:block md:h-[420svh] md:min-h-[2800px]">
        <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden bg-background">
          <div className="relative mx-auto grid h-full max-w-7xl grid-cols-[minmax(16rem,0.34fr)_minmax(25rem,0.42fr)_minmax(15rem,0.24fr)] gap-8 px-6 py-8 xl:px-10">
            <header className="flex min-h-0 flex-col justify-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                {chapter.eyebrow}
              </p>
              <SectionTitle id={`${chapter.id}-title`} size="interviewSplit">
                {chapter.title}
              </SectionTitle>
              <p className="mt-10 max-w-[38ch] text-base leading-7 text-foreground/64">
                {chapter.summary}
              </p>
            </header>

            <ExperienceJourneyCanvas
              locale={locale}
              stages={stages}
              activeStage={activeStage}
              pathProgress={pathProgress}
            />

            <ExperienceStageList stages={stages} activeStage={activeStage} />
            <ExperienceSourceNote
              locale={locale}
              className="absolute bottom-24 left-6 xl:left-10"
            />
          </div>
        </div>
      </div>

      <ExperienceFindingSummary
        chapter={chapter}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
        progress={summaryProgress}
      />
    </section>
  );
}

function ExperienceJourneyCanvas({
  locale,
  stages,
  activeStage,
  pathProgress,
  complete = false,
}: {
  locale: Locale;
  stages: NonNullable<FindingChapter["states"]>;
  activeStage: number;
  pathProgress: number;
  complete?: boolean;
}) {
  const annotations = journeyAnnotations[locale];
  const marker = getMarkerPosition(pathProgress);
  const stageVisibility = complete ? 1 : getStageVisibility(activeStage, pathProgress);
  const tension = activeStage === 2 ? stageVisibility : 0;

  return (
    <figure className="relative my-auto aspect-[4/5] min-h-0 overflow-hidden">
      <div
        className="absolute h-40 w-40 rounded-full bg-primary blur-3xl"
        style={{
          left: `${marker.x}%`,
          top: `${marker.y}%`,
          opacity: 0.04 + tension * 0.07,
          transform: "translate3d(-50%, -50%, 0)",
        }}
        aria-hidden="true"
      />
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <path
          d={journeyPath}
          fill="none"
          stroke="var(--foreground)"
          strokeLinecap="round"
          strokeWidth="0.55"
          opacity="0.18"
        />
        <path
          d={journeyPath}
          fill="none"
          pathLength={1}
          stroke="var(--primary)"
          strokeDasharray={1}
          strokeDashoffset={1 - pathProgress}
          strokeLinecap="round"
          strokeWidth="0.78"
        />
        {journeyPoints.map((point, index) => {
          const visible = complete || index <= activeStage;
          const isActive = index === activeStage;

          return (
            <circle
              key={stages[index]?.title ?? index}
              cx={point.x}
              cy={point.y}
              r={isActive ? "2.3" : "1.55"}
              fill="var(--background)"
              stroke={isActive ? "var(--primary)" : "var(--foreground)"}
              strokeWidth={isActive ? "0.58" : "0.42"}
              opacity={visible ? (isActive ? 1 : 0.48) : 0}
            />
          );
        })}
        <circle
          cx={marker.x}
          cy={marker.y}
          r={activeStage === 0 ? "2.7" : activeStage === 2 ? "3.35" : "3"}
          fill="var(--background)"
          stroke="var(--primary)"
          strokeWidth="0.72"
        />
        <circle
          cx={marker.x}
          cy={marker.y}
          r={activeStage === 2 ? "7.5" : "5.2"}
          fill="var(--primary)"
          opacity={activeStage === 2 ? 0.12 : activeStage === 0 ? 0.08 : 0.045}
        />
      </svg>

      <div
        key={activeStage}
        className="absolute left-[8%] top-[7%] max-w-[17rem] border-l border-primary/60 pl-4 text-[0.82rem] font-semibold uppercase leading-snug tracking-[0.1em] text-foreground/78 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none"
        style={{
          opacity: stageVisibility,
          transform: `translate3d(0, ${interpolate(stageVisibility, 0, 1, 12, 0)}px, 0)`,
        }}
        aria-hidden="true"
      >
        {annotations[activeStage]}
      </div>
      <figcaption className="sr-only">
        {stages
          .map(
            (stage, index) => `Stage ${index + 1} of ${stages.length}: ${stage.title}`,
          )
          .join(". ")}
      </figcaption>
    </figure>
  );
}

function ExperienceStageList({
  stages,
  activeStage,
}: {
  stages: NonNullable<FindingChapter["states"]>;
  activeStage: number;
}) {
  return (
    <ol
      className="flex min-h-0 flex-col justify-center gap-5"
      aria-label="Experience stages"
    >
      {stages.map((stage, index) => {
        const isActive = index === activeStage;
        const isComplete = index < activeStage;

        return (
          <li
            key={stage.title}
            className="grid grid-cols-[2.4rem_1fr] gap-3 border-b border-border/46 pb-5 transition-opacity duration-500 ease-out motion-reduce:transition-none"
            style={{ opacity: isActive ? 1 : isComplete ? 0.58 : 0.3 }}
            aria-current={isActive ? "step" : undefined}
          >
            <span
              className={[
                "text-xs font-semibold transition-colors duration-500 motion-reduce:transition-none",
                isActive ? "text-primary" : "text-foreground/54",
              ].join(" ")}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3
                className={[
                  "text-sm font-semibold uppercase leading-snug tracking-[0.1em] transition-colors duration-500 motion-reduce:transition-none",
                  isActive ? "text-foreground" : "text-foreground/72",
                ].join(" ")}
              >
                {stage.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-foreground/58">{stage.body}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function MobileExperienceJourney({
  chapter,
  locale,
  stages,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
}: ExperienceJourneySectionProps & {
  stages: NonNullable<FindingChapter["states"]>;
}) {
  const annotations = journeyAnnotations[locale];

  return (
    <div className="px-4 py-[var(--section-gap-standard)] sm:px-6 md:hidden">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
        {chapter.eyebrow}
      </p>
      <p
        id={`${chapter.id}-mobile-title`}
        aria-hidden="true"
        className="mt-5 max-w-4xl whitespace-pre-line break-normal text-[clamp(2.75rem,5.6vw,5.5rem)] font-semibold uppercase leading-[0.9] text-foreground [overflow-wrap:normal] [text-wrap:balance] [word-break:normal]"
      >
        {chapter.title}
      </p>
      <p className="mt-8 max-w-[38ch] text-base leading-7 text-foreground/64">
        {chapter.summary}
      </p>
      <ol className="mt-12 grid gap-10" aria-label="Experience stages">
        {stages.map((stage, index) => (
          <li key={stage.title} className="grid gap-4">
            <svg className="h-16 w-full" viewBox="0 0 100 32" aria-hidden="true">
              <path
                d="M6 24 C24 24 28 11 44 14 C58 17 60 8 70 10 C82 13 84 16 94 15"
                fill="none"
                pathLength={1}
                stroke="var(--foreground)"
                strokeDasharray={1}
                strokeDashoffset={1 - (index + 1) / stages.length}
                strokeLinecap="round"
                strokeWidth="0.8"
                opacity="0.22"
              />
              <path
                d="M6 24 C24 24 28 11 44 14 C58 17 60 8 70 10 C82 13 84 16 94 15"
                fill="none"
                pathLength={1}
                stroke="var(--primary)"
                strokeDasharray={1}
                strokeDashoffset={1 - (index + 1) / stages.length}
                strokeLinecap="round"
                strokeWidth="1"
              />
            </svg>
            <div className="grid grid-cols-[2.8rem_1fr] gap-4">
              <span className="text-xs font-semibold text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-lg font-semibold uppercase tracking-[0.1em] text-foreground">
                  {stage.title}
                </h3>
                <p className="mt-3 leading-7 text-foreground/72">
                  {annotations[index]}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <ExperienceFindingSummary
        chapter={chapter}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
        progress={1}
        className="mt-12 block px-0 pb-0"
      />
      <ExperienceSourceNote locale={locale} className="mt-5" />
    </div>
  );
}

function ReducedMotionExperienceJourney({
  chapter,
  locale,
  stages,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
}: ExperienceJourneySectionProps & {
  stages: NonNullable<FindingChapter["states"]>;
}) {
  return (
    <section
      id={chapter.id}
      aria-labelledby={`${chapter.id}-title`}
      className="scroll-mt-24 border-t border-border px-4 py-[var(--section-gap-standard)] sm:px-6 xl:px-10"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.34fr_0.42fr_0.24fr]">
        <header className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            {chapter.eyebrow}
          </p>
          <SectionTitle id={`${chapter.id}-title`} size="interviewSplit">
            {chapter.title}
          </SectionTitle>
          <p className="mt-10 max-w-[38ch] text-base leading-7 text-foreground/64">
            {chapter.summary}
          </p>
        </header>
        <ExperienceJourneyCanvas
          locale={locale}
          stages={stages}
          activeStage={stages.length - 1}
          pathProgress={1}
          complete
        />
        <ExperienceStageList stages={stages} activeStage={stages.length - 1} />
      </div>
      <ExperienceSourceNote locale={locale} className="mx-auto mt-8 max-w-7xl" />
      <ExperienceFindingSummary
        chapter={chapter}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
        progress={1}
      />
    </section>
  );
}

function ExperienceSourceNote({
  locale,
  className = "",
}: {
  locale: Locale;
  className?: string;
}) {
  return (
    <p
      className={[
        "max-w-[34rem] text-[0.8rem] leading-5 text-foreground/48",
        className,
      ].join(" ")}
    >
      {sourceNotes[locale]}
    </p>
  );
}

function ExperienceFindingSummary({
  chapter,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
  progress,
  className = "relative z-10 hidden px-6 pb-[var(--section-gap-standard)] md:block xl:px-10",
}: Omit<ExperienceJourneySectionProps, "locale"> & {
  progress: number;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        opacity: progress,
        transform: `translate3d(0, ${interpolate(progress, 0, 1, 16, 0)}px, 0)`,
      }}
    >
      <aside className="mx-auto max-w-5xl border border-border bg-background/72 p-5 sm:p-7">
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
    </div>
  );
}

function getJourneyActiveStage(pathProgress: number, count: number) {
  if (count <= 0) {
    return 0;
  }

  if (pathProgress >= 1) {
    return count - 1;
  }

  for (let index = journeyStageStops.length - 1; index >= 0; index -= 1) {
    if (pathProgress >= journeyStageStops[index]) {
      return Math.min(count - 1, index);
    }
  }

  return 0;
}

function getStageVisibility(activeStage: number, pathProgress: number) {
  if (activeStage <= 0) {
    return 1;
  }

  const local = pathProgress - journeyStageStops[activeStage];

  return interpolate(local, 0, 0.018, 0, 1);
}

function getJourneyPathProgress(progress: number) {
  if (progress <= 0.08) {
    return 0;
  }

  if (progress <= 0.23) {
    return interpolate(progress, 0.08, 0.23, 0, journeyStageStops[1]);
  }

  if (progress <= 0.31) {
    return journeyStageStops[1];
  }

  if (progress <= 0.5) {
    return interpolate(progress, 0.31, 0.5, journeyStageStops[1], journeyStageStops[2]);
  }

  if (progress <= 0.66) {
    return journeyStageStops[2];
  }

  if (progress <= 0.77) {
    return interpolate(
      progress,
      0.66,
      0.77,
      journeyStageStops[2],
      journeyStageStops[3],
    );
  }

  if (progress <= 0.84) {
    return journeyStageStops[3];
  }

  if (progress <= 0.92) {
    return interpolate(progress, 0.84, 0.92, journeyStageStops[3], 1);
  }

  return 1;
}

function getMarkerPosition(progress: number) {
  const clamped = Math.min(Math.max(progress, 0), 1);
  const segmentIndex = Math.min(
    journeySegments.length - 1,
    Math.max(0, journeyStageStops.findIndex((stop) => stop >= clamped) - 1),
  );
  const segmentStart = journeyStageStops[segmentIndex];
  const segmentEnd = journeyStageStops[segmentIndex + 1];
  const local =
    segmentEnd === segmentStart
      ? 0
      : (clamped - segmentStart) / (segmentEnd - segmentStart);
  const segment = journeySegments[segmentIndex];
  const t = findBezierTAtLength(segment, local);

  return getBezierPoint(segment, t);
}

function getBezierPoint(segment: readonly JourneyPoint[], t: number) {
  const inverse = 1 - t;

  return {
    x:
      inverse ** 3 * segment[0].x +
      3 * inverse ** 2 * t * segment[1].x +
      3 * inverse * t ** 2 * segment[2].x +
      t ** 3 * segment[3].x,
    y:
      inverse ** 3 * segment[0].y +
      3 * inverse ** 2 * t * segment[1].y +
      3 * inverse * t ** 2 * segment[2].y +
      t ** 3 * segment[3].y,
  };
}

function findBezierTAtLength(segment: readonly JourneyPoint[], target: number) {
  let low = 0;
  let high = 1;

  for (let index = 0; index < 9; index += 1) {
    const middle = (low + high) / 2;

    if (getBezierLength(segment, middle) < target) {
      low = middle;
    } else {
      high = middle;
    }
  }

  return (low + high) / 2;
}

function getBezierLength(segment: readonly JourneyPoint[], t: number) {
  const samples = 18;
  let length = 0;
  let previous: JourneyPoint = segment[0];

  for (let index = 1; index <= samples; index += 1) {
    const point = getBezierPoint(segment, (t * index) / samples);

    length += Math.hypot(point.x - previous.x, point.y - previous.y);
    previous = point;
  }

  return length / getBezierLengthTotal(segment);
}

function getBezierLengthTotal(segment: readonly JourneyPoint[]) {
  const samples = 18;
  let length = 0;
  let previous: JourneyPoint = segment[0];

  for (let index = 1; index <= samples; index += 1) {
    const point = getBezierPoint(segment, index / samples);

    length += Math.hypot(point.x - previous.x, point.y - previous.y);
    previous = point;
  }

  return length;
}
