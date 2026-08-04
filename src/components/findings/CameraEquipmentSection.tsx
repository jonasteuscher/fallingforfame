"use client";

import Image from "next/image";
import {
  type CSSProperties,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  cameraEquipmentStateRanges,
  getCameraEquipmentState,
  getCameraEquipmentStateOpacity,
  getCameraFocus,
  interpolate,
} from "@/components/findings/cameraEquipmentProgress";
import type {
  CameraEquipmentHotspot,
  CameraEquipmentState,
  CameraEquipmentStateId,
  FindingChapter,
  FindingNarrativeState,
} from "@/types/findings";

type CameraEquipmentSectionProps = {
  chapter: FindingChapter;
  sourcePrefix: string;
  empiricalLabel: string;
  interpretationLabel: string;
};

type CalloutPlacement = {
  side: "top" | "right" | "bottom" | "left";
  x: number;
  y: number;
  startX: number;
  startY: number;
  path: string;
  anchored?: boolean;
};

export function CameraEquipmentSection({
  chapter,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
}: CameraEquipmentSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const scrubRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [useLaptopCallouts, setUseLaptopCallouts] = useState(false);
  const states = useCameraStates(chapter.states);

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

    return () => motionQuery.removeEventListener("change", updateReducedMotion);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const laptopQuery = window.matchMedia?.(
      "(min-width: 1280px) and (max-width: 1599px)",
    );

    if (!laptopQuery) {
      return;
    }

    function updateLaptopCallouts() {
      setUseLaptopCallouts(laptopQuery.matches);
    }

    updateLaptopCallouts();
    laptopQuery.addEventListener("change", updateLaptopCallouts);

    return () => laptopQuery.removeEventListener("change", updateLaptopCallouts);
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
        const scrub = scrubRef.current;

        if (!scrub) {
          return;
        }

        const scrubTop = scrub.getBoundingClientRect().top + window.scrollY;
        const scrubDistance = scrub.offsetHeight - window.innerHeight;
        const nextProgress =
          scrubDistance <= 0 ? 1 : (window.scrollY - scrubTop) / scrubDistance;

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

  if (!chapter.image) {
    return null;
  }

  if (reducedMotion) {
    return (
      <section
        id={chapter.id}
        aria-labelledby={`${chapter.id}-title`}
        className="scroll-mt-24 border-t border-border px-4 py-[var(--section-gap-immersive)] sm:px-6 xl:px-10"
      >
        <StaticCameraEquipment
          chapter={chapter}
          states={states}
          sourcePrefix={sourcePrefix}
          empiricalLabel={empiricalLabel}
          interpretationLabel={interpretationLabel}
          mode="reduced-motion"
        />
      </section>
    );
  }

  const activeStateId = getCameraEquipmentState(progress);
  const activeState = states.find((state) => state.id === activeStateId) ?? states[0];
  const focus = getCameraFocus(progress);

  return (
    <section
      id={chapter.id}
      ref={sectionRef}
      aria-labelledby={`${chapter.id}-title`}
      className="relative scroll-mt-24 border-t border-border"
    >
      <p className="sr-only">{chapter.accessibleSummary}</p>
      <StaticCameraEquipment
        chapter={chapter}
        states={states}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
        mode="mobile"
      />

      <div
        ref={scrubRef}
        className="hidden min-h-[390svh] xl:block motion-reduce:hidden"
      >
        <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-visible bg-background">
          <div className="mx-auto grid h-full max-w-7xl grid-rows-[auto_1fr] gap-8 px-6 pb-10 pt-20 xl:px-10">
            <CameraSectionHeading chapter={chapter} />
            <div className="grid min-h-0 items-start gap-8 lg:grid-cols-[minmax(34rem,1.18fr)_minmax(20rem,0.82fr)] lg:gap-12">
              <CameraImageStage
                chapter={chapter}
                activeState={activeState}
                focus={focus}
                useLaptopCallouts={useLaptopCallouts}
              />
              <CameraNarrative
                chapter={chapter}
                states={states}
                progress={progress}
                activeState={activeState}
                sourcePrefix={sourcePrefix}
                empiricalLabel={empiricalLabel}
                interpretationLabel={interpretationLabel}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 hidden pb-[var(--section-gap-standard)] xl:block">
        <div className="camera-summary-wrap mx-auto max-w-7xl px-6 xl:px-10">
          <CameraFindingSummary
            chapter={chapter}
            sourcePrefix={sourcePrefix}
            empiricalLabel={empiricalLabel}
            interpretationLabel={interpretationLabel}
          />
        </div>
      </div>
    </section>
  );
}

function CameraSectionHeading({ chapter }: { chapter: FindingChapter }) {
  return (
    <header className="relative z-10 overflow-visible">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
        {chapter.eyebrow}
      </p>
      <h2
        id={`${chapter.id}-title`}
        className="mt-5 max-w-[24ch] overflow-visible pt-2 text-[clamp(3rem,5.4vw,6.5rem)] font-semibold uppercase leading-[0.9] text-foreground [text-wrap:balance]"
      >
        {chapter.title}
      </h2>
    </header>
  );
}

function CameraNarrative({
  chapter,
  states,
  progress,
  activeState,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
}: {
  chapter: FindingChapter;
  states: CameraEquipmentState[];
  progress: number;
  activeState: CameraEquipmentState;
  sourcePrefix: string;
  empiricalLabel: string;
  interpretationLabel: string;
}) {
  const conclusionOpacity = interpolate(progress, 0.78, 0.94, 0, 1);

  return (
    <div className="relative z-10 flex min-h-0 max-w-[35rem] flex-col justify-start">
      <p className="max-w-[34rem] text-base leading-7 text-foreground/74 lg:text-lg lg:leading-8">
        {chapter.summary}
      </p>

      <div className="relative mt-6 min-h-[7.25rem] max-w-[34rem]" aria-live="polite">
        {states.map((state) => {
          const range = cameraEquipmentStateRanges.find((item) => item.id === state.id);
          const opacity = range
            ? getCameraEquipmentStateOpacity(progress, range)
            : state.id === activeState.id
              ? 1
              : 0;
          const isActive = state.id === activeState.id;
          const displayOpacity = isActive ? Math.max(opacity, 0.96) : opacity * 0.28;

          return (
            <article
              key={state.id}
              className="absolute inset-0 border-l border-primary/70 pl-5"
              style={{
                opacity: displayOpacity,
                transform: `translate3d(0, ${interpolate(displayOpacity, 0, 1, 12, 0)}px, 0)`,
              }}
              aria-hidden={state.id !== activeState.id}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {state.title}
              </p>
              <p className="mt-2 text-lg leading-7 text-foreground/82">{state.body}</p>
            </article>
          );
        })}
      </div>

      <div
        className="camera-conclusion mt-6 max-w-[39rem]"
        style={{
          opacity: conclusionOpacity,
          transform: `translate3d(0, calc(${interpolate(conclusionOpacity, 0, 1, 22, 0)}px + var(--camera-conclusion-offset-y, 0px)), 0)`,
        }}
      >
        <p className="whitespace-pre-line border-l-2 border-primary pl-5 text-[clamp(2rem,3.4vw,4.3rem)] font-semibold leading-[1.02] text-foreground">
          {splitFinding(chapter.finding)}
        </p>
      </div>

      <CameraFindingSummary
        chapter={chapter}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
        compact
      />
    </div>
  );
}

function CameraImageStage({
  chapter,
  activeState,
  focus,
  useLaptopCallouts,
}: {
  chapter: FindingChapter;
  activeState: CameraEquipmentState;
  focus: ReturnType<typeof getCameraFocus>;
  useLaptopCallouts: boolean;
}) {
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const figureRef = useRef<HTMLElement | null>(null);
  const hotspotRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const popupCloseRef = useRef<HTMLButtonElement | null>(null);
  const activeHotspots = activeState.hotspots ?? [];
  const selectedHotspot = activeHotspots.find(
    (hotspot) => hotspot.id === selectedHotspotId,
  );
  const showHotspots = activeState.id !== "decision";

  const closePopup = useCallback(() => {
    setSelectedHotspotId(null);
  }, []);

  useEffect(() => {
    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        closePopup();
      }
    }

    document.addEventListener("keydown", closeOnEscape);

    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [closePopup]);

  useEffect(() => {
    function closeOnOutsidePointer(event: PointerEvent) {
      if (!selectedHotspotId) {
        return;
      }

      const target = event.target as Element;

      if (
        !target.closest("[data-camera-callout]") &&
        !target.closest("[data-camera-hotspot-button]")
      ) {
        closePopup();
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);

    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [closePopup, selectedHotspotId]);

  useEffect(() => {
    if (selectedHotspot) {
      popupCloseRef.current?.focus();
    }
  }, [selectedHotspot]);

  const focusHotspot = useCallback(
    (index: number) => {
      const nextIndex = (index + activeHotspots.length) % activeHotspots.length;
      hotspotRefs.current[nextIndex]?.focus();
    },
    [activeHotspots.length],
  );

  const selectedPlacement = selectedHotspot
    ? getCalloutPlacement(selectedHotspot, useLaptopCallouts)
    : null;

  return (
    <figure
      ref={figureRef}
      className="relative mt-12 aspect-[4/5] h-[min(66svh,45rem)] w-full max-w-[min(54vw,43rem)] overflow-visible lg:ml-0 lg:mr-36 xl:mr-44"
      aria-labelledby={`${chapter.id}-visual-summary`}
    >
      <figcaption id={`${chapter.id}-visual-summary`} className="sr-only">
        {chapter.accessibleSummary}
      </figcaption>
      <style>
        {`
          @keyframes camera-callout-popup-in {
            from { opacity: 0; transform: var(--camera-callout-transform) translate3d(0, 0.35rem, 0); }
            to { opacity: 1; transform: var(--camera-callout-transform) translate3d(0, 0, 0); }
          }
        `}
      </style>
      <div className="absolute inset-0 overflow-hidden bg-background shadow-[0_30px_100px_color-mix(in_srgb,var(--background)_78%,black)]">
        <div
          className="absolute inset-0"
          style={{
            transform: `translate3d(${focus.imageX}%, ${focus.imageY}%, 0) scale(${focus.imageScale})`,
            filter: "brightness(1.08) contrast(1.12) saturate(1.03)",
          }}
        >
          <Image
            src={chapter.image?.src ?? ""}
            alt={chapter.image?.alt ?? ""}
            fill
            sizes="(max-width: 1024px) 92vw, 55vw"
            quality={92}
            className="object-cover object-[50%_38%]"
          />
        </div>
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,transparent_0,transparent_var(--camera-mask-radius),color-mix(in_srgb,var(--background)_32%,transparent)_calc(var(--camera-mask-radius)+11%)),radial-gradient(circle_at_50%_52%,transparent_44%,color-mix(in_srgb,var(--background)_34%,transparent)_100%)]"
          style={{ "--camera-mask-radius": `${focus.maskRadius}%` } as CSSProperties}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--background)_8%,transparent),transparent_24%,transparent_72%,color-mix(in_srgb,var(--background)_30%,transparent))]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[color-mix(in_srgb,var(--background)_36%,black)] mix-blend-multiply"
          style={{ opacity: focus.subduedOpacity }}
          aria-hidden="true"
        />
      </div>
      <div className="absolute inset-0 hidden md:block" data-camera-annotation-layer>
        {selectedHotspot && selectedPlacement && !useLaptopCallouts ? (
          <svg
            className="pointer-events-none absolute inset-0 overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d={selectedPlacement.path}
              fill="none"
              stroke="var(--primary)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="0.18"
              pathLength={1}
              style={{
                strokeDasharray: 1,
                strokeDashoffset: 1,
              }}
            >
              <animate
                attributeName="stroke-dashoffset"
                from="1"
                to="0"
                dur="220ms"
                fill="freeze"
              />
            </path>
          </svg>
        ) : null}
        {showHotspots
          ? activeHotspots.map((hotspot, index) => (
              <EquipmentHotspotButton
                key={`${activeState.id}-${hotspot.id}`}
                hotspot={hotspot}
                expanded={selectedHotspot?.id === hotspot.id}
                buttonRef={(node) => {
                  hotspotRefs.current[index] = node;
                }}
                onToggle={() =>
                  setSelectedHotspotId((current) =>
                    current === hotspot.id ? null : hotspot.id,
                  )
                }
                onMove={(direction) => focusHotspot(index + direction)}
                activeStateId={activeState.id}
              />
            ))
          : null}
        {selectedHotspot && selectedPlacement ? (
          <CameraCallout
            hotspot={selectedHotspot}
            placement={selectedPlacement}
            activeStateId={activeState.id}
            closeRef={popupCloseRef}
            onClose={closePopup}
          />
        ) : null}
      </div>
      <div className="absolute inset-x-5 bottom-5 md:hidden">
        <p className="border border-border bg-background/84 p-4 text-sm leading-6 text-foreground/78 backdrop-blur">
          {activeState.body}
        </p>
      </div>
    </figure>
  );
}

function EquipmentHotspotButton({
  hotspot,
  expanded,
  onToggle,
  onMove,
  buttonRef,
  activeStateId,
}: {
  hotspot: CameraEquipmentHotspot;
  expanded: boolean;
  onToggle: () => void;
  onMove: (direction: number) => void;
  buttonRef: (node: HTMLButtonElement | null) => void;
  activeStateId: CameraEquipmentStateId;
}) {
  const tooltipId = `camera-hotspot-${activeStateId}-${hotspot.id}`;
  return (
    <div className="absolute" style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}>
      <button
        ref={buttonRef}
        type="button"
        data-camera-hotspot-button
        className="group relative z-20 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary"
        aria-label={`${hotspot.label}: ${hotspot.description}`}
        aria-expanded={expanded}
        aria-controls={tooltipId}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            event.preventDefault();
            onMove(1);
          }

          if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
            event.preventDefault();
            onMove(-1);
          }
        }}
      >
        <span
          className="h-3 w-3 border border-primary bg-background transition group-hover:scale-110 group-aria-expanded:bg-primary motion-reduce:transition-none"
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

function CameraCallout({
  hotspot,
  placement,
  activeStateId,
  closeRef,
  onClose,
}: {
  hotspot: CameraEquipmentHotspot;
  placement: CalloutPlacement;
  activeStateId: CameraEquipmentStateId;
  closeRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}) {
  const tooltipId = `camera-hotspot-${activeStateId}-${hotspot.id}`;
  const calloutStyle = placement.anchored
    ? {
        left: "1rem",
        bottom: "1rem",
        "--camera-callout-transform": "translate(0, 0)",
        animation: "camera-callout-popup-in 180ms ease-out 130ms both",
      }
    : {
        left: `${placement.x}%`,
        top: `${placement.y}%`,
        "--camera-callout-transform": getCalloutTransform(placement),
        animation: "camera-callout-popup-in 180ms ease-out 130ms both",
      };

  return (
    <div
      id={tooltipId}
      role="dialog"
      data-camera-callout
      data-hotspot-id={hotspot.id}
      aria-label={hotspot.label}
      onKeyDown={(event) => {
        if (event.key === "Tab") {
          event.preventDefault();
          closeRef.current?.focus();
        }
      }}
      className="camera-callout pointer-events-auto absolute z-30 w-[17rem] border border-border bg-[#07111f]/96 px-4 py-3 text-left text-sm leading-6 text-white opacity-100 transition-opacity duration-200 motion-reduce:transition-none"
      style={calloutStyle as CSSProperties}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          {hotspot.label}
        </p>
        <button
          ref={closeRef}
          type="button"
          className="min-h-6 min-w-6 cursor-pointer text-xs font-semibold uppercase tracking-[0.12em] text-white/74 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="Close annotation"
          onClick={onClose}
        >
          x
        </button>
      </div>
      <p className="mt-1 text-white/82">{hotspot.description}</p>
    </div>
  );
}

function StaticCameraEquipment({
  chapter,
  states,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
  mode,
}: {
  chapter: FindingChapter;
  states: CameraEquipmentState[];
  sourcePrefix: string;
  empiricalLabel: string;
  interpretationLabel: string;
  mode: "mobile" | "reduced-motion";
}) {
  return (
    <div
      className={[
        "mx-auto max-w-7xl",
        mode === "mobile"
          ? "findings-flow-layout block px-4 py-[var(--section-gap-immersive)] sm:px-6 xl:hidden"
          : "",
      ].join(" ")}
    >
      <header className="max-w-[44rem]">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
          {chapter.eyebrow}
        </p>
        <h2
          id={mode === "reduced-motion" ? `${chapter.id}-title` : undefined}
          className="mt-4 text-[clamp(2.6rem,13vw,5rem)] font-semibold uppercase leading-[0.92] text-foreground [text-wrap:balance]"
        >
          {chapter.title}
        </h2>
        <p className="mt-6 text-lg leading-8 text-foreground/76">{chapter.summary}</p>
      </header>

      <figure className="mt-9">
        <div className="relative aspect-[4/5] overflow-hidden bg-surface">
          <Image
            src={chapter.image?.src ?? ""}
            alt={chapter.image?.alt ?? ""}
            fill
            sizes="(max-width: 767px) 100vw, 55vw"
            quality={90}
            className="object-contain brightness-[1.06] contrast-[1.08]"
          />
        </div>
        <figcaption className="sr-only">{chapter.accessibleSummary}</figcaption>
      </figure>

      <div className="mt-8 grid gap-5">
        {states.map((state) => (
          <details
            key={state.id}
            className="group border-l border-primary/70 pl-5"
            open={state.id === "camera"}
          >
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 border-b border-border/70 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary transition hover:border-primary/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none">
              <span>{state.title}</span>
              <span
                className="grid h-6 w-6 shrink-0 place-items-center border border-primary/60 text-base leading-none transition group-open:rotate-45 motion-reduce:transition-none"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="mt-2 text-lg leading-8 text-foreground/78">{state.body}</p>
            {state.hotspots?.length ? (
              <ol className="mt-3 grid gap-2 text-sm leading-6 text-foreground/68">
                {state.hotspots.map((hotspot, index) => (
                  <li key={hotspot.id} className="grid grid-cols-[1.75rem_1fr] gap-2">
                    <span className="font-semibold text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="font-semibold text-foreground">
                        {hotspot.label}:
                      </span>{" "}
                      {hotspot.description}
                    </span>
                  </li>
                ))}
              </ol>
            ) : null}
          </details>
        ))}
      </div>

      <p className="mt-10 whitespace-pre-line border-l-2 border-primary pl-5 text-[clamp(2rem,10vw,3.4rem)] font-semibold leading-[1.02] text-foreground">
        {splitFinding(chapter.finding)}
      </p>

      <CameraFindingSummary
        chapter={chapter}
        sourcePrefix={sourcePrefix}
        empiricalLabel={empiricalLabel}
        interpretationLabel={interpretationLabel}
      />
    </div>
  );
}

function CameraFindingSummary({
  chapter,
  sourcePrefix,
  empiricalLabel,
  interpretationLabel,
  compact = false,
}: {
  chapter: FindingChapter;
  sourcePrefix: string;
  empiricalLabel: string;
  interpretationLabel: string;
  compact?: boolean;
}) {
  return (
    <aside
      className={[
        "border border-border bg-background/72",
        compact ? "mt-8 p-4 text-sm lg:hidden" : "mt-10 p-5 sm:p-7",
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

function useCameraStates(states?: FindingNarrativeState[]) {
  return useMemo(
    () =>
      (states ?? []).filter(
        (state): state is CameraEquipmentState =>
          Boolean(state.id) &&
          cameraEquipmentStateRanges.some((range) => range.id === state.id),
      ),
    [states],
  );
}

function getPreferredEdge(hotspot: CameraEquipmentHotspot) {
  if (hotspot.preferredSide) {
    return hotspot.preferredSide;
  }

  if (hotspot.x > 68) {
    return "left";
  }

  if (hotspot.x < 32) {
    return "right";
  }

  if (hotspot.y < 22) {
    return "bottom";
  }

  if (hotspot.y > 78) {
    return "top";
  }

  return "right";
}

function getCalloutPlacement(
  hotspot: CameraEquipmentHotspot,
  useLaptopCallouts = false,
): CalloutPlacement {
  if (useLaptopCallouts) {
    const x = clamp(hotspot.x, 28, 72);
    const y = clamp(hotspot.y - 10, 20, 70);
    const path = `M ${x} ${y} L ${hotspot.x} ${hotspot.y}`;

    return {
      side: "top",
      x,
      y,
      startX: x,
      startY: y,
      path,
      anchored: true,
    };
  }

  const side = getPreferredEdge(hotspot);
  const x =
    hotspot.calloutX ??
    (side === "left" ? -7 : side === "right" ? 106 : clamp(hotspot.x, 18, 82));
  const y =
    hotspot.calloutY ??
    (side === "top" ? -5 : side === "bottom" ? 105 : clamp(hotspot.y, 16, 84));
  const startX = hotspot.calloutLineStartX ?? x;
  const startY = hotspot.calloutLineStartY ?? y;
  const path = `M ${startX} ${startY} L ${hotspot.x} ${hotspot.y}`;

  return {
    side,
    x,
    y,
    startX,
    startY,
    path,
  };
}

function getCalloutTransform(placement: CalloutPlacement) {
  if (placement.anchored) {
    return "translate(-50%, calc(-100% - 1rem))";
  }

  if (
    placement.x >= 0 &&
    placement.x <= 100 &&
    placement.y >= 0 &&
    placement.y <= 100
  ) {
    return "translate(0, 0)";
  }

  if (placement.side === "left") {
    return "translate(-100%, -50%)";
  }

  if (placement.side === "right") {
    return "translate(0, -50%)";
  }

  if (placement.side === "top") {
    return "translate(-50%, -100%)";
  }

  return "translate(-50%, 0)";
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function splitFinding(finding: string) {
  return finding.replace(". ", ".\n");
}
