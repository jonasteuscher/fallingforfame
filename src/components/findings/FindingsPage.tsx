import Image from "next/image";
import Link from "next/link";

import { SectionTitle } from "@/components/athletes/SectionTitle";
import { FindingsChapterNav } from "@/components/findings/FindingsChapterNav";
import { FindingsHero } from "@/components/findings/FindingsHero";
import { FindingsQuote } from "@/components/findings/FindingsQuote";
import { FindingsVisibilitySequence } from "@/components/findings/FindingsVisibilitySequence";
import { CameraEquipmentSection } from "@/components/findings/CameraEquipmentSection";
import { DecisionLayersSection } from "@/components/findings/DecisionLayersSection";
import { ExperienceJourneySection } from "@/components/findings/ExperienceJourneySection";
import { NoJumpDecisionSection } from "@/components/findings/NoJumpDecisionSection";
import { PressureModelSection } from "@/components/findings/PressureModelSection";
import { RecognitionComparison } from "@/components/findings/RecognitionComparison";
import { SafetyNetworkSection } from "@/components/findings/SafetyNetworkSection";
import { SponsorshipSpectrumSection } from "@/components/findings/SponsorshipSpectrumSection";
import { SynthesisSection } from "@/components/findings/SynthesisSection";
import { VisibleInvisibleProcessSection } from "@/components/findings/VisibleInvisibleProcessSection";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/navigation";
import type { FindingChapter, FindingsPageContent } from "@/types/findings";

type FindingsPageProps = {
  content: FindingsPageContent;
  locale: Locale;
};

export function FindingsPage({ content, locale }: FindingsPageProps) {
  const chapters = orderFindingsChapters(content.chapters);

  return (
    <main className="bg-background text-foreground">
      <a
        href="#research-context"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-primary focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:uppercase focus:tracking-[0.16em] focus:text-primary-foreground"
      >
        {content.skipLabel}
      </a>
      <FindingsChapterNav
        items={content.nav}
        ariaLabel={content.navigationLabel}
        hiddenUntilId="findings-hero"
      />
      <FindingsHero content={content} />
      {chapters.map((chapter) => (
        chapter.kind === "media-visibility" ? (
          <FindingsVisibilitySequence
            key={chapter.id}
            chapter={chapter}
            sourcePrefix={content.sourcePrefix}
            empiricalLabel={content.empiricalLabel}
            interpretationLabel={content.interpretationLabel}
            quoteSourceLabel={content.quoteSourceLabel}
          />
        ) : chapter.kind === "recognition-comparison" ? (
          <RecognitionComparison
            key={chapter.id}
            chapter={chapter}
            sourcePrefix={content.sourcePrefix}
            empiricalLabel={content.empiricalLabel}
            interpretationLabel={content.interpretationLabel}
          />
        ) : chapter.kind === "camera-equipment" ? (
          <CameraEquipmentSection
            key={chapter.id}
            chapter={chapter}
            sourcePrefix={content.sourcePrefix}
            empiricalLabel={content.empiricalLabel}
            interpretationLabel={content.interpretationLabel}
          />
        ) : chapter.kind === "visible-invisible" ? (
          <VisibleInvisibleProcessSection
            key={chapter.id}
            chapter={chapter}
            sourcePrefix={content.sourcePrefix}
            empiricalLabel={content.empiricalLabel}
            interpretationLabel={content.interpretationLabel}
          />
        ) : chapter.kind === "sponsorship-spectrum" ? (
          <SponsorshipSpectrumSection
            key={chapter.id}
            chapter={chapter}
            sourcePrefix={content.sourcePrefix}
            empiricalLabel={content.empiricalLabel}
            interpretationLabel={content.interpretationLabel}
            quoteSourceLabel={content.quoteSourceLabel}
          />
        ) : chapter.kind === "pressure-model" ? (
          <PressureModelSection
            key={chapter.id}
            chapter={chapter}
            sourcePrefix={content.sourcePrefix}
            empiricalLabel={content.empiricalLabel}
            interpretationLabel={content.interpretationLabel}
          />
        ) : chapter.kind === "decision-layers" ? (
          <DecisionLayersSection
            key={chapter.id}
            chapter={chapter}
            locale={locale}
            sourcePrefix={content.sourcePrefix}
            empiricalLabel={content.empiricalLabel}
            interpretationLabel={content.interpretationLabel}
          />
        ) : chapter.kind === "experience-curve" ? (
          <ExperienceJourneySection
            key={chapter.id}
            chapter={chapter}
            locale={locale}
            sourcePrefix={content.sourcePrefix}
            empiricalLabel={content.empiricalLabel}
            interpretationLabel={content.interpretationLabel}
          />
        ) : chapter.kind === "no-jump" ? (
          <NoJumpDecisionSection
            key={chapter.id}
            chapter={chapter}
            locale={locale}
            sourcePrefix={content.sourcePrefix}
            empiricalLabel={content.empiricalLabel}
            interpretationLabel={content.interpretationLabel}
            quoteSourceLabel={content.quoteSourceLabel}
          />
        ) : chapter.kind === "safety-network" ? (
          <SafetyNetworkSection
            key={chapter.id}
            chapter={chapter}
            locale={locale}
            sourcePrefix={content.sourcePrefix}
            empiricalLabel={content.empiricalLabel}
            interpretationLabel={content.interpretationLabel}
          />
        ) : chapter.kind === "synthesis-model" ? (
          <SynthesisSection
            key={chapter.id}
            chapter={chapter}
            locale={locale}
          />
        ) : (
          <FindingChapterSection
            key={chapter.id}
            chapter={chapter}
            locale={locale}
            sourcePrefix={content.sourcePrefix}
            empiricalLabel={content.empiricalLabel}
            interpretationLabel={content.interpretationLabel}
            quoteSourceLabel={content.quoteSourceLabel}
          />
        )
      ))}
    </main>
  );
}

function orderFindingsChapters(chapters: FindingChapter[]) {
  const noJump = chapters.find((chapter) => chapter.kind === "no-jump");

  if (!noJump) {
    return chapters;
  }

  const withoutNoJump = chapters.filter((chapter) => chapter !== noJump);
  const decisionIndex = withoutNoJump.findIndex((chapter) => chapter.kind === "decision-layers");

  if (decisionIndex === -1) {
    return chapters;
  }

  return [
    ...withoutNoJump.slice(0, decisionIndex + 1),
    noJump,
    ...withoutNoJump.slice(decisionIndex + 1),
  ];
}

function FindingChapterSection({
  chapter,
  locale,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
  quoteSourceLabel,
}: {
  chapter: FindingChapter;
  locale: Locale;
  sourcePrefix: string;
  empiricalLabel: string;
  interpretationLabel: string;
  quoteSourceLabel: string;
}) {
  return (
    <section
      id={chapter.id}
      aria-labelledby={`${chapter.id}-title`}
      className="scroll-mt-24 border-t border-border px-4 py-[var(--section-gap-immersive)] sm:px-6 xl:px-10"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
        <header className="min-w-0 lg:sticky lg:top-24 lg:max-h-[calc(100svh-7rem)] lg:self-start">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            {chapter.eyebrow}
          </p>
          <SectionTitle id={`${chapter.id}-title`} size="interviewSplit">
            {chapter.title}
          </SectionTitle>
          <p className="mt-7 max-w-reading text-lg leading-8 text-foreground/76">
            {chapter.summary}
          </p>
          {chapter.quote ? (
            <FindingsQuote
              quote={chapter.quote}
              source={chapter.quoteSource ?? quoteSourceLabel}
              className="mt-10"
            />
          ) : null}
        </header>
        <div className="min-w-0 space-y-8">
          <ChapterVisual chapter={chapter} locale={locale} />
          <FindingSummary
            chapter={chapter}
            locale={locale}
            sourcePrefix={sourcePrefix}
            empiricalLabel={empiricalLabel}
            interpretationLabel={interpretationLabel}
          />
        </div>
      </div>
    </section>
  );
}

function ChapterVisual({
  chapter,
  locale,
}: {
  chapter: FindingChapter;
  locale: Locale;
}) {
  switch (chapter.kind) {
    case "media-visibility":
      return null;
    case "recognition-comparison":
      return null;
    case "camera-equipment":
      return null;
    case "sponsorship-spectrum":
      return <SponsorshipSpectrum chapter={chapter} />;
    case "pressure-model":
      return <PressureModel chapter={chapter} />;
    case "decision-layers":
      return <DecisionLayers chapter={chapter} />;
    case "experience-curve":
      return <ExperienceCurve chapter={chapter} />;
    case "no-jump":
      return <NoJumpDecision chapter={chapter} />;
    case "visible-invisible":
      return <VisibleInvisible chapter={chapter} />;
    case "safety-network":
      return null;
    case "synthesis-model":
      return <SynthesisModel chapter={chapter} />;
    case "methodology":
      return <ResearchContext chapter={chapter} locale={locale} />;
    default:
      return assertNever(chapter.kind);
  }
}

function SponsorshipSpectrum({ chapter }: { chapter: FindingChapter }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-3">
        {chapter.spectrum?.map((stage) => (
          <details
            key={stage.title}
            className="group border border-border bg-surface/58 p-4 open:bg-background/70"
          >
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold uppercase tracking-[0.15em] text-foreground">
              {stage.title}
              <span className="text-primary" aria-hidden="true">+</span>
            </summary>
            <p className="mt-3 text-sm leading-6 text-foreground/72">{stage.body}</p>
          </details>
        ))}
      </div>
      <ProcessList items={chapter.layers ?? []} />
    </div>
  );
}

function PressureModel({ chapter }: { chapter: FindingChapter }) {
  return (
    <details className="group border border-border bg-surface/60 p-5 sm:p-7">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
        {chapter.controlLabel}
        <span aria-hidden="true">↘</span>
      </summary>
      <div className="relative mt-7 min-h-[28rem] overflow-hidden border border-border bg-background/58 p-5">
        <div className="absolute left-1/2 top-1/2 z-10 grid h-36 w-36 -translate-x-1/2 -translate-y-1/2 place-items-center border border-primary bg-background text-center text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
          {chapter.centerLabel}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {chapter.layers?.map((item) => (
            <span
              key={item}
              className="min-h-16 border border-border bg-surface/72 p-3 text-xs font-semibold uppercase tracking-[0.12em] text-foreground/72 transition group-open:translate-y-2 group-open:border-primary/60 motion-reduce:transition-none"
            >
              {item}
            </span>
          ))}
        </div>
        <p className="absolute inset-x-5 bottom-5 border-l-2 border-primary bg-background/72 p-4 text-sm leading-6 text-foreground/78">
          {chapter.controlResult}
        </p>
      </div>
    </details>
  );
}

function DecisionLayers({ chapter }: { chapter: FindingChapter }) {
  return (
    <div className="grid gap-5 md:grid-cols-[0.48fr_0.52fr]">
      {chapter.image ? (
        <figure className="relative aspect-[4/5] overflow-hidden border border-border bg-surface md:sticky md:top-24">
          <Image
            src={chapter.image.src}
            alt={chapter.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
          />
          <figcaption className="absolute inset-x-4 bottom-4 border border-border bg-background/72 p-4 text-sm font-semibold uppercase tracking-[0.14em] text-primary backdrop-blur">
            {chapter.controlLabel}
          </figcaption>
        </figure>
      ) : null}
      <ol className="space-y-3">
        {chapter.layers?.map((layer, index) => (
          <li key={layer} className="grid grid-cols-[3rem_1fr] items-start gap-3 border border-border bg-surface/52 p-4">
            <span className="text-sm font-semibold text-primary">{String(index + 1).padStart(2, "0")}</span>
            <span className="text-lg font-semibold text-foreground">{layer}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ExperienceCurve({ chapter }: { chapter: FindingChapter }) {
  return (
    <ol className="relative space-y-5 before:absolute before:left-4 before:top-0 before:h-full before:w-px before:bg-border">
      {chapter.states?.map((state, index) => (
        <li key={state.title} className="relative grid gap-2 pl-12">
          <span className="absolute left-[0.44rem] top-1 h-5 w-5 border border-primary bg-background" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="text-2xl font-semibold text-foreground">{state.title}</h3>
          <p className="max-w-reading leading-7 text-foreground/72">{state.body}</p>
        </li>
      ))}
    </ol>
  );
}

function NoJumpDecision({ chapter }: { chapter: FindingChapter }) {
  return (
    <div className="grid gap-5 md:grid-cols-[0.58fr_0.42fr]">
      {chapter.image ? (
        <figure className="relative aspect-video overflow-hidden border border-border bg-surface">
          <Image
            src={chapter.image.src}
            alt={chapter.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_28%,color-mix(in_srgb,var(--background)_78%,transparent)_100%)]" />
          <figcaption className="absolute inset-x-4 bottom-4 text-2xl font-semibold uppercase leading-tight text-foreground">
            {chapter.finding}
          </figcaption>
        </figure>
      ) : null}
      <ProcessList items={chapter.layers ?? []} />
    </div>
  );
}

function VisibleInvisible({ chapter }: { chapter: FindingChapter }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.42fr_0.58fr]">
      <article className="border border-border bg-surface/64 p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          {chapter.visibleLabel}
        </p>
        <ul className="mt-5 space-y-3 text-foreground/72">
          {chapter.left?.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </article>
      <article className="border border-primary/50 bg-background/72 p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          {chapter.invisibleLabel}
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {chapter.right?.items.map((item) => (
            <li key={item} className="border border-border bg-surface/42 p-3 text-foreground/76">
              {item}
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}

function SynthesisModel({ chapter }: { chapter: FindingChapter }) {
  return (
    <div className="space-y-8">
      <ol className="grid gap-4">
        {chapter.states?.map((state, index) => (
          <li key={state.title} className="relative border border-border bg-surface/58 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-foreground">{state.title}</h3>
            <p className="mt-2 leading-7 text-foreground/72">{state.body}</p>
          </li>
        ))}
      </ol>
      <div className="grid gap-4 md:grid-cols-2">
        {chapter.paths?.map((path) => (
          <article key={path.title} className="border border-border bg-background/48 p-4">
            <h3 className="text-lg font-semibold text-foreground">{path.title}</h3>
            <p className="mt-3 text-sm leading-6 text-foreground/72">
              {path.steps.join(" → ")}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

function ResearchContext({
  chapter,
  locale,
}: {
  chapter: FindingChapter;
  locale: Locale;
}) {
  return (
    <div className="space-y-7">
      <ul className="grid gap-3 sm:grid-cols-2">
        {chapter.methodologyItems?.map((item) => (
          <li key={item} className="border border-border bg-surface/52 p-4 text-foreground/76">
            {item}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-3">
        {chapter.links?.map((link) => (
          <Link
            key={link.href}
            href={localizedPath(locale, link.href)}
            className="inline-flex min-h-11 items-center bg-primary px-5 text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground transition hover:bg-primary/86 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function ProcessList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li key={item} className="border border-border bg-surface/52 p-4 text-sm font-semibold uppercase tracking-[0.14em] text-foreground/74">
          {item}
        </li>
      ))}
    </ul>
  );
}

function FindingSummary({
  chapter,
  locale,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
}: {
  chapter: FindingChapter;
  locale: Locale;
  sourcePrefix: string;
  empiricalLabel: string;
  interpretationLabel: string;
}) {
  const isGermanCommunity = chapter.kind === "safety-network" && locale === "de";

  return (
    <aside className="border border-border bg-background/72 p-5 sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        {sourcePrefix}
      </p>
      <div className={isGermanCommunity ? "mt-5 grid gap-6 md:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)]" : "mt-5 grid gap-5 md:grid-cols-2"}>
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

function assertNever(value: never): never {
  throw new Error(`Unsupported findings chapter type: ${value}`);
}
