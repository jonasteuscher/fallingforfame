"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import type { Locale } from "@/i18n/config";
import type { Athlete } from "@/types/athlete";

const EXPERIENCE_REFERENCE_YEAR = 2026;

type AthleteProfileOverviewLabels = {
  eyebrow: string;
  title: string;
  profession: string;
  role: string;
  disciplines: string;
  baseSince: string;
  baseJumps: string;
  skydives: string;
  reach: string;
  sponsorship: string;
  unknown: string;
  yes: string;
  no: string;
};

type AthleteProfileOverviewProps = {
  athlete: Athlete;
  locale: Locale;
  labels: AthleteProfileOverviewLabels;
  portraitAlt: string;
  portraitPlaceholder: string;
};

type ExperienceMetric = {
  id: string;
  label: string;
  displayValue: string;
  numericValue?: number;
  suffix?: string;
  ungrouped?: boolean;
};

export function AthleteProfileOverview({
  athlete,
  locale,
  labels,
  portraitAlt,
  portraitPlaceholder,
}: AthleteProfileOverviewProps) {
  const content = athlete.content[locale];
  const metrics = useMemo(
    () => createExperienceMetrics(athlete, locale, labels),
    [athlete, labels, locale],
  );

  return (
    <section
      aria-labelledby="profile-experience-title"
      className="border-b border-border px-4 py-16 sm:px-6 sm:py-20 xl:px-10 xl:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
          {labels.eyebrow}
        </p>
        <h2
          id="profile-experience-title"
          className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-foreground sm:text-6xl"
        >
          {labels.title}
        </h2>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1.12fr)_minmax(20rem,0.88fr)] lg:items-start xl:gap-16">
          <div className="grid min-w-0 gap-8 min-[860px]:grid-cols-[minmax(16rem,0.8fr)_minmax(0,1fr)] min-[860px]:items-start">
            <figure className="min-w-0">
              <div className="relative aspect-[4/5] overflow-hidden border border-border bg-surface-muted">
                {athlete.images.portrait ? (
                  <Image
                    src={athlete.images.portrait}
                    alt={portraitAlt}
                    fill
                    sizes="(min-width: 1280px) 28vw, (min-width: 860px) 36vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-end bg-[linear-gradient(145deg,var(--surface-muted)_0%,var(--surface)_48%,var(--background)_100%)] p-6">
                    <span className="max-w-40 text-sm font-semibold uppercase tracking-[0.22em] text-foreground/62">
                      {portraitPlaceholder}
                    </span>
                  </div>
                )}
              </div>
            </figure>

            <div className="min-w-0">
              <p className="max-w-reading text-lg leading-8 text-foreground/82">
                {content.shortBio}
              </p>

              <dl className="mt-8 grid gap-5 sm:grid-cols-2 min-[860px]:grid-cols-1 xl:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/54">
                    {labels.profession}
                  </dt>
                  <dd className="mt-2 break-words text-base font-semibold leading-7 text-foreground [overflow-wrap:anywhere]">
                    {content.profession}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/54">
                    {labels.role}
                  </dt>
                  <dd className="mt-2 break-words text-base font-semibold leading-7 text-foreground [overflow-wrap:anywhere]">
                    {content.role}
                  </dd>
                </div>
              </dl>

              <div className="mt-8">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/54">
                  {labels.disciplines}
                </h3>
                <ul className="mt-3 flex max-w-full flex-wrap gap-2">
                  {content.primaryDisciplines.map((discipline) => (
                    <li
                      key={discipline}
                      className="max-w-full break-words border border-border px-3 py-1.5 text-sm font-semibold leading-tight text-foreground/78 [overflow-wrap:anywhere]"
                    >
                      {discipline}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <AthleteExperienceStats metrics={metrics} />
        </div>
      </div>
    </section>
  );
}

function AthleteExperienceStats({ metrics }: { metrics: ExperienceMetric[] }) {
  const ref = useRef<HTMLDListElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!("IntersectionObserver" in window) || prefersReducedMotionSetting()) {
      const frame = requestFrame(() => setIsVisible(true));
      return () => cancelFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    const node = ref.current;

    if (node) {
      observer.observe(node);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <dl
      ref={ref}
      className="grid min-w-0 gap-x-8 border-y border-border min-[420px]:grid-cols-2 lg:mt-1"
    >
      {metrics.map((metric, index) => (
        <div
          key={metric.id}
          className="min-w-0 border-b border-border py-6 last:border-b-0 min-[420px]:odd:border-r min-[420px]:odd:pr-8 min-[420px]:even:pl-8 min-[420px]:[&:nth-last-child(-n+2)]:border-b-0"
        >
          <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/54">
            {metric.label}
          </dt>
          <dd
            className="mt-3 max-w-full break-words text-[clamp(2rem,4.2vw,3.75rem)] font-semibold leading-none text-foreground [overflow-wrap:anywhere] transition duration-700 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(0.75rem)",
              transitionDelay: `${index * 90}ms`,
            }}
          >
            <AnimatedStat metric={metric} isVisible={isVisible} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

function AnimatedStat({
  metric,
  isVisible,
}: {
  metric: ExperienceMetric;
  isVisible: boolean;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (metric.numericValue === undefined || !isVisible || typeof window === "undefined") {
      return;
    }

    if (prefersReducedMotionSetting()) {
      const frame = requestFrame(() => setValue(metric.numericValue ?? 0));
      return () => cancelFrame(frame);
    }

    const duration = 900;
    const start = performance.now();
    let frame: ReturnType<typeof requestFrame> = 0;

    const tick = (time: number) => {
      const progress = clamp((time - start) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(Math.round((metric.numericValue ?? 0) * eased));

      if (progress < 1) {
        frame = requestFrame(tick);
      }
    };

    frame = requestFrame(tick);

    return () => cancelFrame(frame);
  }, [isVisible, metric.numericValue]);

  if (metric.numericValue === undefined) {
    return <>{metric.displayValue}</>;
  }

  return (
    <>
      <span aria-hidden="true" className="whitespace-nowrap">
        {metric.ungrouped ? value : formatNumber(value, metric.displayValue)}
        {metric.suffix}
      </span>
      <span className="sr-only">{metric.displayValue}</span>
    </>
  );
}

function createExperienceMetrics(
  athlete: Athlete,
  locale: Locale,
  labels: AthleteProfileOverviewLabels,
): ExperienceMetric[] {
  const { experience } = athlete;
  const baseSince =
    experience.baseSeasons === null
      ? null
      : EXPERIENCE_REFERENCE_YEAR - experience.baseSeasons + 1;

  return [
    createNumericMetric(
      "base-since",
      labels.baseSince,
      baseSince,
      locale,
      labels.unknown,
      "",
      true,
    ),
    createNumericMetric(
      "base-jumps",
      labels.baseJumps,
      experience.basejumps,
      locale,
      labels.unknown,
      "+",
    ),
    createNumericMetric(
      "skydives",
      labels.skydives,
      experience.skydives,
      locale,
      labels.unknown,
      "+",
    ),
    createNumericMetric(
      "reach",
      labels.reach,
      experience.socialMediaReach,
      locale,
      labels.unknown,
      "+",
    ),
    {
      id: "sponsorship",
      label: labels.sponsorship,
      displayValue: formatSponsored(experience.sponsored, labels),
    },
  ];
}

function createNumericMetric(
  id: string,
  label: string,
  value: number | null,
  locale: Locale,
  fallback: string,
  suffix = "",
  ungrouped = false,
): ExperienceMetric {
  if (value === null) {
    return {
      id,
      label,
      displayValue: fallback,
    };
  }

  return {
    id,
    label,
    displayValue: `${ungrouped ? value : formatNumber(value, locale)}${suffix}`,
    numericValue: value,
    suffix,
    ungrouped,
  };
}

function formatSponsored(
  value: boolean | null,
  labels: Pick<AthleteProfileOverviewLabels, "unknown" | "yes" | "no">,
) {
  if (value === null) {
    return labels.unknown;
  }

  return value ? labels.yes : labels.no;
}

function formatNumber(value: number, localeOrDisplayValue: Locale | string) {
  const separator = localeOrDisplayValue === "de" || localeOrDisplayValue.includes("’")
    ? "’"
    : ",";

  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
