"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { FindingsPageContent } from "@/types/findings";

type FindingsHeroProps = {
  content: FindingsPageContent;
};

export function FindingsHero({ content }: FindingsHeroProps) {
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

        setProgress(clamp(nextProgress, 0, 1));
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

  const displayProgress = reducedMotion ? 0.98 : progress;
  const socialOpacity = reducedMotion
    ? 0
    : interpolate(displayProgress, 0.18, 0.45, 1, 0);
  const socialBlur = interpolate(displayProgress, 0.22, 0.45, 0, 5);
  const topUiY = interpolate(displayProgress, 0.18, 0.45, 0, -24);
  const captionY = interpolate(displayProgress, 0.18, 0.45, 0, 24);
  const actionX = interpolate(displayProgress, 0.18, 0.45, 0, 28);
  const eyebrowOpacity = interpolate(displayProgress, 0.65, 0.76, 0, 1);
  const titleOpacity = interpolate(displayProgress, 0.68, 0.84, 0, 1);
  const titleY = interpolate(displayProgress, 0.68, 0.84, 24, 0);
  const introOpacity = interpolate(displayProgress, 0.78, 0.91, 0, 1);
  const thesisOpacity = interpolate(displayProgress, 0.88, 1, 0, 1);
  const mediaScale = reducedMotion ? 1 : interpolate(displayProgress, 0, 1, 1.006, 1);
  const textGradientOpacity = interpolate(displayProgress, 0.62, 0.94, 0, 0.44);
  const bottomGradientOpacity = interpolate(displayProgress, 0.76, 1, 0.08, 0.28);

  return (
    <section
      id="findings-hero"
      ref={sectionRef}
      className="relative h-[175svh] min-h-[980px] md:h-[220svh] md:min-h-[1320px]"
      aria-labelledby="findings-hero-title"
    >
      <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden bg-background">
        <div className="absolute inset-0">
          <Image
            src={content.hero.media.src}
            alt={content.hero.media.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[43%_35%] will-change-transform sm:object-[46%_35%] lg:object-[48%_36%]"
            style={{ transform: `scale(${mediaScale})` }}
          />
        </div>
        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--background)_74%,transparent)_0%,color-mix(in_srgb,var(--background)_34%,transparent)_34%,transparent_68%)]"
          style={{ opacity: textGradientOpacity }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,transparent_64%,color-mix(in_srgb,var(--background)_40%,transparent)_100%)]"
          style={{ opacity: bottomGradientOpacity }}
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute inset-x-4 top-5 z-10 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-white/78 sm:inset-x-6 lg:inset-x-10"
          style={{
            opacity: socialOpacity,
            filter: `blur(${socialBlur}px)`,
            transform: `translate3d(0, ${topUiY}px, 0)`,
          }}
          aria-hidden="true"
        >
          <span className="inline-flex items-center gap-2">
            {content.hero.socialPost.sourceLabel}
            <span className="text-2xl leading-none text-primary" aria-hidden="true">
              ↓
            </span>
          </span>
          <span
            className="text-lg leading-none"
            aria-label={content.hero.socialPost.menuLabel}
          >
            •••
          </span>
        </div>

        <div
          className="pointer-events-none absolute bottom-[clamp(1.5rem,5vh,3.5rem)] left-4 z-10 max-w-[23rem] text-white/90 sm:left-6 lg:left-10"
          style={{
            opacity: socialOpacity,
            filter: `blur(${socialBlur}px)`,
            transform: `translate3d(0, ${captionY}px, 0)`,
          }}
          aria-hidden="true"
        >
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/54">
            {content.hero.socialPost.views}
          </p>
          <p className="mt-3 text-[0.95rem] font-semibold leading-6">
            {content.hero.socialPost.username}
          </p>
          <p className="text-[0.9rem] leading-6 text-white/72 max-sm:hidden">
            {content.hero.socialPost.role}
          </p>
          <p className="mt-2 text-[0.95rem] leading-6">
            {content.hero.socialPost.caption}
          </p>
          <p className="mt-2 text-[0.78rem] font-semibold leading-5 text-white/68 sm:hidden">
            {content.hero.socialPost.actions[0]?.value}
          </p>
          <p className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[0.85rem] leading-6 text-white/62 max-sm:hidden">
            {content.hero.socialPost.hashtags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </p>
          <div className="mt-5 space-y-2 text-[0.78rem] leading-5 text-white/62 max-lg:hidden">
            {content.hero.socialPost.comments.slice(0, 2).map((comment) => (
              <p key={`${comment.author}-${comment.text}`}>
                <span className="font-semibold text-white/76">{comment.author}:</span>{" "}
                {comment.text}
              </p>
            ))}
          </div>
        </div>

        <div
          className="pointer-events-none absolute bottom-[clamp(2rem,8vh,4.5rem)] right-4 z-10 hidden w-20 flex-col items-center gap-5 text-center text-[0.7rem] font-semibold text-white/78 sm:flex"
          style={{
            opacity: socialOpacity,
            filter: `blur(${socialBlur}px)`,
            transform: `translate3d(${actionX}px, 0, 0)`,
          }}
          aria-hidden="true"
        >
          {content.hero.socialPost.actions.map((action, index) => (
            <div key={action.label} className={index > 1 ? "hidden md:block" : "block"}>
              <span className="block text-2xl leading-none text-white/86">
                {action.icon}
              </span>
              <span className="mt-1 block leading-tight">{action.value}</span>
            </div>
          ))}
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-4 pb-[clamp(2.75rem,7vh,5.5rem)] sm:px-6 xl:px-10">
          <div className="max-w-[min(58vw,56rem)] max-lg:max-w-[42rem] max-sm:max-w-[21rem]">
            <p
              className="text-xs font-semibold uppercase tracking-[0.24em] text-primary sm:text-sm"
              style={{
                opacity: eyebrowOpacity,
                transform: `translate3d(0, ${interpolate(displayProgress, 0.24, 0.44, 12, 0)}px, 0)`,
              }}
            >
              {content.hero.eyebrow}
            </p>
            <h1
              id="findings-hero-title"
              className="mt-4 whitespace-pre-line text-[clamp(3.1rem,7vw,8.25rem)] font-semibold uppercase leading-[0.89] text-foreground [text-wrap:balance] max-sm:text-[clamp(2.65rem,14vw,4.75rem)]"
              style={{
                opacity: titleOpacity,
                transform: `translate3d(0, ${titleY}px, 0)`,
              }}
            >
              {content.hero.title}
            </h1>
            <p
              className="mt-6 max-w-[38rem] text-lg font-semibold leading-7 text-foreground/86 sm:text-2xl sm:leading-tight"
              style={{
                opacity: introOpacity,
                transform: `translate3d(0, ${interpolate(displayProgress, 0.68, 0.82, 18, 0)}px, 0)`,
              }}
            >
              {content.hero.intro}
            </p>
            <p
              className="mt-5 max-w-[38rem] border-l-2 border-primary pl-4 text-xl font-semibold leading-tight text-foreground sm:text-3xl"
              style={{
                opacity: thesisOpacity,
                transform: `translate3d(0, ${interpolate(displayProgress, 0.82, 0.96, 18, 0)}px, 0)`,
              }}
            >
              {content.hero.centralStatement}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function interpolate(
  progress: number,
  inputStart: number,
  inputEnd: number,
  outputStart: number,
  outputEnd: number,
) {
  if (inputStart === inputEnd) {
    return outputEnd;
  }

  const eased = clamp((progress - inputStart) / (inputEnd - inputStart), 0, 1);
  return outputStart + (outputEnd - outputStart) * easeOutCubic(eased);
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
