"use client";

import { useEffect, useRef, useState } from "react";

import { SectionTitle } from "@/components/athletes/SectionTitle";
import type { Locale } from "@/i18n/config";
import type { FindingChapter } from "@/types/findings";

type SynthesisSectionProps = {
  chapter: FindingChapter;
  locale: Locale;
};

const MODEL_REVEAL_DELAY = 700;
const MODEL_STAGGER = 420;
const EXAMPLES_REVEAL_DELAY = MODEL_REVEAL_DELAY + MODEL_STAGGER * 5 + 650;

export function SynthesisSection({ chapter, locale }: SynthesisSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasEntered, setHasEntered] = useState(false);
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
      if (motionQuery.matches) {
        setHasEntered(true);
      }
    }

    updateReducedMotion();
    motionQuery.addEventListener("change", updateReducedMotion);

    return () => {
      motionQuery.removeEventListener("change", updateReducedMotion);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || reducedMotion || hasEntered) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      const timer = globalThis.setTimeout(() => {
        setHasEntered(true);
      }, 0);

      return () => {
        globalThis.clearTimeout(timer);
      };
    }

    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [hasEntered, reducedMotion]);

  return (
    <section
      id={chapter.id}
      ref={sectionRef}
      aria-labelledby={`${chapter.id}-title`}
      className="scroll-mt-24 border-t border-border px-4 py-[var(--section-gap-immersive)] sm:px-6 xl:px-10"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
        <header className="min-w-0 lg:sticky lg:top-24 lg:max-h-[calc(100svh-7rem)] lg:self-start">
          <p
            className={revealClass(hasEntered)}
            style={{ animationDelay: "0ms" }}
          >
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              {chapter.eyebrow}
            </span>
          </p>
          <div
            className={revealClass(hasEntered)}
            style={{ animationDelay: "120ms" }}
          >
            <SectionTitle id={`${chapter.id}-title`} size="interviewSplit">
              {chapter.title}
            </SectionTitle>
          </div>
          <p
            className={[
              "mt-8 max-w-[38ch] text-lg leading-8 text-foreground/76",
              revealClass(hasEntered),
            ].join(" ")}
            style={{ animationDelay: "370ms" }}
          >
            {chapter.summary}
          </p>
        </header>

        <div className="min-w-0">
          <SynthesisModel chapter={chapter} hasEntered={hasEntered} />
          <SynthesisExamples chapter={chapter} hasEntered={hasEntered} locale={locale} />
        </div>
      </div>
    </section>
  );
}

function SynthesisModel({
  chapter,
  hasEntered,
}: {
  chapter: FindingChapter;
  hasEntered: boolean;
}) {
  return (
    <div className="relative">
      <ol className="relative grid gap-5" aria-label={chapter.navLabel}>
        <span
          className="absolute left-6 top-8 hidden h-[calc(100%-4rem)] w-px bg-border/70 sm:block"
          aria-hidden="true"
        />
        {chapter.states?.map((state, index) => {
          const isCore = index === 2;

          return (
            <li
              key={state.title}
              className={[
                "relative grid gap-4 border bg-surface/50 p-5 sm:grid-cols-[4rem_1fr] sm:p-6",
                isCore
                  ? "border-primary/60 bg-background/72"
                  : "border-border/78",
                revealClass(hasEntered),
              ].join(" ")}
              style={{ animationDelay: `${MODEL_REVEAL_DELAY + index * MODEL_STAGGER}ms` }}
            >
              <div className="relative z-10 flex h-12 w-12 items-center justify-center border border-primary bg-background text-sm font-semibold tracking-[0.18em] text-primary">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className={isCore ? "py-1" : ""}>
                <h3
                  className={[
                    "text-2xl font-semibold uppercase leading-tight",
                    isCore ? "text-foreground" : "text-foreground/88",
                  ].join(" ")}
                >
                  {state.title}
                </h3>
                <p className="mt-3 max-w-[48ch] leading-7 text-foreground/72">
                  {state.body}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
      <p
        className={[
          "mt-8 max-w-[58ch] border-l border-primary pl-5 leading-7 text-foreground/70",
          revealClass(hasEntered),
        ].join(" ")}
        style={{ animationDelay: `${EXAMPLES_REVEAL_DELAY - 250}ms` }}
      >
        {chapter.accessibleSummary}
      </p>
    </div>
  );
}

function SynthesisExamples({
  chapter,
  hasEntered,
  locale,
}: {
  chapter: FindingChapter;
  hasEntered: boolean;
  locale: Locale;
}) {
  const label = locale === "de" ? "In der Praxis" : "In practice";

  return (
    <div
      className={[
        "mt-12",
        revealClass(hasEntered),
      ].join(" ")}
      style={{ animationDelay: `${EXAMPLES_REVEAL_DELAY}ms` }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        {label}
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {chapter.paths?.map((path) => (
          <article key={path.title} className="border border-border/72 bg-background/42 p-4">
            <h3 className="text-base font-semibold uppercase leading-snug tracking-[0.08em] text-foreground">
              {path.title}
            </h3>
            <p className="mt-4 text-sm leading-6 text-foreground/68">
              {path.steps.join(" -> ")}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

function revealClass(hasEntered: boolean) {
  return hasEntered
    ? "motion-safe:animate-[fade-in-up_430ms_ease-out_forwards]"
    : "motion-safe:translate-y-5 motion-safe:opacity-0";
}
