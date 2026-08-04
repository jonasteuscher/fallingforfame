"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  getActiveMediaVisibilityState,
  getMediaVisibilityStateOpacity,
  interpolate,
  mediaVisibilityStateRanges,
} from "@/components/findings/mediaVisibilitySequence";
import { FindingsQuote } from "@/components/findings/FindingsQuote";
import type {
  FindingChapter,
  MediaVisibilityState,
  MediaVisibilityStateId,
} from "@/types/findings";

type FindingsVisibilitySequenceProps = {
  chapter: FindingChapter;
  sourcePrefix: string;
  empiricalLabel: string;
  interpretationLabel: string;
  quoteSourceLabel: string;
};

export function FindingsVisibilitySequence({
  chapter,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
  quoteSourceLabel,
}: FindingsVisibilitySequenceProps) {
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

  const sequence = chapter.visibilitySequence;
  const states = useMemo(
    () => sequence?.states ?? normalizeLegacyStates(chapter),
    [chapter, sequence?.states],
  );

  if (!sequence || states.length === 0) {
    return null;
  }

  if (reducedMotion) {
    return (
      <ReducedMotionVisibilitySequence
        chapter={chapter}
        states={states}
        media={sequence.media}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
        quoteSourceLabel={quoteSourceLabel}
      />
    );
  }

  const activeId = getActiveMediaVisibilityState(progress);

  function scrollToState(stateId: MediaVisibilityStateId) {
    if (typeof window === "undefined") {
      return;
    }

    const section = sectionRef.current;
    const range = mediaVisibilityStateRanges.find((item) => item.id === stateId);

    if (!section || !range) {
      return;
    }

    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const scrubDistance = section.offsetHeight - window.innerHeight;
    const top = sectionTop + scrubDistance * range.peakStart;
    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  }

  return (
    <section
      id={chapter.id}
      ref={sectionRef}
      aria-labelledby={`${chapter.id}-title`}
      className="relative scroll-mt-24 border-t border-border md:h-[460svh] md:min-h-[2800px]"
    >
      <h2 id={`${chapter.id}-title`} className="sr-only">
        {chapter.title}
      </h2>
      <p className="sr-only">{chapter.accessibleSummary}</p>
      <MobileVisibilitySequence
        chapter={chapter}
        states={states}
        media={sequence.media}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
        quoteSourceLabel={quoteSourceLabel}
      />

      <div className="sticky top-14 hidden h-[calc(100svh-3.5rem)] overflow-hidden bg-background md:block">
        <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-6 py-10 xl:px-10">
          <header className="relative z-10 mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              {chapter.eyebrow}
            </p>
            <p
              aria-hidden="true"
              className="mt-3 max-w-[66rem] text-[clamp(3rem,5vw,6.65rem)] font-semibold uppercase leading-[0.9] text-foreground [text-wrap:balance]"
            >
              {chapter.title}
            </p>
          </header>

          <div className="grid items-start gap-12 lg:grid-cols-[minmax(280px,0.54fr)_minmax(700px,1.46fr)]">
            <div className="relative z-10 max-w-[34rem]">
              <ol className="grid gap-3" aria-label={chapter.title}>
                {states.map((state, index) => {
                  const range = mediaVisibilityStateRanges[index];
                  const stateOpacity = range
                    ? getMediaVisibilityStateOpacity(progress, range)
                    : state.id === activeId
                      ? 1
                      : 0;
                  const isActive = state.id === activeId;

                  return (
                    <li key={state.id}>
                      <button
                        type="button"
                        aria-current={isActive ? "step" : undefined}
                        aria-pressed={isActive}
                        onClick={() => scrollToState(state.id)}
                        className={[
                          "grid w-full grid-cols-[2.5rem_1fr] gap-4 border-l-2 py-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none",
                          isActive
                            ? "border-primary text-foreground"
                            : "border-border text-foreground/46 hover:text-foreground/72",
                        ].join(" ")}
                      >
                        <span className="pl-4 text-xs font-semibold text-primary">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>
                          <span className="block text-lg font-semibold uppercase tracking-[0.08em]">
                            {state.title}
                          </span>
                          <span
                            className="mt-3 block max-w-[31rem] text-base leading-7 text-foreground/76"
                            style={{
                              opacity: Math.max(stateOpacity, isActive ? 1 : 0),
                              transform: `translate3d(0, ${interpolate(stateOpacity, 0, 1, 16, 0)}px, 0)`,
                            }}
                          >
                            {isActive ? state.body : ""}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>

              {chapter.quote ? (
                <div
                  style={{
                    opacity: getMediaVisibilityStateOpacity(
                      progress,
                      mediaVisibilityStateRanges[2],
                    ),
                  }}
                >
                  <FindingsQuote
                    quote={chapter.quote}
                    source={chapter.quoteSource ?? quoteSourceLabel}
                    className="mt-8 [&_blockquote]:text-2xl [&_figcaption]:mt-3"
                  />
                </div>
              ) : null}
            </div>

            <div>
              <MediaVisibilityFrame
                activeId={activeId}
                progress={progress}
                states={states}
                media={sequence.media}
              />
              <div
                className="mt-5"
                style={{
                  opacity: interpolate(progress, 0.9, 1, 0, 1),
                  transform: `translate3d(0, ${interpolate(progress, 0.9, 1, 20, 0)}px, 0)`,
                }}
              >
                <VisibilityFindingSummary
                  chapter={chapter}
                  sourcePrefix={sourcePrefix}
                  empiricalLabel={empiricalLabel}
                  interpretationLabel={interpretationLabel}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MediaVisibilityFrame({
  activeId,
  progress,
  states,
  media,
}: {
  activeId: MediaVisibilityStateId;
  progress: number;
  states: MediaVisibilityState[];
  media: { src: string; alt: string; objectPosition?: string };
}) {
  const frameScale = interpolate(progress, 0.08, 0.92, 1, 1.025);
  const state = states.find((item) => item.id === activeId) ?? states[0];

  return (
    <figure className="relative aspect-[16/10] overflow-hidden border border-border bg-surface shadow-[0_30px_100px_color-mix(in_srgb,var(--background)_76%,black)]">
      <Image
        src={media.src}
        alt={media.alt}
        fill
        loading="eager"
        sizes="(max-width: 1024px) 100vw, 64vw"
        className="object-cover"
        style={{
          objectPosition: media.objectPosition ?? "48% 36%",
          transform: `scale(${frameScale})`,
        }}
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--background)_34%,transparent)_0%,color-mix(in_srgb,var(--background)_30%,transparent)_42%,color-mix(in_srgb,var(--background)_64%,transparent)_100%)]"
        aria-hidden="true"
      />

      {states.map((item, index) => {
        const range = mediaVisibilityStateRanges[index];
        const opacity = range ? getMediaVisibilityStateOpacity(progress, range) : 0;

        return (
          <div
            key={item.id}
            className="absolute inset-0"
            style={{ opacity }}
            aria-hidden={item.id !== activeId}
          >
            <StateOverlay state={item} />
          </div>
        );
      })}

      <figcaption className="absolute bottom-5 left-5 max-w-[28rem]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          {state.overlayLabel}
        </p>
        <p className="mt-2 text-xl font-semibold leading-tight text-foreground [text-shadow:0_2px_24px_var(--background)]">
          {state.visualStatement}
        </p>
      </figcaption>
    </figure>
  );
}

function StateOverlay({ state }: { state: MediaVisibilityState }) {
  if (state.id === "learning") {
    return (
      <>
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <path
            d="M78 23 C70 26 61 33 52 43 C45 52 39 61 33 72"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeDasharray="1.5 2"
          />
          <circle cx="78" cy="23" r="1.1" fill="var(--primary)" />
          <circle cx="52" cy="43" r="0.85" fill="var(--primary)" />
          <circle cx="33" cy="72" r="1.1" fill="var(--primary)" />
        </svg>
        {state.annotations?.map((annotation, index) => (
          <span
            key={annotation.id}
            className="absolute max-w-[10rem] text-xs font-semibold uppercase tracking-[0.14em] text-foreground/82 [text-shadow:0_1px_18px_var(--background)]"
            style={{
              left: `${annotation.x}%`,
              top: `${annotation.y}%`,
              transform: annotation.align === "right" ? "translateX(-100%)" : undefined,
            }}
          >
            <span className={index === 0 ? "text-primary" : "text-foreground/82"}>
              {annotation.label}
            </span>
          </span>
        ))}
      </>
    );
  }

  return (
    <div className="absolute right-5 top-5 grid max-w-[15rem] gap-2 text-right">
      {state.overlayItems?.slice(0, 2).map((item) => (
        <span
          key={item}
          className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/78 [text-shadow:0_2px_18px_var(--background)]"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function MobileVisibilitySequence({
  chapter,
  states,
  media,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
  quoteSourceLabel,
}: {
  chapter: FindingChapter;
  states: MediaVisibilityState[];
  media: { src: string; alt: string; objectPosition?: string };
  sourcePrefix: string;
  empiricalLabel: string;
  interpretationLabel: string;
  quoteSourceLabel: string;
}) {
  const mobileTitle = chapter.title.replace(
    "Selbstdarstellung",
    "Selbstdarstel\u00adlung",
  );
  const learningState = states.find((state) => state.id === "learning") ?? states[0];

  return (
    <div className="px-4 py-[var(--section-gap-standard)] sm:px-6 md:hidden">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
        {chapter.eyebrow}
      </p>
      <p
        aria-hidden="true"
        className="mt-4 max-w-full text-[clamp(2.45rem,10.2vw,3.8rem)] font-semibold uppercase leading-[0.92] text-foreground [hyphens:auto] [overflow-wrap:normal] [text-wrap:balance]"
      >
        {mobileTitle}
      </p>
      <p className="mt-6 text-lg leading-8 text-foreground/76">{chapter.summary}</p>
      <figure className="relative mt-10 aspect-[4/3] overflow-hidden border border-border bg-surface">
        <Image
          src={media.src}
          alt={media.alt}
          fill
          loading="eager"
          sizes="(max-width: 767px) calc(100vw - 2rem), 100vw"
          className="object-cover"
          style={{ objectPosition: media.objectPosition ?? "58% 34%" }}
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--background)_22%,transparent)_0%,color-mix(in_srgb,var(--background)_18%,transparent)_44%,color-mix(in_srgb,var(--background)_58%,transparent)_100%)]"
          aria-hidden="true"
        />
        {learningState ? (
          <div className="absolute inset-0 opacity-90" aria-hidden="true">
            <StateOverlay state={learningState} />
          </div>
        ) : null}
        <figcaption className="absolute inset-x-4 bottom-4">
          <ol className="grid grid-cols-2 gap-x-4 gap-y-2">
            {states.map((state, index) => (
              <li
                key={state.id}
                className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-foreground/82 [text-shadow:0_2px_18px_var(--background)]"
              >
                <span className="text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>{" "}
                {state.title}
              </li>
            ))}
          </ol>
        </figcaption>
      </figure>
      <ol className="mt-9 grid gap-6">
        {states.map((state, index) => (
          <li
            key={state.id}
            className="grid grid-cols-[2.5rem_1fr] gap-4 border-l border-border py-1"
          >
            <span className="pl-4 text-xs font-semibold text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="text-xl font-semibold uppercase leading-tight text-foreground">
                {state.title}
              </h3>
              <p className="mt-3 leading-7 text-foreground/76">{state.body}</p>
            </div>
          </li>
        ))}
      </ol>
      {chapter.quote ? (
        <FindingsQuote
          quote={chapter.quote}
          source={chapter.quoteSource ?? quoteSourceLabel}
          className="mt-12 [&_blockquote]:text-2xl"
        />
      ) : null}
      <VisibilityFindingSummary
        chapter={chapter}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
        className="mt-10"
      />
    </div>
  );
}

function ReducedMotionVisibilitySequence({
  chapter,
  states,
  media,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
  quoteSourceLabel,
}: {
  chapter: FindingChapter;
  states: MediaVisibilityState[];
  media: { src: string; alt: string; objectPosition?: string };
  sourcePrefix: string;
  empiricalLabel: string;
  interpretationLabel: string;
  quoteSourceLabel: string;
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
          className="mt-4 max-w-5xl text-[clamp(3rem,8vw,7rem)] font-semibold uppercase leading-[0.9] text-foreground"
        >
          {chapter.title}
        </h2>
        <p className="mt-6 max-w-reading text-lg leading-8 text-foreground/76">
          {chapter.summary}
        </p>
        <figure className="relative mt-10 aspect-video overflow-hidden border border-border bg-surface">
          <Image
            src={media.src}
            alt={media.alt}
            fill
            loading="eager"
            sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1279px) calc(100vw - 3rem), 80rem"
            className="object-cover"
            style={{ objectPosition: media.objectPosition ?? "48% 36%" }}
          />
        </figure>
        <ol className="mt-10 grid gap-5 md:grid-cols-2">
          {states.map((state) => (
            <li key={state.id} className="border border-border bg-surface/52 p-5">
              <h3 className="text-xl font-semibold uppercase text-foreground">
                {state.title}
              </h3>
              <p className="mt-3 leading-7 text-foreground/76">{state.body}</p>
            </li>
          ))}
        </ol>
        {chapter.quote ? (
          <FindingsQuote
            quote={chapter.quote}
            source={chapter.quoteSource ?? quoteSourceLabel}
            className="mt-10 [&_blockquote]:text-2xl"
          />
        ) : null}
        <VisibilityFindingSummary
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

function VisibilityFindingSummary({
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
        "ml-auto max-w-[48rem] border border-border bg-background/82 p-5 shadow-[0_24px_80px_color-mix(in_srgb,var(--background)_72%,black)] backdrop-blur-sm sm:p-6",
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

function normalizeLegacyStates(chapter: FindingChapter): MediaVisibilityState[] {
  const ids: MediaVisibilityStateId[] = [
    "discovery",
    "inspiration",
    "learning",
    "reflection",
  ];

  return ids.map((id, index) => ({
    id,
    title: chapter.states?.[index]?.title ?? id,
    body: chapter.states?.[index]?.body ?? "",
    overlayLabel: chapter.states?.[index]?.title ?? id,
    visualStatement: chapter.states?.[index]?.body ?? "",
    overlayItems: [],
  }));
}
