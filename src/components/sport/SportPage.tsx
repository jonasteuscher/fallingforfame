"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import type { sport as sportContent } from "@/content/en/sport";

type SportContent = typeof sportContent;

type SportPageProps = {
  content: SportContent;
};

const disciplineImages = [
  "/images/sport/disciplines/Slick.jpg",
  "/images/sport/disciplines/Tracking.jpg",
  "/images/sport/disciplines/Wingsuit-2.jpg",
  "/images/sport/disciplines/Gainer.jpg",
  "/images/sport/disciplines/Urban.jpg",
  "/images/sport/disciplines/Low.jpg",
  "/images/sport/disciplines/Multiway.jpg",
  "/images/sport/disciplines/Skibase.png",
  "/images/sport/disciplines/Tandem.webp",
] as const;

export function SportPage({ content }: SportPageProps) {
  const sectionById = new Map(content.sections.map((section) => [section.id, section]));
  const history = sectionById.get("history") ?? sectionById.get("geschichte");
  const comparison =
    sectionById.get("skydiving-vs-base") ?? sectionById.get("skydiving-vs-base");
  const equipment = sectionById.get("equipment") ?? sectionById.get("ausruestung");
  const safety =
    sectionById.get("risk-and-safety-culture") ??
    sectionById.get("risiko-und-sicherheitskultur");
  const community =
    sectionById.get("community-and-ethics") ??
    sectionById.get("gemeinschaft-und-ethik");
  const disciplines = sectionById.get("disciplines") ?? sectionById.get("disziplinen");
  const modern =
    sectionById.get("modern-developments") ?? sectionById.get("moderne-entwicklungen");

  return (
    <article className="bg-background text-foreground">
      <SportHero content={content} />
      <SportIntro content={content.intro} />
      <BaseAcronymStory content={content.acronym} />
      <HistoryTimeline content={content.historyTimeline} title={history?.title} />
      <SkydivingVsBase content={content.comparison} title={comparison?.title} />
      <EquipmentExplainer content={content.equipmentVisual} title={equipment?.title} />
      <DisciplinesGallery content={content.disciplines} title={disciplines?.title} />
      <SafetyPhilosophy content={content.safetyPyramid} title={safety?.title} />
      <CommunityNetwork content={content.ethicsNetwork} title={community?.title} />
      <ThenVsNow content={content.thenVsNow} title={modern?.title} />
      <SourcesSection content={content.sources} disclaimer={content.disclaimer} />
    </article>
  );
}

function SportIntro({ content }: { content: SportContent["intro"] }) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.55fr_1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            BASE
          </p>
          <h2 className="mt-3 max-w-xl text-4xl font-semibold leading-tight text-foreground sm:text-6xl">
            {content.title}
          </h2>
        </div>
        <div className="max-w-reading space-y-5 text-lg leading-8 text-foreground/76">
          {content.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

function SportHero({ content }: { content: SportContent }) {
  return (
    <section className="relative flex min-h-[calc(100svh-3.5rem)] overflow-hidden px-4 py-20 sm:px-6 lg:px-10">
      <Image
        src="/images/sport/hero1.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,var(--background)_0%,color-mix(in_srgb,var(--background)_72%,transparent)_42%,color-mix(in_srgb,var(--background)_18%,transparent)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/72 to-transparent"
      />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-end">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">
          {content.kicker}
        </p>
        <h1 className="max-w-5xl text-5xl font-semibold leading-none text-foreground min-[380px]:text-6xl md:text-8xl lg:text-9xl">
          {content.title}
        </h1>
        <div className="mt-6 max-w-2xl space-y-5 text-lg leading-8 text-foreground/78 md:text-2xl md:leading-9">
          {content.body.split("\n\n").map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-12 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-foreground/62">
          <span className="h-px w-12 bg-primary" aria-hidden="true" />
          <span>{content.scrollCta}</span>
        </div>
      </div>
    </section>
  );
}

function BaseAcronymStory({
  content,
  title,
}: {
  content: SportContent["acronym"];
  title?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerPanelRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [headerMode, setHeaderMode] = useState<"flow" | "fixed" | "end">("flow");
  const [headerHeight, setHeaderHeight] = useState(0);
  const acronymItemCount = content.items.length;

  useEffect(() => {
    let frame = 0;

    function updateActiveIndex() {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      frame = window.requestAnimationFrame(() => {
        const section = sectionRef.current;
        const headerPanel = headerPanelRef.current;

        if (!section) {
          return;
        }

        const headerOffset = 56;
        const measuredHeaderHeight = headerPanel?.offsetHeight ?? 0;
        const sectionRect = section.getBoundingClientRect();
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        const sectionProgress = window.scrollY - sectionTop + window.innerHeight * 0.55;
        const stepSize = Math.max(section.scrollHeight / acronymItemCount, 1);
        const nextActiveIndex = Math.min(
          Math.max(Math.floor(sectionProgress / stepSize), 0),
          acronymItemCount - 1,
        );

        setHeaderHeight(measuredHeaderHeight);
        if (sectionRect.top > headerOffset) {
          setHeaderMode("flow");
        } else if (sectionRect.bottom <= headerOffset + measuredHeaderHeight) {
          setHeaderMode("end");
        } else {
          setHeaderMode("fixed");
        }
        setActiveIndex(nextActiveIndex);
      });
    }

    updateActiveIndex();
    window.addEventListener("scroll", updateActiveIndex, { passive: true });
    window.addEventListener("resize", updateActiveIndex);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", updateActiveIndex);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, [acronymItemCount]);

  return (
    <section ref={sectionRef} aria-labelledby="base-acronym-title" className="relative">
      <div
        aria-hidden={headerMode !== "flow" ? "true" : undefined}
        style={headerMode !== "flow" ? { height: headerHeight } : undefined}
      />
      <div
        ref={headerPanelRef}
        className={
          headerMode === "fixed"
            ? "fixed inset-x-0 top-14 z-30 border-y border-border bg-background/96 px-4 py-4 backdrop-blur sm:px-6 lg:px-10"
            : headerMode === "end"
              ? "absolute inset-x-0 bottom-0 z-10 border-y border-border bg-background/96 px-4 py-4 backdrop-blur sm:px-6 lg:px-10"
              : "relative z-10 border-y border-border bg-background/96 px-4 py-4 backdrop-blur sm:px-6 lg:px-10"
        }
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <h2
              id="base-acronym-title"
              className="text-lg font-semibold text-foreground sm:text-2xl"
            >
              {title ?? content.title}
            </h2>
            <div className="flex gap-2" aria-hidden="true">
              {content.items.map((item, index) => (
                <span
                  key={`${item.letter}-slot`}
                  className={
                    index <= activeIndex
                      ? "grid h-9 w-9 place-items-center border border-primary bg-primary text-base font-semibold text-background transition duration-300 sm:h-11 sm:w-11"
                      : "grid h-9 w-9 place-items-center border border-primary/70 text-base font-semibold text-primary/0 transition duration-300 sm:h-11 sm:w-11"
                  }
                >
                  <span
                    className={
                      index <= activeIndex
                        ? "translate-y-0 opacity-100 transition duration-300"
                        : "translate-y-3 opacity-0 transition duration-300"
                    }
                  >
                    {item.letter}
                  </span>
                </span>
              ))}
            </div>
          </div>
          <AcronymFlightDeck content={content} activeIndex={activeIndex} />
        </div>
      </div>
      <ol>
        {content.items.map((item, index) => (
          <li
            key={item.letter}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            className="relative min-h-[72svh] overflow-hidden px-4 py-10 sm:px-6 lg:px-10"
          >
            <Image
              src={item.backgroundImage}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--background)_88%,transparent)_0%,color-mix(in_srgb,var(--background)_58%,transparent)_44%,color-mix(in_srgb,var(--background)_14%,transparent)_100%)]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background/82 via-background/48 to-transparent"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-background/42 to-transparent"
            />
            <div className="relative z-10 mx-auto flex min-h-[58svh] max-w-7xl items-end">
              <div className="pb-10">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-4 text-[34vw] font-semibold leading-none text-primary sm:text-[18rem]">
                  {item.letter}
                </p>
                <h3 className="-mt-4 text-4xl font-semibold leading-tight text-foreground sm:text-6xl">
                  {item.term}
                </h3>
                <p className="mt-5 max-w-xl text-lg leading-8 text-foreground/72">
                  {item.description}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function AcronymFlightDeck({
  content,
  activeIndex,
}: {
  content: SportContent["acronym"];
  activeIndex: number;
}) {
  return (
    <div className="mt-4 hidden overflow-hidden md:block">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {content.items.map((item, index) => (
          <article
            key={`${item.letter}-flight-card`}
            className={
              index <= activeIndex
                ? "translate-x-0 opacity-100 transition duration-500 ease-out"
                : "translate-x-16 opacity-0 transition duration-500 ease-out"
            }
            style={{ transitionDelay: `${Math.max(index - activeIndex, 0) * 60}ms` }}
          >
            <div className="grid min-h-28 grid-cols-[5.25rem_minmax(0,1fr)] gap-4 border border-border bg-surface/88 p-3">
              <div className="flex h-full min-h-20 items-center justify-center border border-primary/35 bg-background/50 p-2">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  width={96}
                  height={96}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex min-w-0 flex-col justify-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {item.letter}
                </p>
                <h3 className="mt-1 text-base font-semibold text-foreground">
                  {item.term}
                </h3>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function HistoryTimeline({
  content,
  title,
}: {
  content: SportContent["historyTimeline"];
  title?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const railSlotRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [railMode, setRailMode] = useState<"flow" | "fixed" | "end">("flow");
  const [railOffset, setRailOffset] = useState({ left: 0, width: 360 });
  const historyItemCount = content.items.length;

  function scrollToHistoryItem(index: number) {
    const item = itemRefs.current[index];

    if (!item) {
      return;
    }

    const headerOffset = 88;
    const itemTop = item.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: Math.max(itemTop - headerOffset, 0),
      behavior: "smooth",
    });
  }

  useEffect(() => {
    let frame = 0;

    function updateTimelineState() {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      frame = window.requestAnimationFrame(() => {
        const section = sectionRef.current;
        const railSlot = railSlotRef.current;
        const headerOffset = 56;
        const viewportTarget = window.innerHeight * 0.45;
        let nextActiveIndex = 0;
        let smallestDistance = Number.POSITIVE_INFINITY;

        if (section && railSlot) {
          const sectionRect = section.getBoundingClientRect();
          const railRect = railSlot.getBoundingClientRect();
          const isAtEnd =
            itemRefs.current[historyItemCount - 1]?.getBoundingClientRect().top ??
            Number.POSITIVE_INFINITY;

          setRailOffset({ left: railRect.left, width: railRect.width });

          if (sectionRect.top > headerOffset) {
            setRailMode("flow");
          } else if (isAtEnd <= headerOffset + 96) {
            setRailMode("end");
          } else {
            setRailMode("fixed");
          }
        }

        itemRefs.current.forEach((item, index) => {
          if (!item) {
            return;
          }

          const rect = item.getBoundingClientRect();
          const itemCenter = rect.top + rect.height / 2;
          const distance = Math.abs(itemCenter - viewportTarget);

          if (distance < smallestDistance) {
            smallestDistance = distance;
            nextActiveIndex = index;
          }
        });

        setActiveIndex(nextActiveIndex);
      });
    }

    updateTimelineState();
    window.addEventListener("scroll", updateTimelineState, { passive: true });
    window.addEventListener("resize", updateTimelineState);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", updateTimelineState);
      window.removeEventListener("resize", updateTimelineState);
    };
  }, [historyItemCount]);

  return (
    <section
      ref={sectionRef}
      aria-label={title ?? content.title}
      className="px-4 pt-24 pb-16 sm:px-6 lg:px-10 lg:pt-24 lg:pb-0"
    >
      <div className="mx-auto max-w-7xl">
        <div className="lg:hidden">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {content.title}
          </p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight text-foreground sm:text-6xl">
            {title ?? content.title}
          </h2>
        </div>

        <div className="mt-10 gap-8 lg:mt-0 lg:grid lg:grid-cols-[360px_minmax(0,1fr)] lg:items-stretch">
          <div
            ref={railSlotRef}
            className="relative hidden min-h-[calc(100svh-3.5rem)] lg:block"
          >
            <aside
              className={
                railMode === "fixed"
                  ? "fixed top-14 z-20 h-[calc(100svh-3.5rem)] overflow-y-auto py-10"
                  : railMode === "end"
                    ? "absolute bottom-0 left-0 w-full py-10"
                    : "py-10"
              }
              style={
                railMode === "fixed"
                  ? { left: railOffset.left, width: railOffset.width }
                  : undefined
              }
            >
              <HistoryRail
                content={content}
                title={title}
                activeIndex={activeIndex}
                onSelect={scrollToHistoryItem}
              />
            </aside>
          </div>
          <ol className="grid min-w-0 flex-1 gap-8 lg:py-16">
            {content.items.map((item, index) => (
              <li
                key={`${item.date}-${item.title}`}
                ref={(element) => {
                  itemRefs.current[index] = element;
                }}
                className="grid min-h-[64svh] gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-start"
              >
                <div className="border-t border-primary pt-5">
                  <p className="text-5xl font-semibold text-primary sm:text-7xl">
                    {item.date}
                  </p>
                  <h3 className="mt-4 text-3xl font-semibold text-foreground sm:text-5xl">
                    {item.title}
                  </h3>
                  <p className="mt-5 max-w-xl text-lg leading-8 text-foreground/72">
                    {item.body}
                  </p>
                </div>
                <HistoryImage image={item.image} priority={index === 0} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function HistoryImage({
  image,
  priority = false,
}: {
  image: SportContent["historyTimeline"]["items"][number]["image"];
  priority?: boolean;
}) {
  return (
    <figure className="relative min-h-80 overflow-hidden bg-surface-muted">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover"
        sizes="(min-width: 1024px) 38vw, 100vw"
        priority={priority}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 border-2 border-[#FE6B00]"
      />
    </figure>
  );
}

function HistoryRail({
  content,
  title,
  activeIndex,
  onSelect,
}: {
  content: SportContent["historyTimeline"];
  title?: string;
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">
        {content.title}
      </p>
      <h2 className="mt-3 text-4xl font-semibold leading-tight text-foreground">
        {title ?? content.title}
      </h2>
      <ol className="border-l border-border">
        {content.items.map((item, index) => (
          <li
            key={`${item.date}-nav`}
            className={
              index === activeIndex
                ? "border-b border-primary bg-primary text-background transition-colors"
                : "border-b border-border transition-colors"
            }
            aria-current={index === activeIndex ? "step" : undefined}
          >
            <button
              type="button"
              className="block w-full cursor-pointer px-5 py-4 text-left focus-visible:outline-offset-[-4px]"
              onClick={() => onSelect(index)}
            >
              <span
                className={
                  index === activeIndex
                    ? "block text-sm font-semibold tracking-wide text-background"
                    : "block text-sm font-semibold tracking-wide text-primary"
                }
              >
                {item.date}
              </span>
              <span
                className={
                  index === activeIndex
                    ? "mt-1 block font-semibold text-background"
                    : "mt-1 block font-semibold text-foreground/80"
                }
              >
                {item.title}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </>
  );
}
function SkydivingVsBase({
  content,
  title,
}: {
  content: SportContent["comparison"];
  title?: string;
}) {
  return <HeightComparisonScrolly content={content} title={title} />;
}

function HeightComparisonScrolly({
  content,
  title,
}: {
  content: SportContent["comparison"];
  title?: string;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStepProgress, setActiveStepProgress] = useState(0);
  const activeVisual = content.scrolly.steps[activeStep]?.visual ?? "skydivingAltitude";

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    let frame = 0;

    const updateProgress = () => {
      const rect = section.getBoundingClientRect();
      const scrollableDistance = Math.max(rect.height - window.innerHeight, 1);
      const nextProgress = Math.min(
        Math.max((window.innerHeight * 0.28 - rect.top) / scrollableDistance, 0),
        1,
      );

      setScrollProgress(nextProgress);

      const summaryStep = stepRefs.current[4];
      const summaryStepRect = summaryStep?.getBoundingClientRect();
      const summaryIsAtReadingPosition = summaryStepRect
        ? summaryStepRect.top <= window.innerHeight * 0.4
        : nextProgress >= 1;
      const nextActiveStep =
        nextProgress < 0.33
          ? 0
          : nextProgress < 0.66
            ? 1
            : nextProgress < 0.82
              ? 2
              : summaryIsAtReadingPosition
                ? 4
                : 3;
      setActiveStep((current) => (current === nextActiveStep ? current : nextActiveStep));

      const activeElement = stepRefs.current[nextActiveStep];

      if (activeElement) {
        const activeRect = activeElement.getBoundingClientRect();
        const progressStart = nextActiveStep === 4 ? window.innerHeight * 0.4 : window.innerHeight * 0.7;
        const progressDistance = nextActiveStep === 4 ? activeRect.height * 0.75 : activeRect.height;
        const nextActiveStepProgress = Math.min(
          Math.max((progressStart - activeRect.top) / Math.max(progressDistance, 1), 0),
          1,
        );

        setActiveStepProgress(nextActiveStepProgress);
      }
    };

    const requestUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [activeStep]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="comparison-title"
      className="overflow-x-clip px-4 py-16 sm:px-6 lg:px-10"
    >
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.42fr_1fr] lg:items-start lg:gap-10">
        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {content.scrolly.eyebrow}
          </p>
          <h2
            id="comparison-title"
            className="mt-3 text-4xl font-semibold leading-tight text-foreground [overflow-wrap:anywhere] sm:text-6xl"
          >
            {title ?? content.scrolly.headline}
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-foreground/72 [overflow-wrap:anywhere]">
            {content.scrolly.intro}
          </p>
        </aside>
        <div className="min-w-0 lg:hidden">
          <HeightVisual
            visual="baseTime"
            skydivingLabel={content.skydivingLabel}
            baseLabel={content.baseLabel}
            skydivingAltitude={content.skydivingAltitude}
            baseAltitude={content.baseAltitude}
            baseReaction={content.baseReaction}
            scrollProgress={1}
            mobileOverview
          />
        </div>
        <div className="grid min-w-0 gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          <div className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
            <HeightVisual
              visual={activeVisual}
              skydivingLabel={content.skydivingLabel}
              baseLabel={content.baseLabel}
              skydivingAltitude={content.skydivingAltitude}
              baseAltitude={content.baseAltitude}
              baseReaction={content.baseReaction}
              scrollProgress={scrollProgress}
              activeStepProgress={activeStepProgress}
            />
          </div>
          <ol className="grid w-full min-w-0 max-w-full gap-5">
            {content.scrolly.steps.map((step, index) => (
              <HeightStep
                key={step.title}
                stepRef={(element) => {
                  stepRefs.current[index] = element;
                }}
                step={step}
                index={index}
                active={index === activeStep}
                table={
                  step.visual === "summary" ? (
                    <ComparisonTable
                      rows={content.rows}
                      skydivingLabel={content.skydivingLabel}
                      baseLabel={content.baseLabel}
                      title={content.scrolly.summaryTitle}
                      metricLabel={content.scrolly.metricLabel}
                    />
                  ) : undefined
                }
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

type HeightStepContent = SportContent["comparison"]["scrolly"]["steps"][number];

const HeightStep = function HeightStep({
  step,
  index,
  active,
  table,
  stepRef,
}: {
  step: HeightStepContent;
  index: number;
  active: boolean;
  table?: ReactNode;
  stepRef: (element: HTMLElement | null) => void;
}) {
  return (
    <li className="w-full min-w-0 max-w-full list-none">
      <article
        ref={stepRef}
        data-step-index={index}
        tabIndex={0}
        className={
          active
            ? "w-full min-w-0 max-w-full scroll-mt-24 border-2 border-primary bg-surface p-4 outline-none transition-colors motion-reduce:transition-none lg:min-h-[44svh]"
            : "w-full min-w-0 max-w-full scroll-mt-24 border-2 border-border bg-surface p-4 outline-none transition-colors focus:border-primary lg:min-h-[44svh]"
        }
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-3 max-w-full break-words text-xl font-semibold leading-tight text-foreground [overflow-wrap:anywhere]">
          {step.title}
        </h3>
        <p className="mt-3 max-w-full break-words text-base leading-7 text-foreground/76 [overflow-wrap:anywhere]">{step.body}</p>
        {step.highlights ? (
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {step.highlights.map((highlight) => (
              <li
                key={highlight}
                className="max-w-full break-words border border-border bg-background/35 p-4 text-base font-semibold text-foreground [overflow-wrap:anywhere]"
              >
                {highlight}
              </li>
            ))}
          </ul>
        ) : null}
        {step.microcopy ? (
          <p className="mt-3 max-w-full break-words border-l-2 border-primary pl-4 text-sm leading-6 text-foreground/68 [overflow-wrap:anywhere]">
            {step.microcopy}
          </p>
        ) : null}
        {table ? <div className="mt-6 min-w-0">{table}</div> : null}
      </article>
    </li>
  );
};

function HeightVisual({
  visual,
  skydivingLabel,
  baseLabel,
  skydivingAltitude,
  baseAltitude,
  baseReaction,
  scrollProgress = 0,
  activeStepProgress = 0,
  compact = false,
  mobileOverview = false,
}: {
  visual: HeightStepContent["visual"];
  skydivingLabel: string;
  baseLabel: string;
  skydivingAltitude: string;
  baseAltitude: string;
  baseReaction: string;
  scrollProgress?: number;
  activeStepProgress?: number;
  compact?: boolean;
  mobileOverview?: boolean;
}) {
  const isBase = visual === "baseAltitude" || visual === "baseTime";
  const isSkydiving = visual === "skydivingAltitude" || visual === "skydivingMargin";
  const currentLabel = isBase ? baseLabel : skydivingLabel;
  const displayedLabel = mobileOverview ? "Basejumping vs. Skydiving" : currentLabel;
  const currentValue =
    visual === "summary"
      ? "Everything changes"
      : visual === "baseTime"
      ? baseReaction
      : isBase
      ? baseAltitude
      : skydivingAltitude;
  const displayedValue = mobileOverview ? baseReaction : currentValue;
  const summaryLabel = "In summary:";
  const fallbackProgressByVisual: Record<HeightStepContent["visual"], number> = {
    skydivingAltitude: 0.12,
    skydivingMargin: 0.34,
    baseAltitude: 0.68,
    baseTime: 0.86,
    summary: 0.92,
  };
  const progress = compact ? fallbackProgressByVisual[visual] : scrollProgress;
  const baseTimeMotionProgress = Math.min(Math.max((progress - 0.82) / 0.18, 0), 1);
  const jumperTop =
    mobileOverview
      ? 36
      : visual === "baseTime" && !compact
      ? 68.5 + baseTimeMotionProgress * 17.5
      : 16 + progress * 64;
  const movingTop = `${jumperTop}%`;
  const summaryProgress = compact ? 1 : Math.min(Math.max(activeStepProgress, 0), 1);
  const buildingOpacity = isBase || progress > 0.56 ? "opacity-100" : "opacity-55";

  return (
    <figure className="h-[30rem] min-w-0 border border-border bg-surface p-4 sm:h-[34rem] sm:p-5">
      <figcaption className="h-5 text-sm font-semibold uppercase tracking-wide text-foreground/62">
        {visual === "summary" ? summaryLabel : displayedLabel}
      </figcaption>
      <p
        className={
          visual === "summary"
            ? "mt-4 h-32 max-w-full text-3xl font-semibold leading-tight text-foreground"
            : visual === "baseTime"
            ? "mt-4 h-32 max-w-full text-3xl font-semibold leading-tight text-primary"
            : isBase
            ? "mt-4 h-32 whitespace-nowrap text-2xl font-semibold leading-none text-primary sm:text-3xl xl:text-4xl"
            : "mt-4 h-32 whitespace-nowrap text-2xl font-semibold leading-none text-foreground sm:text-3xl xl:text-4xl"
        }
      >
        {displayedValue}
      </p>
      <div className="mt-3 grid h-64 grid-cols-[4.25rem_minmax(0,1fr)] gap-3 sm:h-72 sm:grid-cols-[4.75rem_minmax(0,1fr)] sm:gap-4">
        <div
          className="relative border-r border-border pr-3 text-right"
          aria-hidden="true"
        >
          <p className="absolute right-3 top-0 text-xs font-semibold leading-tight text-foreground/72">
            4,000 m
          </p>
          <p className="absolute bottom-16 right-3 text-xs font-semibold leading-tight text-foreground/72">
            1,000 m
          </p>
          <p className="absolute bottom-5 right-3 text-xs font-semibold leading-tight text-primary">
            50 m
          </p>
          <p className="absolute bottom-0 right-3 text-xs font-semibold leading-tight text-foreground/72">
            0 m
          </p>
        </div>
        <div className="relative h-full min-w-0" aria-hidden="true">
          <Image
            src="/images/sport/difference/plane.png"
            alt=""
            width={64}
            height={64}
            className={
              isSkydiving || mobileOverview
                ? "absolute left-1 top-0 h-12 w-12 object-contain opacity-100 transition-opacity duration-300 motion-reduce:transition-none"
                : "absolute left-1 top-0 h-12 w-12 object-contain opacity-38 transition-opacity duration-300 motion-reduce:transition-none"
            }
          />
          <Image
            src="/images/sport/difference/building.png"
            alt=""
            width={72}
            height={72}
            className={`absolute bottom-0 left-0 h-20 w-20 object-contain ${buildingOpacity} transition-opacity duration-300 motion-reduce:transition-none`}
          />
          {visual === "summary" ? (
            <Image
              src="/images/sport/difference/canopy.png"
              alt=""
              width={48}
              height={48}
              className="absolute right-8 h-12 w-12 -translate-y-1/2 object-contain motion-reduce:transition-none"
              style={{ top: `${86 + summaryProgress * 6}%` }}
            />
          ) : (
            <>
              {mobileOverview ? (
                <Image
                  src="/images/sport/difference/canopy.png"
                  alt=""
                  width={48}
                  height={48}
                  className="absolute right-20 h-12 w-12 -translate-y-1/2 object-contain"
                  style={{ top: "78%" }}
                />
              ) : null}
              <Image
                src="/images/sport/difference/jumper.png"
                alt=""
                width={48}
                height={48}
                className={
                  mobileOverview
                    ? "absolute left-20 h-10 w-10 -translate-y-1/2 object-contain"
                    : "absolute right-8 h-10 w-10 -translate-y-1/2 object-contain motion-reduce:transition-none"
                }
                style={{ top: movingTop }}
              />
            </>
          )}
        </div>
      </div>
    </figure>
  );
}

function ComparisonTable({
  rows,
  skydivingLabel,
  baseLabel,
  title,
  metricLabel,
}: {
  rows: SportContent["comparison"]["rows"];
  skydivingLabel: string;
  baseLabel: string;
  title: string;
  metricLabel: string;
}) {
  return (
    <section aria-label={title}>
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <div className="mt-4 grid gap-3 sm:hidden">
        {rows.map((row) => (
          <article key={row.label} className="border border-border bg-background/28 p-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground/62">
              {row.label}
            </h4>
            <dl className="mt-3 grid gap-3">
              <div>
                <dt className="text-xs font-semibold text-foreground/62">
                  {skydivingLabel}
                </dt>
                <dd className="mt-1 text-base leading-6 text-foreground/76">
                  {row.skydiving}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-primary">
                  {baseLabel}
                </dt>
                <dd className="mt-1 text-base font-semibold leading-6 text-primary">
                  {row.base}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
      <div className="mt-4 hidden overflow-x-auto border border-border sm:block">
        <table className="min-w-[640px] border-collapse bg-surface text-left">
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="p-3 text-xs font-semibold uppercase tracking-wide text-foreground/62">
                {metricLabel}
              </th>
              <th scope="col" className="p-3 text-sm font-semibold text-foreground">
                {skydivingLabel}
              </th>
              <th scope="col" className="p-3 text-sm font-semibold text-primary">
                {baseLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-border last:border-b-0">
                <th scope="row" className="p-3 text-xs font-semibold uppercase tracking-wide text-foreground/62">
                  {row.label}
                </th>
                <td className="p-3 text-foreground/76">{row.skydiving}</td>
                <td className="p-3 font-semibold text-primary">{row.base}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function EquipmentExplainer({
  content,
  title,
}: {
  content: SportContent["equipmentVisual"];
  title?: string;
}) {
  const defaultEquipmentImage = "/images/sport/equipment/default.jpg";
  const equipmentImages = [
    "/images/sport/equipment/canopy-1.jpg",
    "/images/sport/equipment/container-1.jpg",
    "/images/sport/equipment/pilotchute-1.jpg",
    "/images/sport/equipment/helmet-1.jpg",
    "/images/sport/equipment/wingsuit-1.jpg",
    "/images/sport/equipment/protectors.jpg",
  ];
  const allEquipmentImages = [defaultEquipmentImage, ...equipmentImages];
  const [activeImage, setActiveImage] = useState(defaultEquipmentImage);

  return (
    <section
      aria-labelledby="equipment-title"
      className="px-4 pt-16 pb-28 sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {content.title}
          </p>
          <h2
            id="equipment-title"
            className="mt-3 text-4xl font-semibold leading-tight text-foreground sm:text-6xl"
          >
            {title ?? content.title}
          </h2>
          <p className="mt-5 text-lg leading-8 text-foreground/72">{content.intro}</p>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1fr] lg:items-start">
          <figure className="sticky top-28 hidden h-[70svh] overflow-hidden border-4 border-[#FE6B00] bg-surface-muted lg:block">
            {allEquipmentImages.map((imageSrc) => (
              <Image
                key={imageSrc}
                src={imageSrc}
                alt=""
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className={`object-cover ${
                  imageSrc === activeImage ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--background)_14%,transparent)_0%,color-mix(in_srgb,var(--background)_24%,transparent)_100%)]"
            />
          </figure>
          <ol className="grid gap-4 lg:h-[70svh] lg:grid-rows-6 lg:gap-3">
            {content.items.map((item, index) => (
              <li
                key={item.name}
                className="min-h-32 border-4 border-border bg-surface p-4 transition-colors hover:border-[#FE6B00] focus-within:border-[#FE6B00] lg:min-h-0 lg:p-3"
                onMouseEnter={() =>
                  setActiveImage(equipmentImages[index] ?? defaultEquipmentImage)
                }
                onMouseLeave={() => setActiveImage(defaultEquipmentImage)}
                onFocus={() =>
                  setActiveImage(equipmentImages[index] ?? defaultEquipmentImage)
                }
                onBlur={() => setActiveImage(defaultEquipmentImage)}
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-3xl font-semibold text-foreground lg:mt-1 lg:text-xl">
                  {item.name}
                </h3>
                <p className="mt-3 max-w-xl text-base leading-7 text-foreground/72 lg:mt-1 lg:text-sm lg:leading-5">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function SafetyPhilosophy({
  content,
  title,
}: {
  content: SportContent["safetyPyramid"];
  title?: string;
}) {
  return (
    <section
      aria-labelledby="safety-title"
      className="px-4 pt-16 pb-32 sm:px-6 lg:px-10"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {content.title}
          </p>
          <h2
            id="safety-title"
            className="mt-3 text-4xl font-semibold leading-tight text-foreground sm:text-6xl"
          >
            {title ?? content.title}
          </h2>
          <p className="mt-8 max-w-xl whitespace-pre-line text-3xl font-semibold leading-tight text-primary sm:text-5xl">
            {content.message}
          </p>
        </div>
        <ol className="flex flex-col-reverse gap-3">
          {content.levels.map((level, index) => (
            <li
              key={level}
              className="mx-auto border border-border bg-surface px-5 py-5 text-center text-xl font-semibold text-foreground sm:text-2xl"
              style={{ width: `${100 - index * 12}%` }}
            >
              {level}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function CommunityNetwork({
  content,
  title,
}: {
  content: SportContent["ethicsNetwork"];
  title?: string;
}) {
  return (
    <section
      aria-labelledby="community-title"
      className="px-4 pt-32 pb-36 sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          {content.title}
        </p>
        <h2
          id="community-title"
          className="mt-3 text-4xl font-semibold leading-tight text-foreground sm:text-6xl"
        >
          {title ?? content.title}
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-foreground/72">
          {content.intro}
        </p>
        <ol className="mt-10 grid gap-4 md:grid-cols-5">
          {content.nodes.map((node, index) => (
            <li
              key={node}
              className="relative min-h-36 border border-border bg-surface p-5"
            >
              <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-8 text-2xl font-semibold text-foreground">{node}</h3>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function DisciplinesGallery({
  content,
  title,
}: {
  content: SportContent["disciplines"];
  title?: string;
}) {
  return (
    <section
      aria-labelledby="disciplines-title"
      className="px-4 pt-24 pb-28 sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              {content.title}
            </p>
            <h2
              id="disciplines-title"
              className="mt-3 text-4xl font-semibold leading-tight text-foreground sm:text-6xl"
            >
              {title ?? content.title}
            </h2>
          </div>
        </div>
        <div className="mt-10 overflow-x-auto pb-4 [-webkit-overflow-scrolling:touch] md:overflow-visible md:pb-0">
          <div className="flex snap-x gap-4 md:grid md:snap-none md:grid-cols-2 lg:grid-cols-3">
            {content.items.map((item, index) => (
              <article
                key={item.title}
                className="min-w-[82vw] snap-center overflow-hidden border border-border bg-surface sm:min-w-[420px] md:min-w-0 md:snap-align-none"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
                  <Image
                    src={disciplineImages[index % disciplineImages.length]}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-5 text-3xl font-semibold leading-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-foreground/72">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ThenVsNow({
  content,
  title,
}: {
  content: SportContent["thenVsNow"];
  title?: string;
}) {
  return (
    <section
      aria-labelledby="then-now-title"
      className="px-4 pt-36 pb-36 sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          {content.title}
        </p>
        <h2
          id="then-now-title"
          className="mt-3 text-4xl font-semibold leading-tight text-foreground sm:text-6xl"
        >
          {title ?? content.title}
        </h2>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <TransformationColumn
            label={content.thenLabel}
            items={content.rows.map((row) => row.then)}
          />
          <TransformationColumn
            label={content.nowLabel}
            items={content.rows.map((row) => row.now)}
            accent
          />
        </div>
      </div>
    </section>
  );
}

function SourcesSection({
  content,
  disclaimer,
}: {
  content: SportContent["sources"];
  disclaimer: string;
}) {
  return (
    <section
      aria-labelledby="sources-title"
      className="px-4 pt-36 pb-16 sm:px-6 lg:px-10"
    >
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.55fr_1fr]">
        <div>
          <h2
            id="sources-title"
            className="text-3xl font-semibold leading-tight text-foreground sm:text-5xl"
          >
            {content.title}
          </h2>
          <p className="mt-5 border-l-2 border-primary pl-5 text-sm leading-6 text-foreground/72">
            {disclaimer}
          </p>
        </div>
        <div className="max-w-reading space-y-5 text-base leading-8 text-foreground/78">
          {content.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <h3 className="font-semibold text-foreground">{content.listTitle}</h3>
          <ul className="grid gap-2">
            {content.items.map((item) => (
              <li key={item} className="border-t border-border pt-3">
                {item}
              </li>
            ))}
          </ul>
          <p>{content.closing}</p>
        </div>
      </div>
    </section>
  );
}

function TransformationColumn({
  label,
  items,
  accent = false,
}: {
  label: string;
  items: string[];
  accent?: boolean;
}) {
  return (
    <div className="border border-border bg-surface p-5">
      <h3
        className={
          accent
            ? "text-4xl font-semibold text-primary"
            : "text-4xl font-semibold text-foreground"
        }
      >
        {label}
      </h3>
      <ul className="mt-8 grid gap-4">
        {items.map((item) => (
          <li
            key={item}
            className="border-t border-border pt-4 text-lg leading-7 text-foreground/78"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
