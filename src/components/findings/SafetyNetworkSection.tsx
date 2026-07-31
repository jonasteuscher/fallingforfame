"use client";

import { useEffect, useRef, useState } from "react";

import { SectionTitle } from "@/components/athletes/SectionTitle";
import type { Locale } from "@/i18n/config";
import type { FindingChapter } from "@/types/findings";

type SafetyNetworkSectionProps = {
  chapter: FindingChapter;
  locale: Locale;
  sourcePrefix: string;
  empiricalLabel: string;
  interpretationLabel: string;
};

const NODE_REVEAL_DELAY = 650;
const NODE_STAGGER = 110;
const PANEL_REVEAL_DELAY = NODE_REVEAL_DELAY + NODE_STAGGER * 10 + 400;
const SUMMARY_REVEAL_DELAY = PANEL_REVEAL_DELAY + 600;

export function SafetyNetworkSection({
  chapter,
  locale,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
}: SafetyNetworkSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const isGerman = locale === "de";

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
      { threshold: 0.16, rootMargin: "0px 0px -12% 0px" },
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
      <div className="safety-network-inner mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
        <header className="safety-network-copy min-w-0 lg:sticky lg:top-24 lg:max-h-[calc(100svh-7rem)] lg:self-start">
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
            style={{ animationDelay: "90ms" }}
          >
            <SectionTitle id={`${chapter.id}-title`} size="interviewSplit">
              {chapter.title}
            </SectionTitle>
          </div>
          <p
            className={[
              "mt-7 max-w-reading text-lg leading-8 text-foreground/76",
              revealClass(hasEntered),
            ].join(" ")}
            style={{ animationDelay: "340ms" }}
          >
            {chapter.summary}
          </p>
        </header>

        <div className="safety-network-content min-w-0 space-y-8">
          <SafetyNetworkVisual
            chapter={chapter}
            isGerman={isGerman}
            hasEntered={hasEntered}
          />
          <SafetyNetworkSummary
            chapter={chapter}
            sourcePrefix={sourcePrefix}
            empiricalLabel={empiricalLabel}
            interpretationLabel={interpretationLabel}
            hasEntered={hasEntered}
          />
        </div>
      </div>
    </section>
  );
}

function SafetyNetworkVisual({
  chapter,
  isGerman,
  hasEntered,
}: {
  chapter: FindingChapter;
  isGerman: boolean;
  hasEntered: boolean;
}) {
  return (
    <div className="safety-network-visual space-y-6">
      <ul className="safety-network-nodes grid gap-3 sm:grid-cols-2 lg:grid-cols-5" aria-label={chapter.navLabel}>
        {chapter.layers?.map((node, index) => (
          <li
            key={node}
            tabIndex={0}
            aria-label={node}
            className={[
              "grid min-h-20 place-items-center border border-border bg-surface/54 p-3 text-center font-semibold uppercase leading-tight text-foreground/74 transition-colors duration-300 hover:border-foreground/34 hover:text-foreground focus-visible:border-primary focus-visible:text-foreground motion-reduce:opacity-100 motion-reduce:transform-none",
              "safety-network-node",
              hasEntered ? "network-node-reveal" : "motion-safe:translate-y-4 motion-safe:scale-[0.96] motion-safe:opacity-0",
              isGerman
                ? "px-3 text-[0.7rem] tracking-[0.08em] [hyphens:none] [overflow-wrap:normal] [text-wrap:balance] [word-break:normal]"
                : "text-xs tracking-[0.12em]",
            ].join(" ")}
            style={{ animationDelay: `${NODE_REVEAL_DELAY + index * NODE_STAGGER}ms` }}
            lang={isGerman ? "de" : "en"}
          >
            {isGerman ? renderGermanNetworkNode(node) : node}
          </li>
        ))}
      </ul>
      <div
        className={[
          "safety-network-state-grid grid items-stretch gap-5 md:grid-cols-2",
          revealClass(hasEntered),
        ].join(" ")}
        style={{ animationDelay: `${PANEL_REVEAL_DELAY}ms` }}
      >
        {[chapter.left, chapter.right].map((side) =>
          side ? (
            <article
              key={side.title}
              className="safety-network-state-card flex h-full min-h-[17.5rem] flex-col border border-border/92 bg-surface/58 p-5 sm:p-7"
            >
              <h3 className="text-2xl font-semibold uppercase leading-tight text-foreground">
                {isGerman ? renderGermanNetworkStateTitle(side.title) : side.title}
              </h3>
              <ul className={isGerman ? "mt-6 space-y-3.5" : "mt-6 space-y-3"}>
                {side.items.map((item) => (
                  <li
                    key={item}
                    className={isGerman ? "flex gap-3 text-sm leading-6 text-foreground/76" : "flex gap-3 text-foreground/76"}
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ) : null,
        )}
      </div>
    </div>
  );
}

function SafetyNetworkSummary({
  chapter,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
  hasEntered,
}: {
  chapter: FindingChapter;
  sourcePrefix: string;
  empiricalLabel: string;
  interpretationLabel: string;
  hasEntered: boolean;
}) {
  return (
    <aside
      className={[
        "safety-network-summary border border-border bg-background/72 p-5 sm:p-7",
        revealClass(hasEntered),
      ].join(" ")}
      style={{ animationDelay: `${SUMMARY_REVEAL_DELAY}ms` }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        {sourcePrefix}
      </p>
      <div className="mt-6 grid gap-7 md:grid-cols-[minmax(0,0.48fr)_minmax(0,0.52fr)]">
        <section aria-labelledby={`${chapter.id}-empirical-title`}>
          <h3
            id={`${chapter.id}-empirical-title`}
            className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/58"
          >
            {empiricalLabel}
          </h3>
          <p className="mt-4 whitespace-pre-line leading-7 text-foreground/78">
            {chapter.insight?.empirical ?? chapter.finding}
          </p>
        </section>
        <section aria-labelledby={`${chapter.id}-interpretation-title`}>
          <h3
            id={`${chapter.id}-interpretation-title`}
            className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/58"
          >
            {interpretationLabel}
          </h3>
          <p className="mt-4 leading-7 text-foreground/78">
            {chapter.insight?.interpretation ?? chapter.accessibleSummary}
          </p>
        </section>
      </div>
    </aside>
  );
}

function revealClass(hasEntered: boolean) {
  return hasEntered
    ? "network-reveal-up"
    : "motion-safe:translate-y-4 motion-safe:opacity-0";
}

function renderGermanNetworkNode(node: string) {
  const lineBreaks: Record<string, string[]> = {
    "erfahrene Community-Mitglieder": ["Erfahrene", "Community-", "Mitglieder"],
    "Beinaheunfall-Diskussionen": ["Beinahe-unfall-", "Diskussionen"],
    "Ausrüstungschecks": ["Ausrüstungs-", "Checks"],
    "Sprungpartner:innen": ["Sprung-", "partner:innen"],
  };
  const lines = lineBreaks[node];

  if (!lines) {
    return node;
  }

  return (
    <span>
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </span>
  );
}

function renderGermanNetworkStateTitle(title: string) {
  const lineBreaks: Record<string, string[]> = {
    "Unterstützender Zustand": ["Unterstützender", "Zustand"],
    "Ambivalenter Zustand": ["Ambivalenter", "Zustand"],
  };
  const lines = lineBreaks[title];

  if (!lines) {
    return title;
  }

  return (
    <>
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </>
  );
}
