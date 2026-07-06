"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import type { AthleteExperience } from "@/types/athlete";

const EXPERIENCE_REFERENCE_YEAR = 2026;

type AthleteExperienceLabels = {
  unknown: string;
  yes: string;
  no: string;
  labels: Record<keyof AthleteExperience, string>;
};

type AthleteExperienceCardsProps = {
  experience: AthleteExperience;
  labels: AthleteExperienceLabels;
  locale: string;
};

type Milestone = {
  id: string;
  title: string;
  eyebrow: string;
  body: string;
  value: number | null;
  valuePrefix?: string;
  valueSuffix?: string;
  countStart?: number;
  fallback?: string;
  detail?: string;
  ungroupedValue?: boolean;
};

type LocaleCopy = {
  foundationTitle: string;
  foundationBody: string;
  skydivesTitle: string;
  skydivesBody: string;
  enteringBaseTitle: string;
  enteringBaseBody: string;
  baseExperienceTitle: string;
  baseExperienceBody: string;
  visibilityTitle: string;
  visibilityBody: string;
  journeyLabel: string;
  journeyPathLabel: string;
  seasonsSuffix: string;
  jumpsSuffix: string;
  sincePrefix: string;
  sinceEyebrow: string;
  baseSeasonsDetail: (value: string) => string;
};

const copy: Record<string, LocaleCopy> = {
  en: {
    foundationTitle: "Skydiving Foundation",
    foundationBody:
      "The foundation where canopy control, body flight and decision making were developed.",
    skydivesTitle: "Skydives",
    skydivesBody:
      "Hundreds of repetitions built consistency, confidence and technical precision.",
    enteringBaseTitle: "Entering BASE",
    enteringBaseBody:
      "The transition from aircraft to fixed objects introduced an entirely different level of planning and commitment.",
    baseExperienceTitle: "BASE Experience",
    baseExperienceBody:
      "Experience is shaped not only by jump count, but by time in terrain, conditions and countless decisions.",
    visibilityTitle: "Public Visibility",
    visibilityBody:
      "Social media extends the athlete's reach while also influencing opportunities, expectations and sponsorship.",
    journeyLabel: "Journey through experience",
    journeyPathLabel: "Progress through the athlete's experience milestones",
    seasonsSuffix: " Seasons",
    jumpsSuffix: "+",
    sincePrefix: "Since ",
    sinceEyebrow: "BASE Jumper Since",
    baseSeasonsDetail: (value) => `${value} BASE seasons`,
  },
  de: {
    foundationTitle: "Skydive Grundlage",
    foundationBody:
      "Die Grundlage, auf der Canopy Control, Körperflug und Entscheidungsfähigkeit entwickelt wurden.",
    skydivesTitle: "Skydives",
    skydivesBody:
      "Hunderte von Wiederholungen schaffen Konstanz, Vertrauen und technische Präzision.",
    enteringBaseTitle: "Einstieg ins BASE",
    enteringBaseBody:
      "Der Wechsel vom Flugzeug zu festen Objekten brachte eine andere Ebene von Planung und Verbindlichkeit.",
    baseExperienceTitle: "BASE Erfahrung",
    baseExperienceBody:
      "Erfahrung entsteht nicht nur durch Sprungzahlen, sondern durch Zeit im Gelände, Bedingungen und unzählige Entscheidungen.",
    visibilityTitle: "Öffentliche Sichtbarkeit",
    visibilityBody:
      "Social Media erweitert die Reichweite des Athleten und beeinflusst zugleich Chancen, Erwartungen und Sponsoring.",
    journeyLabel: "Erfahrungsweg",
    journeyPathLabel: "Fortschritt durch die Erfahrungsstationen des Athleten",
    seasonsSuffix: " Saisons",
    jumpsSuffix: "+",
    sincePrefix: "Seit ",
    sinceEyebrow: "BASE Jumper seit",
    baseSeasonsDetail: (value) => `${value} BASE Saisons`,
  },
};

export function AthleteExperienceCards({
  experience,
  labels,
  locale,
}: AthleteExperienceCardsProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const milestoneRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleIndexes, setVisibleIndexes] = useState<Set<number>>(
    () => new Set([0]),
  );
  const [pathProgress, setPathProgress] = useState(0);
  const localeCopy = copy[locale] ?? copy.en;

  const milestones = useMemo(
    () => createMilestones(experience, labels, locale, localeCopy),
    [experience, labels, locale, localeCopy],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const prefersReducedMotion = prefersReducedMotionSetting();

    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      const frame = requestFrame(() => {
        setVisibleIndexes(new Set(milestones.map((_, index) => index)));
        setPathProgress(100);
      });

      return () => cancelFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (!visibleEntry) {
          return;
        }

        const nextIndex = Number(
          (visibleEntry.target as HTMLElement).dataset.milestoneIndex,
        );

        setActiveIndex(nextIndex);
        setVisibleIndexes((current) => {
          const next = new Set(current);
          for (let index = 0; index <= nextIndex; index += 1) {
            next.add(index);
          }
          return next;
        });
      },
      {
        rootMargin: "-35% 0px -45% 0px",
        threshold: [0.35, 0.6, 0.85],
      },
    );

    milestoneRefs.current.forEach((node) => {
      if (node) {
        observer.observe(node);
      }
    });

    return () => observer.disconnect();
  }, [milestones]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let frame: ReturnType<typeof requestFrame> = 0;

    const updateProgress = () => {
      const section = containerRef.current;

      if (!section) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewportAnchor = window.innerHeight * 0.52;
      const travel = Math.max(rect.height - window.innerHeight * 0.45, 1);
      const nextProgress = clamp(((viewportAnchor - rect.top) / travel) * 100, 0, 100);

      setPathProgress(nextProgress);
    };

    const onScroll = () => {
      cancelFrame(frame);
      frame = requestFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      aria-label="Athlete experience progression"
      className="relative border-y border-border bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_52%,transparent),color-mix(in_srgb,var(--background)_92%,var(--surface)))] px-4 py-12 sm:px-6 sm:py-16 xl:px-10"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-primary/45" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(14rem,0.58fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
        <div className="relative hidden lg:block lg:sticky lg:top-24 lg:min-h-[calc(100svh-6rem)]">
          <div className="flex min-h-[calc(100svh-6rem)] flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary">
              {localeCopy.journeyLabel}
            </p>
            <svg
              className="mt-10 h-[28rem] w-full text-primary"
              viewBox="0 0 220 460"
              role="img"
              aria-label={localeCopy.journeyPathLabel}
            >
              <path
                d="M38 24 C148 82 148 146 86 205 C34 255 58 318 174 368 C204 381 202 420 168 438"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.16"
                strokeWidth="1.5"
              />
              <path
                d="M38 24 C148 82 148 146 86 205 C34 255 58 318 174 368 C204 381 202 420 168 438"
                fill="none"
                pathLength="100"
                stroke="currentColor"
                strokeDasharray="100"
                strokeDashoffset={100 - pathProgress}
                strokeLinecap="round"
                strokeWidth="2"
                className="transition-[stroke-dashoffset] duration-300 ease-out motion-reduce:transition-none"
              />
              <circle
                cx="38"
                cy="24"
                r="4"
                fill="currentColor"
                opacity={activeIndex >= 0 ? 1 : 0.35}
              />
              <circle
                cx="86"
                cy="205"
                r="4"
                fill="currentColor"
                opacity={activeIndex >= 2 ? 1 : 0.25}
              />
              <circle
                cx="174"
                cy="368"
                r="4"
                fill="currentColor"
                opacity={activeIndex >= 4 ? 1 : 0.25}
              />
            </svg>
          </div>
        </div>

        <div className="relative">
          <div
            className="absolute bottom-0 left-3 top-0 w-px bg-border lg:hidden"
            aria-hidden="true"
          >
            <div
              className="w-px bg-primary transition-[height] duration-300 ease-out motion-reduce:transition-none"
              style={{ height: `${pathProgress}%` }}
            />
          </div>
          <ol className="relative space-y-8 lg:space-y-16">
          {milestones.map((milestone, index) => {
            const isActive = index === activeIndex;
            const isVisible = visibleIndexes.has(index);
            const isComplete = index < activeIndex;

            return (
              <li
                key={milestone.id}
                ref={(node) => {
                  milestoneRefs.current[index] = node;
                }}
                data-milestone-index={index}
                className={cn(
                  "relative pl-10 transition duration-700 ease-out motion-reduce:transition-none lg:grid lg:min-h-[44svh] lg:grid-cols-[0.18fr_minmax(0,1fr)] lg:items-center lg:gap-10 lg:pl-0",
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-35",
                )}
              >
                <div
                  className={cn(
                    "absolute left-0 top-2 grid size-6 place-items-center rounded-full border bg-background transition lg:static lg:size-10",
                    isActive && "border-primary shadow-[0_0_24px_color-mix(in_srgb,var(--primary)_50%,transparent)]",
                    isComplete && "border-primary/75 bg-primary/15",
                    !isActive && !isComplete && "border-border",
                  )}
                  aria-hidden="true"
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full transition lg:size-2",
                      isActive || isComplete ? "bg-primary" : "bg-foreground/28",
                    )}
                  />
                </div>

                <article
                  aria-current={isActive ? "step" : undefined}
                  className={cn(
                    "border-l py-3 pl-5 transition duration-500 lg:max-w-3xl lg:py-9 lg:pl-9",
                    isActive && "border-primary",
                    isComplete && "border-primary/45",
                    !isActive && !isComplete && "border-border",
                  )}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground/52">
                    {milestone.eyebrow}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold leading-tight text-foreground sm:text-3xl lg:text-4xl">
                    {milestone.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-5 text-5xl font-semibold leading-none tracking-normal transition-colors sm:text-6xl lg:text-8xl",
                      isActive || isComplete ? "text-primary" : "text-foreground",
                    )}
                  >
                    <MilestoneValue
                      value={milestone.value}
                      prefix={milestone.valuePrefix}
                      suffix={milestone.valueSuffix}
                      fallback={milestone.fallback ?? labels.unknown}
                      countStart={milestone.countStart}
                      isVisible={isVisible}
                      locale={locale}
                      ungroupedValue={milestone.ungroupedValue}
                    />
                  </p>
                  {milestone.detail ? (
                    <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-foreground/48">
                      {milestone.detail}
                    </p>
                  ) : null}
                  <p className="mt-5 max-w-2xl text-base leading-7 text-foreground/72 sm:text-lg sm:leading-8">
                    {milestone.body}
                  </p>
                </article>
              </li>
            );
          })}
          </ol>
        </div>
      </div>
    </section>
  );
}

function createMilestones(
  experience: AthleteExperience,
  labels: AthleteExperienceLabels,
  locale: string,
  localeCopy: LocaleCopy,
): Milestone[] {
  const baseSince =
    experience.baseSeasons === null
      ? null
      : EXPERIENCE_REFERENCE_YEAR - experience.baseSeasons + 1;

  return [
    {
      id: "skydiving-foundation",
      title: localeCopy.foundationTitle,
      eyebrow: labels.labels.skydiveSeasons,
      body: localeCopy.foundationBody,
      value: experience.skydiveSeasons,
      valueSuffix: localeCopy.seasonsSuffix,
    },
    {
      id: "skydives",
      title: localeCopy.skydivesTitle,
      eyebrow: labels.labels.skydives,
      body: localeCopy.skydivesBody,
      value: experience.skydives,
      valueSuffix: localeCopy.jumpsSuffix,
    },
    {
      id: "entering-base",
      title: localeCopy.enteringBaseTitle,
      eyebrow: localeCopy.sinceEyebrow,
      body: localeCopy.enteringBaseBody,
      value: baseSince,
      valuePrefix: localeCopy.sincePrefix,
      countStart: baseSince ? Math.max(baseSince - 12, 0) : undefined,
      ungroupedValue: true,
      detail:
        experience.baseSeasons === null
          ? undefined
          : localeCopy.baseSeasonsDetail(
              formatNumber(experience.baseSeasons, locale),
            ),
    },
    {
      id: "base-experience",
      title: localeCopy.baseExperienceTitle,
      eyebrow: labels.labels.basejumps,
      body: localeCopy.baseExperienceBody,
      value: experience.basejumps,
      valueSuffix: localeCopy.jumpsSuffix,
    },
    {
      id: "public-visibility",
      title: localeCopy.visibilityTitle,
      eyebrow: labels.labels.socialMediaReach,
      body: localeCopy.visibilityBody,
      value: experience.socialMediaReach,
    },
  ];
}

function MilestoneValue({
  value,
  prefix = "",
  suffix = "",
  fallback,
  countStart,
  isVisible,
  locale,
  ungroupedValue = false,
}: {
  value: number | null;
  prefix?: string;
  suffix?: string;
  fallback: string;
  countStart?: number;
  isVisible: boolean;
  locale: string;
  ungroupedValue?: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(value === null ? null : countStart ?? 0);

  useEffect(() => {
    if (value === null || !isVisible || typeof window === "undefined") {
      return;
    }

    const shouldSkipCount =
      !("IntersectionObserver" in window) || prefersReducedMotionSetting();

    if (shouldSkipCount) {
      const frame = requestFrame(() => {
        setDisplayValue(value);
      });

      return () => cancelFrame(frame);
    }

    const startValue = countStart ?? 0;
    const duration = 950;
    const start = performance.now();
    let frame: ReturnType<typeof requestFrame> = 0;

    const tick = (time: number) => {
      const progress = clamp((time - start) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(startValue + (value - startValue) * eased));

      if (progress < 1) {
        frame = requestFrame(tick);
      }
    };

    frame = requestFrame(tick);

    return () => cancelFrame(frame);
  }, [countStart, isVisible, value]);

  if (value === null || displayValue === null) {
    return fallback;
  }

  return (
    <>
      {prefix}
      {ungroupedValue ? displayValue : formatNumber(displayValue, locale)}
      {suffix}
    </>
  );
}

function formatNumber(value: number, locale: string) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, locale === "de" ? "’" : ",");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function prefersReducedMotionSetting() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function requestFrame(callback: FrameRequestCallback) {
  if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
    return window.requestAnimationFrame(callback);
  }

  return globalThis.setTimeout(() => callback(performance.now()), 16);
}

function cancelFrame(frame: number | ReturnType<typeof globalThis.setTimeout>) {
  if (typeof window !== "undefined" && typeof window.cancelAnimationFrame === "function") {
    window.cancelAnimationFrame(Number(frame));
    return;
  }

  globalThis.clearTimeout(frame);
}
