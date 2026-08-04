"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { SectionTitle } from "@/components/athletes/SectionTitle";
import { interpolate } from "@/components/findings/pressureModelProgress";
import type { Locale } from "@/i18n/config";
import type { FindingChapter } from "@/types/findings";

type DecisionLayersSectionProps = {
  chapter: FindingChapter;
  locale: Locale;
  sourcePrefix: string;
  empiricalLabel: string;
  interpretationLabel: string;
};

const annotationLabels = {
  en: {
    exitThreshold: "Exit threshold",
    noGo: "Go / No-Go?",
  },
  de: {
    exitThreshold: "Exit-Schwelle",
    noGo: "Go / No-Go?",
  },
} as const satisfies Record<Locale, Record<string, string>>;

const actionLabels = {
  en: [
    "align project",
    "judge ability",
    "check flight line",
    "compare conditions",
    "inspect system",
    "check readiness",
    "clear focus",
    "rehearse sequence",
    "confirm together",
    "make decision",
  ],
  de: [
    "Projekt abgleichen",
    "Können einschätzen",
    "Fluglinie prüfen",
    "Bedingungen vergleichen",
    "System kontrollieren",
    "Bereitschaft prüfen",
    "Klarheit prüfen",
    "Ablauf visualisieren",
    "Gemeinsam abstimmen",
    "Entscheidung treffen",
  ],
} as const satisfies Record<Locale, readonly string[]>;

export function DecisionLayersSection({
  chapter,
  locale,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
}: DecisionLayersSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [focusedStep, setFocusedStep] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const layers = useMemo(() => chapter.layers ?? [], [chapter.layers]);

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
      <ReducedMotionDecisionLayers
        chapter={chapter}
        locale={locale}
        layers={layers}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
      />
    );
  }

  const activeStep = focusedStep ?? getDecisionActiveStep(progress, layers.length);
  const stepProgress =
    focusedStep === null ? getDecisionStepProgress(progress, layers.length) : 1;
  const reduction = focusedStep === null ? interpolate(progress, 0.935, 1, 0, 1) : 0;

  return (
    <section
      id={chapter.id}
      ref={sectionRef}
      aria-labelledby={`${chapter.id}-title`}
      className="relative scroll-mt-24 border-t border-border"
    >
      <p className="sr-only">{chapter.accessibleSummary}</p>
      <MobileDecisionLayers
        chapter={chapter}
        locale={locale}
        layers={layers}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
      />

      <div className="hidden md:block md:h-[560svh] md:min-h-[3600px]">
        <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden bg-background">
          <div className="mx-auto grid h-full max-w-7xl grid-cols-[minmax(15rem,0.32fr)_minmax(26rem,0.44fr)_minmax(15rem,0.24fr)] gap-8 px-6 py-8 xl:px-10">
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

            <DecisionDocumentaryScene
              chapter={chapter}
              locale={locale}
              layers={layers}
              activeStep={activeStep}
              stepProgress={stepProgress}
              reduction={reduction}
            />

            <DecisionProcessList
              layers={layers}
              activeStep={activeStep}
              progress={progress}
              onFocusStep={setFocusedStep}
            />
          </div>
        </div>
      </div>

      <DecisionFindingSummary
        chapter={chapter}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
      />
    </section>
  );
}

function DecisionDocumentaryScene({
  locale,
  layers,
  activeStep,
  stepProgress,
  fullyAnnotated = false,
}: {
  chapter: FindingChapter;
  locale: Locale;
  layers: string[];
  activeStep: number;
  stepProgress: number;
  reduction: number;
  fullyAnnotated?: boolean;
}) {
  const labels = annotationLabels[locale];
  const actions = actionLabels[locale];
  const modelOpacity = 1;
  const finalDecision = fullyAnnotated
    ? 1
    : getStepVisibility(9, activeStep, stepProgress);
  const thresholdProgress = fullyAnnotated
    ? 1
    : interpolate(finalDecision, 0.42, 0.72, 0, 1);
  const resultProgress = fullyAnnotated ? 1 : interpolate(finalDecision, 0.74, 1, 0, 1);
  const checkpoints = layers.map((_, index) => ({
    number: String(index + 1).padStart(2, "0"),
    x: 50,
    y: 12 + index * 7.25,
    visibility: fullyAnnotated ? 1 : getStepVisibility(index, activeStep, stepProgress),
  }));
  const activeCheckpointVisibility = checkpoints[activeStep]?.visibility ?? 0;
  const thresholdY = 90;
  const resultY = 106;

  return (
    <figure className="relative my-auto aspect-[4/5] min-h-0 overflow-hidden">
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--foreground)_4%,transparent),transparent_42%,color-mix(in_srgb,var(--foreground)_3%,transparent))]"
        style={{ opacity: modelOpacity * 0.18 }}
        aria-hidden="true"
      />

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 120"
        aria-hidden="true"
      >
        <defs>
          <filter id="decision-soft-glow">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>
        <g opacity={modelOpacity}>
          {checkpoints.slice(1).map((checkpoint, index) => {
            const previous = checkpoints[index];
            const progressValue = checkpoint.visibility;

            return (
              <path
                key={`${previous.number}-${checkpoint.number}`}
                d={`M${previous.x} ${previous.y + 3.8} L${checkpoint.x} ${checkpoint.y - 3.8}`}
                fill="none"
                pathLength={1}
                stroke="var(--primary)"
                strokeDasharray={1}
                strokeDashoffset={1 - progressValue}
                strokeLinecap="round"
                strokeWidth="0.58"
                opacity={progressValue > 0 ? 0.82 : 0}
              />
            );
          })}
          <path
            d={`M50 ${(checkpoints.at(-1)?.y ?? 77) + 4.7} L50 ${thresholdY - 5.4}`}
            fill="none"
            pathLength={1}
            stroke="var(--primary)"
            strokeDasharray={1}
            strokeDashoffset={1 - thresholdProgress}
            strokeLinecap="round"
            strokeWidth="0.62"
            opacity={thresholdProgress * 0.86}
          />
          <path
            d={`M36 ${thresholdY} H64`}
            fill="none"
            pathLength={1}
            stroke="var(--primary)"
            strokeDasharray={1}
            strokeDashoffset={1 - thresholdProgress}
            strokeLinecap="round"
            strokeWidth="0.7"
            opacity={thresholdProgress}
          />
          <path
            d={`M50 ${thresholdY + 8.2} L50 ${resultY - 4.6}`}
            fill="none"
            pathLength={1}
            stroke="var(--primary)"
            strokeDasharray={1}
            strokeDashoffset={1 - resultProgress}
            strokeLinecap="round"
            strokeWidth="0.64"
            opacity={resultProgress * 0.74}
          />
          <circle
            cx="50"
            cy={thresholdY}
            r="8.4"
            fill="var(--primary)"
            filter="url(#decision-soft-glow)"
            opacity={thresholdProgress * 0.1}
          />
        </g>
      </svg>

      <ol aria-hidden="true">
        {checkpoints.map((checkpoint, index) => {
          const active = index === activeStep;

          return (
            <DecisionCheckpoint
              key={checkpoint.number}
              checkpoint={checkpoint}
              active={active}
              visible={modelOpacity * checkpoint.visibility}
            />
          );
        })}
      </ol>
      <ActionCue
        action={actions[activeStep] ?? actions.at(-1) ?? ""}
        y={checkpoints[activeStep]?.y ?? 17}
        visible={modelOpacity * (1 - resultProgress) * activeCheckpointVisibility}
      />
      <EndpointLabel
        label={labels.exitThreshold}
        className="left-1/2 top-[77%]"
        centered
        visible={modelOpacity * thresholdProgress}
      />
      <div
        className="absolute left-1/2 w-24 text-center text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-primary"
        style={{
          opacity: resultProgress,
          top: `${svgYToCssPercent(resultY)}%`,
          transform: `translate3d(-50%, ${interpolate(resultProgress, 0, 1, 10, 0)}px, 0)`,
        }}
        aria-hidden="true"
      >
        {labels.noGo}
      </div>
      <figcaption className="sr-only">
        {layers.join(", ")}, {labels.exitThreshold}, {labels.noGo}
      </figcaption>
    </figure>
  );
}

function DecisionCheckpoint({
  checkpoint,
  active,
  visible,
}: {
  checkpoint: {
    number: string;
    x: number;
    y: number;
    visibility: number;
  };
  active: boolean;
  visible: number;
}) {
  return (
    <li
      className="absolute left-1/2 grid size-8 place-items-center rounded-full border transition-[border-color,opacity,transform] duration-500 ease-out motion-reduce:transition-none"
      style={{
        borderColor: active
          ? "var(--primary)"
          : visible >= 1
            ? "color-mix(in srgb, var(--foreground) 78%, transparent)"
            : "color-mix(in srgb, var(--foreground) 30%, transparent)",
        opacity: active
          ? interpolate(visible, 0, 1, 0.3, 1)
          : visible >= 1
            ? 0.76
            : 0.34,
        top: `${svgYToCssPercent(checkpoint.y)}%`,
        transform: `translate3d(-50%, -50%, 0) scale(${active ? interpolate(visible, 0, 1, 0.92, 1) : 1})`,
        boxShadow: active
          ? `0 0 0 ${interpolate(visible, 0, 1, 0, 7)}px color-mix(in srgb, var(--primary) 10%, transparent)`
          : "none",
      }}
    >
      <span
        className={[
          "block text-[0.62rem] font-semibold leading-none transition-colors duration-500 motion-reduce:transition-none",
          active
            ? "text-primary"
            : visible >= 1
              ? "text-foreground/78"
              : "text-foreground/38",
        ].join(" ")}
      >
        {checkpoint.number}
      </span>
    </li>
  );
}

function ActionCue({
  action,
  y,
  visible,
}: {
  action: string;
  y: number;
  visible: number;
}) {
  return (
    <div
      key={action}
      className="absolute left-[58%] max-w-[11rem] border-l border-primary/60 pl-3 text-[0.72rem] font-semibold uppercase leading-snug tracking-[0.11em] text-foreground/78 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none"
      style={{
        opacity: visible,
        top: `${svgYToCssPercent(y)}%`,
        transform: `translate3d(0, calc(-0.9rem + ${interpolate(visible, 0, 1, 10, 0)}px), 0)`,
      }}
      aria-hidden="true"
    >
      {action}
    </div>
  );
}

function EndpointLabel({
  label,
  className,
  centered = false,
  visible,
}: {
  label: string;
  className: string;
  centered?: boolean;
  visible: number;
}) {
  return (
    <div
      className={[
        "absolute text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primary",
        className,
      ].join(" ")}
      style={{
        opacity: visible,
        transform: `translate3d(${centered ? "-50%" : "0"}, ${interpolate(visible, 0, 1, 8, 0)}px, 0)`,
      }}
      aria-hidden="true"
    >
      {label}
    </div>
  );
}

function DecisionProcessList({
  layers,
  activeStep,
  progress,
  onFocusStep,
}: {
  layers: string[];
  activeStep: number;
  progress: number;
  onFocusStep: (index: number | null) => void;
}) {
  return (
    <ol
      className="flex min-h-0 flex-col justify-center gap-3"
      aria-label="Decision layers"
    >
      {layers.map((layer, index) => {
        const isActive = index === activeStep;
        const isComplete = index < activeStep || progress >= 0.88;
        const opacity = isActive ? 1 : isComplete ? 0.6 : 0.3;

        return (
          <li key={layer}>
            <button
              type="button"
              className={[
                "group grid w-full grid-cols-[2.3rem_1fr] items-start gap-3 border-b border-border/50 pb-3 text-left transition-[opacity,transform,color] duration-500 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none",
                isActive
                  ? "translate-y-0 text-foreground"
                  : "translate-y-1 text-foreground/72",
              ].join(" ")}
              style={{ opacity }}
              aria-current={isActive ? "step" : undefined}
              onFocus={() => onFocusStep(index)}
              onBlur={() => onFocusStep(null)}
              onMouseEnter={() => onFocusStep(index)}
              onMouseLeave={() => onFocusStep(null)}
            >
              <span
                className={[
                  "text-xs font-semibold transition-colors duration-500 motion-reduce:transition-none",
                  isActive ? "text-primary" : "text-foreground/60",
                ].join(" ")}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                className={[
                  "text-sm font-semibold uppercase leading-snug tracking-[0.1em] transition-[font-size,color] duration-500 motion-reduce:transition-none",
                  isActive ? "text-[0.98rem] text-foreground" : "",
                ].join(" ")}
              >
                {layer}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function MobileDecisionLayers({
  chapter,
  locale,
  layers,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
}: DecisionLayersSectionProps & {
  layers: string[];
}) {
  return (
    <div className="px-4 py-[var(--section-gap-standard)] sm:px-6 md:hidden">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
        {chapter.eyebrow}
      </p>
      <p
        id={`${chapter.id}-mobile-title`}
        aria-hidden="true"
        className="mt-5 max-w-5xl whitespace-pre-line break-normal text-[clamp(3rem,8vw,7.5rem)] font-semibold uppercase leading-[0.88] text-foreground [overflow-wrap:normal] [text-wrap:balance] [word-break:normal]"
      >
        {chapter.title}
      </p>
      <p className="mt-8 max-w-[38ch] text-base leading-7 text-foreground/64">
        {chapter.summary}
      </p>
      <div className="mt-10">
        <DecisionDocumentaryScene
          chapter={chapter}
          locale={locale}
          layers={layers}
          activeStep={9}
          stepProgress={1}
          reduction={0}
          fullyAnnotated
        />
      </div>
      <ol className="mt-10 grid gap-7" aria-label="Decision layers">
        {layers.map((layer, index) => (
          <li
            key={layer}
            className="grid grid-cols-[2.7rem_1fr] gap-4 border-l border-border py-1"
          >
            <span className="pl-4 text-xs font-semibold text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-base font-semibold uppercase tracking-[0.1em] text-foreground">
                {layer}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <DecisionFindingSummary
        chapter={chapter}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
        className="mt-10 block px-0 pb-0"
      />
    </div>
  );
}

function ReducedMotionDecisionLayers({
  chapter,
  locale,
  layers,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
}: DecisionLayersSectionProps & {
  layers: string[];
}) {
  return (
    <section
      id={chapter.id}
      aria-labelledby={`${chapter.id}-title`}
      className="scroll-mt-24 border-t border-border px-4 py-[var(--section-gap-standard)] sm:px-6 xl:px-10"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.34fr_0.38fr_0.28fr]">
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
        <DecisionDocumentaryScene
          chapter={chapter}
          locale={locale}
          layers={layers}
          activeStep={9}
          stepProgress={1}
          reduction={0}
          fullyAnnotated
        />
        <DecisionProcessList
          layers={layers}
          activeStep={9}
          progress={1}
          onFocusStep={() => undefined}
        />
      </div>
      <DecisionFindingSummary
        chapter={chapter}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
      />
    </section>
  );
}

function DecisionFindingSummary({
  chapter,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
  className = "relative z-10 hidden -mt-24 px-6 pb-40 md:block xl:px-10",
}: Omit<DecisionLayersSectionProps, "locale"> & {
  className?: string;
}) {
  return (
    <div className={className}>
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

function getDecisionActiveStep(progress: number, count: number) {
  if (count <= 0) {
    return 0;
  }

  if (progress >= 0.88) {
    return count - 1;
  }

  return Math.min(count - 1, Math.floor((progress / 0.88) * count));
}

function getDecisionStepProgress(progress: number, count: number) {
  if (count <= 0 || progress >= 0.88) {
    return 1;
  }

  const raw = (progress / 0.88) * count;

  return raw - Math.floor(raw);
}

function getStepVisibility(index: number, activeStep: number, stepProgress: number) {
  if (activeStep > index) {
    return 1;
  }

  if (activeStep === index) {
    return stepProgress;
  }

  return 0;
}

function svgYToCssPercent(y: number) {
  return (y / 120) * 100;
}
