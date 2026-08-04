"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { FindingsQuote } from "@/components/findings/FindingsQuote";
import { interpolate } from "@/components/findings/mediaVisibilitySequence";
import type { FindingChapter } from "@/types/findings";

type SponsorshipSpectrumSectionProps = {
  chapter: FindingChapter;
  sourcePrefix: string;
  empiricalLabel: string;
  interpretationLabel: string;
  quoteSourceLabel: string;
};

export function SponsorshipSpectrumSection({
  chapter,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
  quoteSourceLabel,
}: SponsorshipSpectrumSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const spectrum = useMemo(() => chapter.spectrum ?? [], [chapter.spectrum]);
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
      <ReducedMotionSponsorship
        chapter={chapter}
        spectrum={spectrum}
        layers={layers}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
        quoteSourceLabel={quoteSourceLabel}
      />
    );
  }

  function scrollToStage(index: number) {
    if (typeof window === "undefined") {
      return;
    }

    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const targetProgress =
      spectrum.length <= 1 ? 0 : 0.12 + (index / (spectrum.length - 1)) * 0.62;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const scrubDistance = section.offsetHeight - window.innerHeight;

    window.scrollTo({
      top: sectionTop + scrubDistance * targetProgress,
      behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }

  return (
    <section
      id={chapter.id}
      ref={sectionRef}
      aria-labelledby={`${chapter.id}-title`}
      className="relative scroll-mt-24 border-t border-border"
    >
      <p className="sr-only">{chapter.accessibleSummary}</p>
      <MobileSponsorshipSpectrum
        chapter={chapter}
        spectrum={spectrum}
        layers={layers}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
        quoteSourceLabel={quoteSourceLabel}
      />

      <div className="hidden xl:block xl:h-[390svh] xl:min-h-[2500px]">
        <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden bg-background">
          <div className="mx-auto flex h-full max-w-[90rem] flex-col px-6 py-10 xl:px-10">
            <header className="relative z-10 grid gap-8 lg:grid-cols-[minmax(32rem,0.62fr)_minmax(22rem,0.38fr)] lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                  {chapter.eyebrow}
                </p>
                <h2
                  id={`${chapter.id}-title`}
                  className="mt-4 max-w-[64rem] text-[clamp(3rem,5vw,6.4rem)] font-semibold uppercase leading-[0.9] text-foreground [text-wrap:balance]"
                >
                  {chapter.title}
                </h2>
                <p className="mt-6 max-w-[43rem] text-lg leading-8 text-foreground/76">
                  {chapter.summary}
                </p>
              </div>
              {chapter.quote ? (
                <div
                  className="max-w-[32rem] lg:justify-self-end"
                  style={{
                    opacity: getSponsorshipConclusionOpacity(progress),
                    transform: `translate3d(0, ${interpolate(getSponsorshipConclusionOpacity(progress), 0, 1, 18, 0)}px, 0)`,
                  }}
                >
                  <FindingsQuote
                    quote={chapter.quote}
                    source={chapter.quoteSource ?? quoteSourceLabel}
                    className="[&_blockquote]:text-2xl [&_figcaption]:mt-4"
                  />
                </div>
              ) : null}
            </header>

            <div className="relative mt-8 min-h-0 flex-1">
              <SpectrumStage
                chapter={chapter}
                progress={progress}
                spectrum={spectrum}
                layers={layers}
                onStageSelect={scrollToStage}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className="sponsorship-summary-wrap relative z-10 -mt-36 hidden px-6 pb-[var(--section-gap-standard)] xl:block xl:px-10"
        style={{
          opacity: getSponsorshipInterpretationOpacity(progress),
          transform: `translate3d(0, ${interpolate(getSponsorshipInterpretationOpacity(progress), 0, 1, 18, 0)}px, 0)`,
        }}
      >
        <SponsorshipFindingSummary
          chapter={chapter}
          sourcePrefix={sourcePrefix}
          empiricalLabel={empiricalLabel}
          interpretationLabel={interpretationLabel}
          className="mx-auto max-w-[58rem]"
          showFinding={false}
        />
      </div>
    </section>
  );
}

function SpectrumStage({
  chapter,
  progress,
  spectrum,
  layers,
  onStageSelect,
}: {
  chapter: FindingChapter;
  progress: number;
  spectrum: NonNullable<FindingChapter["spectrum"]>;
  layers: string[];
  onStageSelect: (index: number) => void;
}) {
  const pathProgress = interpolate(progress, 0.08, 0.78, 0.12, 1);
  const responsibilityOpacity = getSponsorshipConclusionOpacity(progress);

  return (
    <div className="flex h-full min-h-0 flex-col justify-start">
      <div className="relative pb-2">
        <div
          className="absolute left-0 right-0 top-[2.875rem] h-px bg-border/58"
          aria-hidden="true"
        />
        <div
          className="absolute left-0 right-0 top-[2.875rem] h-px origin-left bg-primary"
          style={{ transform: `scaleX(${pathProgress})` }}
          aria-hidden="true"
        />
        <ol className="relative grid grid-cols-6 gap-8 xl:gap-12">
          {spectrum.map((stage, index) => {
            const reveal = interpolate(
              progress,
              0.08 + index * 0.09,
              0.2 + index * 0.09,
              0,
              1,
            );
            const isHigherScope = index >= Math.max(3, Math.floor(spectrum.length / 2));

            return (
              <li
                key={stage.title}
                className="min-w-0"
                style={{
                  opacity: reveal,
                  transform: `translate3d(0, ${interpolate(reveal, 0, 1, 24, 0)}px, 0)`,
                }}
              >
                <button
                  type="button"
                  onClick={() => onStageSelect(index)}
                  className="group grid w-full grid-rows-[1.75rem_2.25rem_minmax(5.75rem,auto)_minmax(5rem,auto)] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex items-start">
                    <span
                      className={[
                        "mt-[0.56rem] block h-4 w-4 border bg-background transition group-hover:border-primary motion-reduce:transition-none",
                        isHigherScope ? "border-primary" : "border-border",
                      ].join(" ")}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="block max-w-[12.25rem] break-words text-[clamp(0.98rem,1.04vw,1.2rem)] font-semibold uppercase leading-tight text-foreground [hyphens:auto] [text-wrap:balance]">
                    <FormattedSponsorshipText text={stage.title} />
                  </span>
                  <span className="block max-w-[12.25rem] text-sm leading-6 text-foreground/68">
                    {stage.body}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div
        className="sponsorship-layers mx-auto mt-8 w-full max-w-[58rem]"
        style={{
          opacity: responsibilityOpacity,
          transform: `translate3d(0, ${interpolate(responsibilityOpacity, 0, 1, 18, 0)}px, 0)`,
        }}
      >
        <div className="border border-primary/40 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {getSponsorshipLayersTitle(chapter)}
          </p>
          <ol className="mt-3 grid grid-cols-[repeat(5,minmax(0,1fr))] gap-0">
            {layers.map((layer, index) => {
              const reveal = interpolate(
                progress,
                0.48 + index * 0.055,
                0.62 + index * 0.055,
                0,
                1,
              );

              return (
                <li
                  key={layer}
                  className={[
                    "min-w-0 border-border/72 pr-5",
                    index > 0 ? "border-l pl-5" : "",
                  ].join(" ")}
                  style={{
                    opacity: reveal,
                    transform: `translate3d(0, ${interpolate(reveal, 0, 1, 10, 0)}px, 0)`,
                  }}
                >
                  <span className="block text-xs font-semibold text-primary/82">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-2 block break-words text-xs font-semibold uppercase tracking-[0.16em] text-foreground/72 [hyphens:auto]">
                    <FormattedSponsorshipText text={layer} />
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

function MobileSponsorshipSpectrum({
  chapter,
  spectrum,
  layers,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
  quoteSourceLabel,
}: {
  chapter: FindingChapter;
  spectrum: NonNullable<FindingChapter["spectrum"]>;
  layers: string[];
  sourcePrefix: string;
  empiricalLabel: string;
  interpretationLabel: string;
  quoteSourceLabel: string;
}) {
  return (
    <div className="findings-flow-layout px-4 py-[var(--section-gap-standard)] sm:px-6 xl:hidden">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
        {chapter.eyebrow}
      </p>
      <p
        aria-hidden="true"
        className="mt-4 max-w-full text-[clamp(2.75rem,11vw,4.2rem)] font-semibold uppercase leading-[0.9] text-foreground [hyphens:manual] [text-wrap:balance]"
      >
        {getMobileSponsorshipTitle(chapter.title)}
      </p>
      <p className="mt-6 text-lg leading-8 text-foreground/76">{chapter.summary}</p>
      <SponsorshipSpectrumStatic spectrum={spectrum} className="mt-10" />
      <SponsorshipLayersStatic
        title={getSponsorshipLayersTitle(chapter)}
        layers={layers}
        className="mt-10"
      />
      {chapter.quote ? (
        <FindingsQuote
          quote={chapter.quote}
          source={chapter.quoteSource ?? quoteSourceLabel}
          className="mt-12 [&_blockquote]:text-2xl"
        />
      ) : null}
      <SponsorshipFindingSummary
        chapter={chapter}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
        className="mt-10"
        showFinding={false}
      />
    </div>
  );
}

function getMobileSponsorshipTitle(title: string) {
  return title.replace("Unterstützung", "Unterstüt\u00adzung");
}

function ReducedMotionSponsorship({
  chapter,
  spectrum,
  layers,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
  quoteSourceLabel,
}: {
  chapter: FindingChapter;
  spectrum: NonNullable<FindingChapter["spectrum"]>;
  layers: string[];
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
          className="mt-4 max-w-6xl text-[clamp(3rem,7vw,7rem)] font-semibold uppercase leading-[0.9] text-foreground [text-wrap:balance]"
        >
          {chapter.title}
        </h2>
        <p className="mt-6 max-w-reading text-lg leading-8 text-foreground/76">
          {chapter.summary}
        </p>
        <SponsorshipSpectrumStatic spectrum={spectrum} className="mt-10" />
        <SponsorshipLayersStatic
          title={getSponsorshipLayersTitle(chapter)}
          layers={layers}
          className="mt-10"
        />
        {chapter.quote ? (
          <FindingsQuote
            quote={chapter.quote}
            source={chapter.quoteSource ?? quoteSourceLabel}
            className="mt-12 [&_blockquote]:text-3xl"
          />
        ) : null}
        <SponsorshipFindingSummary
          chapter={chapter}
          sourcePrefix={sourcePrefix}
          empiricalLabel={empiricalLabel}
          interpretationLabel={interpretationLabel}
          className="mt-10"
          showFinding={false}
        />
      </div>
    </section>
  );
}

function SponsorshipSpectrumStatic({
  spectrum,
  className = "",
}: {
  spectrum: NonNullable<FindingChapter["spectrum"]>;
  className?: string;
}) {
  return (
    <ol className={["grid gap-5 md:grid-cols-2 lg:grid-cols-3", className].join(" ")}>
      {spectrum.map((stage, index) => (
        <li
          key={stage.title}
          className="grid grid-cols-[2.5rem_1fr] gap-4 border-l border-border py-2"
        >
          <span className="pl-4 text-xs font-semibold text-primary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="text-xl font-semibold uppercase leading-tight text-foreground">
              <FormattedSponsorshipText text={stage.title} />
            </h3>
            <p className="mt-3 leading-7 text-foreground/72">{stage.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function SponsorshipLayersStatic({
  title,
  layers,
  className = "",
}: {
  title: string;
  layers: string[];
  className?: string;
}) {
  return (
    <div className={["border-l border-primary pl-5", className].join(" ")}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        {title}
      </p>
      <ol className="mt-4 grid gap-3">
        {layers.map((layer, index) => (
          <li key={layer} className="grid grid-cols-[2.5rem_1fr] gap-3">
            <span className="text-xs font-semibold text-primary/82">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground/72">
              <FormattedSponsorshipText text={layer} />
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function SponsorshipFindingSummary({
  chapter,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
  className = "",
  showFinding = true,
}: {
  chapter: FindingChapter;
  sourcePrefix: string;
  empiricalLabel: string;
  interpretationLabel: string;
  className?: string;
  showFinding?: boolean;
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
      {showFinding ? (
        <p className="mt-3 text-2xl font-semibold leading-tight text-foreground">
          {chapter.finding}
        </p>
      ) : null}
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

function getSponsorshipConclusionOpacity(progress: number) {
  return interpolate(progress, 0.8, 0.88, 0, 1);
}

function getSponsorshipInterpretationOpacity(progress: number) {
  return interpolate(progress, 0.94, 0.99, 0, 1);
}

function getSponsorshipLayersTitle(chapter: FindingChapter) {
  return chapter.navLabel === "Sponsoring"
    ? "Damit verbundene Arbeitsbereiche"
    : "Related areas of work";
}

function FormattedSponsorshipText({ text }: { text: string }) {
  return text.split("\n").map((line, index, lines) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 ? <br /> : null}
    </span>
  ));
}
