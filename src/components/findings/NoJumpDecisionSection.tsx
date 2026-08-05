"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { SectionTitle } from "@/components/athletes/SectionTitle";
import { FindingsQuote } from "@/components/findings/FindingsQuote";
import { interpolate } from "@/components/findings/pressureModelProgress";
import type { Locale } from "@/i18n/config";
import type { FindingChapter } from "@/types/findings";

type NoJumpDecisionSectionProps = {
  chapter: FindingChapter;
  locale: Locale;
  sourcePrefix: string;
  empiricalLabel: string;
  interpretationLabel: string;
  quoteSourceLabel: string;
};

const noJumpCopy = {
  en: {
    accessible:
      "Several changing conditions can create uncertainty. Choosing not to jump is an active safety decision, not a failure. Experience and responsibility support the decision to walk down.",
    noGo: "No-go",
    keyInsight: "Sometimes the safest jump is no jump at all",
    transition: "This decision is not spontaneous.\nIt develops through experience.",
  },
  de: {
    accessible:
      "Mehrere wechselnde Bedingungen können Unsicherheit erzeugen. Nicht zu springen ist eine aktive Sicherheitsentscheidung und keine Niederlage. Erfahrung und Verantwortung stützen die Entscheidung abzusteigen.",
    noGo: "No-Go",
    keyInsight: "Manchmal ist der sicherste Sprung keiner",
    transition:
      "Diese Entscheidung entsteht nicht spontan.\nSie entwickelt sich mit Erfahrung.",
  },
} as const satisfies Record<Locale, Record<string, string>>;

const conditionBodies = {
  en: [
    "Direction and strength can change the margin.",
    "Clouds alter visibility and timing.",
    "Terrain must remain readable.",
    "Readiness is part of the decision.",
    "Clarity matters before the exit.",
    "A quiet doubt can be relevant.",
    "The group affects the outcome.",
    "The decision includes others.",
  ],
  de: [
    "Richtung und Stärke verändern den Spielraum.",
    "Wolken verändern Sicht und Timing.",
    "Das Gelände muss lesbar bleiben.",
    "Bereitschaft ist Teil der Entscheidung.",
    "Klarheit zählt vor dem Exit.",
    "Ein leiser Zweifel kann relevant sein.",
    "Die Gruppe beeinflusst den Ausgang.",
    "Die Entscheidung betrifft auch andere.",
  ],
} as const satisfies Record<Locale, readonly string[]>;

export function NoJumpDecisionSection({
  chapter,
  locale,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
  quoteSourceLabel,
}: NoJumpDecisionSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
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
      <ReducedMotionNoJumpDecision
        chapter={chapter}
        locale={locale}
        layers={layers}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
        quoteSourceLabel={quoteSourceLabel}
      />
    );
  }

  const activeCondition = getActiveCondition(progress, layers.length);
  const descentProgress = interpolate(progress, 0.65, 0.84, 0, 1);
  const finalProgress = interpolate(progress, 0.84, 0.93, 0, 1);
  const overlayProgress = finalProgress;

  return (
    <section
      id={chapter.id}
      ref={sectionRef}
      aria-labelledby={`${chapter.id}-title`}
      className="relative scroll-mt-24 bg-background"
    >
      <p className="sr-only">{noJumpCopy[locale].accessible}</p>
      <MobileNoJumpDecision
        chapter={chapter}
        locale={locale}
        layers={layers}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
        quoteSourceLabel={quoteSourceLabel}
      />
      <div className="hidden xl:block xl:h-[340svh] xl:min-h-[2400px]">
        <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden bg-background">
          <div className="no-jump-sticky-inner mx-auto grid h-full max-w-7xl grid-rows-[auto_1fr] gap-y-6 px-6 py-8 xl:px-10">
            <header className="no-jump-header relative z-10 max-w-none">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                {chapter.eyebrow}
              </p>
              <h2
                id={`${chapter.id}-title`}
                className="no-jump-title mt-5 max-w-none whitespace-pre-line break-normal text-[clamp(2.7rem,5vw,5.4rem)] font-semibold uppercase leading-[0.9] text-foreground [overflow-wrap:normal] [text-wrap:balance] [word-break:normal] motion-safe:animate-[fade-in-up_700ms_ease-out_forwards] motion-safe:translate-y-4 motion-safe:opacity-0"
              >
                {chapter.title}
              </h2>
            </header>
            <div className="no-jump-layout grid min-h-0 grid-cols-[minmax(22rem,0.36fr)_minmax(35rem,0.64fr)] gap-10">
              <div className="no-jump-copy flex min-h-0 flex-col justify-start">
                <p className="no-jump-summary mt-8 max-w-[38ch] text-base leading-7 text-foreground/64">
                  {chapter.summary}
                </p>
                <NoJumpConditionList
                  layers={layers}
                  locale={locale}
                  activeCondition={activeCondition}
                  hiddenAmount={descentProgress}
                />
              </div>
              <NoJumpImage
                chapter={chapter}
                locale={locale}
                descentProgress={descentProgress}
                overlayProgress={overlayProgress}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="no-jump-quote-section relative z-20 hidden px-6 pt-12 xl:block xl:px-10">
        <div className="mx-auto max-w-5xl">
          <NoJumpFinalText
            chapter={chapter}
            progress={1}
            quoteSourceLabel={quoteSourceLabel}
          />
        </div>
      </div>
      <NoJumpFindingSummary
        chapter={chapter}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
      />
    </section>
  );
}

function NoJumpImage({
  chapter,
  locale,
  descentProgress,
  overlayProgress,
}: {
  chapter: FindingChapter;
  locale: Locale;
  descentProgress: number;
  overlayProgress: number;
}) {
  if (!chapter.image) {
    return null;
  }

  return (
    <figure
      className="no-jump-media relative my-auto aspect-[16/10] min-h-[34rem] overflow-hidden bg-surface"
      style={{
        transform: `translate3d(${interpolate(descentProgress, 0, 1, 0, -18)}px, 0, 0)`,
      }}
    >
      <Image
        src={chapter.image.src}
        alt={chapter.image.alt}
        fill
        sizes="(max-width: 768px) 100vw, 62vw"
        className="object-cover"
        style={{ objectPosition: "50% 48%" }}
        priority={false}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--background)_52%,transparent),transparent_32%,transparent_78%,color-mix(in_srgb,var(--background)_28%,transparent))]" />
      <div
        className="absolute inset-0 bg-background"
        style={{ opacity: overlayProgress * 0.68 }}
        aria-hidden="true"
      />
      <div
        className="no-jump-overlay absolute inset-0 flex items-center justify-center px-8 text-center text-primary"
        style={{
          opacity: overlayProgress,
          transform: `translate3d(0, ${interpolate(overlayProgress, 0, 1, 22, 0)}px, 0)`,
        }}
      >
        <div className="max-w-[31rem]">
          <p className="no-jump-overlay-title text-[clamp(3.4rem,7vw,6.6rem)] font-semibold uppercase leading-none tracking-[0.04em]">
            NO-GO
          </p>
          <p className="no-jump-overlay-copy mt-6 whitespace-pre-line text-base leading-7 text-primary/82 sm:text-lg">
            {noJumpCopy[locale].transition}
          </p>
        </div>
      </div>
    </figure>
  );
}

function NoJumpConditionList({
  layers,
  locale,
  activeCondition,
  hiddenAmount,
  mobileSolid,
}: {
  layers: string[];
  locale: Locale;
  activeCondition: number;
  hiddenAmount: number;
  mobileSolid?: boolean;
}) {
  const bodies = conditionBodies[locale];

  return (
    <ol
      className="no-jump-list mt-8 grid max-w-[34rem] gap-2.5 transition-opacity duration-500 ease-out motion-reduce:transition-none"
      style={{ opacity: mobileSolid ? 1 : 1 - hiddenAmount * 0.72 }}
      aria-label="No-go conditions"
    >
      {layers.map((layer, index) => {
        const isActive = index === activeCondition;
        const isPast = index < activeCondition;

        return (
          <li
            key={layer}
            className={[
              "no-jump-row grid grid-cols-[2.4rem_1fr] gap-3 border-b border-border/46 pb-3",
              isActive ? "is-active" : isPast ? "is-past" : "is-upcoming",
            ].join(" ")}
            style={{
              opacity: mobileSolid ? 1 : isActive ? 1 : 0.72,
            }}
            aria-current={isActive ? "step" : undefined}
          >
            <span
              className={[
                "text-xs font-semibold",
                mobileSolid
                  ? "text-foreground"
                  : isActive
                    ? "text-primary"
                    : "text-foreground",
              ].join(" ")}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p
                className={[
                  "text-sm font-semibold uppercase tracking-[0.12em]",
                  mobileSolid
                    ? "text-foreground"
                    : isActive
                      ? "text-foreground"
                      : "text-foreground",
                ].join(" ")}
              >
                {layer}
              </p>
              <p
                className={
                  mobileSolid
                    ? "no-jump-row-body mt-1.5 text-sm leading-6 text-foreground"
                    : "no-jump-row-body mt-1.5 text-sm leading-6 text-foreground"
                }
              >
                {bodies[index]}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function NoJumpFinalText({
  chapter,
  progress,
  quoteSourceLabel,
}: {
  chapter: FindingChapter;
  progress: number;
  quoteSourceLabel: string;
}) {
  return (
    <div
      className="no-jump-final-text mt-4 max-w-[34rem]"
      style={{
        opacity: progress,
        transform: `translate3d(0, ${interpolate(progress, 0, 1, 12, 0)}px, 0)`,
      }}
    >
      {chapter.quote ? (
        <FindingsQuote
          quote={chapter.quote}
          source={chapter.quoteSource ?? quoteSourceLabel}
          className="[&_blockquote]:text-xl [&_blockquote]:leading-tight [&_blockquote]:sm:text-2xl"
        />
      ) : null}
    </div>
  );
}

function MobileNoJumpDecision({
  chapter,
  locale,
  layers,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
  quoteSourceLabel,
}: NoJumpDecisionSectionProps & {
  layers: string[];
}) {
  return (
    <div className="findings-flow-layout px-4 py-[var(--section-gap-standard)] sm:px-6 xl:hidden">
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
      {chapter.image ? (
        <figure className="relative mt-10 aspect-[4/5] overflow-hidden bg-surface">
          <Image
            src={chapter.image.src}
            alt={chapter.image.alt}
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: "50% 48%" }}
          />
          <div className="absolute inset-0 bg-background/70" aria-hidden="true" />
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-primary">
            <div className="max-w-[31rem]">
              <p className="text-5xl font-semibold uppercase leading-none tracking-[0.04em]">
                NO-GO
              </p>
              <p className="mt-5 whitespace-pre-line text-base leading-7 text-primary/82">
                {noJumpCopy[locale].transition}
              </p>
            </div>
          </div>
        </figure>
      ) : null}
      <NoJumpConditionList
        layers={layers}
        locale={locale}
        activeCondition={layers.length - 1}
        hiddenAmount={0}
        mobileSolid
      />
      <div className="mt-10 border-l border-primary pl-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          {noJumpCopy[locale].noGo}
        </p>
        <NoJumpFinalText
          chapter={chapter}
          progress={1}
          quoteSourceLabel={quoteSourceLabel}
        />
      </div>
      <NoJumpFindingSummary
        chapter={chapter}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
        className="mt-12 block px-0 pb-0"
      />
    </div>
  );
}

function ReducedMotionNoJumpDecision({
  chapter,
  locale,
  layers,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
  quoteSourceLabel,
}: NoJumpDecisionSectionProps & {
  layers: string[];
}) {
  return (
    <section
      id={chapter.id}
      aria-labelledby={`${chapter.id}-title`}
      className="scroll-mt-24 bg-background px-4 py-[var(--section-gap-standard)] sm:px-6 xl:px-10"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.38fr_0.62fr]">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            {chapter.eyebrow}
          </p>
          <SectionTitle id={`${chapter.id}-title`} size="interviewSplit">
            {chapter.title}
          </SectionTitle>
          <p className="mt-8 max-w-[38ch] text-base leading-7 text-foreground/64">
            {chapter.summary}
          </p>
          <NoJumpConditionList
            layers={layers}
            locale={locale}
            activeCondition={layers.length - 1}
            hiddenAmount={0}
          />
          <NoJumpFinalText
            chapter={chapter}
            progress={1}
            quoteSourceLabel={quoteSourceLabel}
          />
        </header>
        <NoJumpImage
          chapter={chapter}
          locale={locale}
          descentProgress={1}
          overlayProgress={1}
        />
      </div>
      <NoJumpFindingSummary
        chapter={chapter}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
      />
    </section>
  );
}

function NoJumpFindingSummary({
  chapter,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
  className = "relative z-20 hidden px-6 pt-12 pb-[var(--section-gap-standard)] xl:block xl:px-10",
}: Omit<NoJumpDecisionSectionProps, "locale" | "quoteSourceLabel"> & {
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

function getActiveCondition(progress: number, count: number) {
  if (count <= 0) {
    return 0;
  }

  const sequenceProgress = interpolate(progress, 0.12, 0.72, 0, 1);

  return Math.min(count - 1, Math.floor(sequenceProgress * count));
}
