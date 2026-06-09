"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { sport as sportContent } from "@/content/en/sport";

type SportContent = typeof sportContent;

type SportPageProps = {
  content: SportContent;
};

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
      <SafetyPhilosophy content={content.safetyPyramid} title={safety?.title} />
      <CommunityNetwork content={content.ethicsNetwork} title={community?.title} />
      <DisciplinesGallery content={content.disciplines} title={disciplines?.title} />
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
      className="px-4 py-16 sm:px-6 lg:px-10 lg:py-0"
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
                className="grid min-h-[64svh] gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center"
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
        className="absolute inset-0 border border-primary/30 mix-blend-screen"
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
  return (
    <section
      aria-labelledby="comparison-title"
      className="min-h-screen px-4 py-16 sm:px-6 lg:px-10"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.65fr_1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {content.title}
          </p>
          <h2
            id="comparison-title"
            className="mt-3 text-4xl font-semibold leading-tight text-foreground sm:text-6xl"
          >
            {title ?? content.title}
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-foreground/72">
            {content.intro}
          </p>
        </div>
        <div className="grid gap-5">
          <div className="grid min-h-96 grid-cols-2 gap-4">
            <AltitudeColumn
              label={content.skydivingLabel}
              value={content.skydivingAltitude}
              tall
            />
            <AltitudeColumn label={content.baseLabel} value={content.baseAltitude} />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <MetricCard
              label={content.altitudeLabel}
              values={[content.skydivingAltitude, content.baseAltitude]}
            />
            <MetricCard
              label={content.reactionLabel}
              values={[content.skydivingReaction, content.baseReaction]}
              accentSecond
            />
          </div>
          <dl className="grid gap-2">
            {content.rows.map((row) => (
              <div
                key={row.label}
                className="grid gap-0 overflow-hidden border border-border bg-surface md:grid-cols-[180px_1fr_1fr]"
              >
                <dt className="bg-background/40 p-3 text-xs font-semibold uppercase tracking-wide text-foreground/62">
                  {row.label}
                </dt>
                <dd className="p-3 text-foreground/78">{row.skydiving}</dd>
                <dd className="border-t border-border p-3 font-medium text-primary md:border-l md:border-t-0">
                  {row.base}
                </dd>
              </div>
            ))}
          </dl>
        </div>
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
  return (
    <section aria-labelledby="equipment-title" className="px-4 py-16 sm:px-6 lg:px-10">
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
          <div className="sticky top-28 hidden h-[70svh] overflow-hidden bg-surface-muted lg:block">
            <div className="absolute inset-8 border border-primary/60" />
            <div className="absolute left-1/2 top-10 h-20 w-20 -translate-x-1/2 rounded-full border border-border bg-background/80" />
            <div className="absolute left-1/2 top-36 h-52 w-36 -translate-x-1/2 border border-border bg-background/70" />
            <div className="absolute bottom-16 left-1/2 h-36 w-64 -translate-x-1/2 border border-primary/60 bg-primary/10" />
          </div>
          <ol className="grid gap-4">
            {content.items.map((item, index) => (
              <li
                key={item.name}
                className="min-h-44 border border-border bg-surface p-5"
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-5 text-3xl font-semibold text-foreground">
                  {item.name}
                </h3>
                <p className="mt-4 max-w-xl text-base leading-7 text-foreground/72">
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
      className="min-h-screen px-4 py-16 sm:px-6 lg:px-10"
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
    <section aria-labelledby="community-title" className="px-4 py-16 sm:px-6 lg:px-10">
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
      className="px-4 py-16 sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          {content.title}
        </p>
        <h2
          id="disciplines-title"
          className="mt-3 text-4xl font-semibold leading-tight text-foreground sm:text-6xl"
        >
          {title ?? content.title}
        </h2>
        <div className="mt-10 flex snap-x gap-4 overflow-x-auto pb-4 [-webkit-overflow-scrolling:touch]">
          {content.items.map((item, index) => (
            <article
              key={item.title}
              className="min-w-[82vw] snap-center overflow-hidden border border-border bg-surface sm:min-w-[420px]"
            >
              <VisualPlaceholder index={index} compact />
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
      className="min-h-screen px-4 py-16 sm:px-6 lg:px-10"
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
    <section aria-labelledby="sources-title" className="px-4 py-16 sm:px-6 lg:px-10">
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

function AltitudeColumn({
  label,
  value,
  tall = false,
}: {
  label: string;
  value: string;
  tall?: boolean;
}) {
  return (
    <div className="flex flex-col justify-end border border-border bg-surface p-4">
      <div
        className={
          tall
            ? "h-full border-l-2 border-foreground/40"
            : "h-1/4 border-l-2 border-primary"
        }
      />
      <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-foreground/62">
        {label}
      </p>
      <p
        className={
          tall
            ? "mt-2 text-2xl font-semibold text-foreground"
            : "mt-2 text-2xl font-semibold text-primary"
        }
      >
        {value}
      </p>
    </div>
  );
}

function MetricCard({
  label,
  values,
  accentSecond = false,
}: {
  label: string;
  values: string[];
  accentSecond?: boolean;
}) {
  return (
    <div className="border border-border bg-surface p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-foreground/62">
        {label}
      </p>
      <div className="mt-4 grid gap-2">
        {values.map((value, index) => (
          <p
            key={value}
            className={
              accentSecond && index === 1
                ? "text-lg font-semibold text-primary"
                : "text-lg text-foreground/82"
            }
          >
            {value}
          </p>
        ))}
      </div>
    </div>
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

function VisualPlaceholder({
  index,
  compact = false,
}: {
  index: number;
  compact?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={
        compact
          ? "aspect-[4/3] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--primary)_18%,transparent),color-mix(in_srgb,var(--surface-muted)_82%,transparent))]"
          : "min-h-80 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--primary)_16%,transparent),color-mix(in_srgb,var(--surface-muted)_84%,transparent))] p-5"
      }
    >
      <div
        className="h-full border border-primary/45"
        style={{ opacity: 0.55 + (index % 3) * 0.12 }}
      />
    </div>
  );
}
