"use client";

import { useEffect, useState } from "react";

import type { FindingNavItem } from "@/types/findings";

type FindingsChapterNavProps = {
  items: FindingNavItem[];
  ariaLabel: string;
  hiddenUntilId?: string;
  compact?: boolean;
  revealOnScroll?: boolean;
  revealAfterHiddenSection?: boolean;
};

export function FindingsChapterNav({
  items,
  ariaLabel,
  hiddenUntilId,
  compact = true,
  revealOnScroll = false,
  revealAfterHiddenSection = false,
}: FindingsChapterNavProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [isPastIntro, setIsPastIntro] = useState(!hiddenUntilId);

  useEffect(() => {
    if (typeof window === "undefined" || items.length === 0) {
      return;
    }

    let frame = 0;

    function updateActiveItem() {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      frame = window.requestAnimationFrame(() => {
        if (revealAfterHiddenSection && hiddenUntilId) {
          const hiddenSection = document.getElementById(hiddenUntilId);

          if (!hiddenSection) {
            setIsPastIntro(false);
            return;
          }

          const hiddenSectionBottom =
            hiddenSection.getBoundingClientRect().bottom + window.scrollY;

          setIsPastIntro(
            window.scrollY + window.innerHeight * 0.3 >= hiddenSectionBottom,
          );
        } else if (revealOnScroll) {
          setIsPastIntro(window.scrollY > 12);
        }

        const distanceToBottom =
          document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);

        if (!revealAfterHiddenSection && distanceToBottom <= 8) {
          setActiveId(items.at(-1)?.id ?? items[0]?.id ?? "");
          setIsPastIntro(true);
          return;
        }

        if (!revealAfterHiddenSection && !revealOnScroll && hiddenUntilId) {
          const intro = document.getElementById(hiddenUntilId);
          const introBottom = intro
            ? intro.getBoundingClientRect().bottom + window.scrollY
            : 0;

          setIsPastIntro(window.scrollY + window.innerHeight * 0.55 >= introBottom);
        }

        const anchor = window.scrollY + window.innerHeight * 0.42;
        const active = items.reduce<FindingNavItem | undefined>((current, item) => {
          const element = document.getElementById(item.id);

          if (!element) {
            return current;
          }

          const top = element.getBoundingClientRect().top + window.scrollY;
          return top <= anchor ? item : current;
        }, items[0]);

        setActiveId(active?.id ?? items[0]?.id ?? "");
      });
    }

    updateActiveItem();
    window.addEventListener("scroll", updateActiveItem, { passive: true });
    window.addEventListener("resize", updateActiveItem);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", updateActiveItem);
      window.removeEventListener("resize", updateActiveItem);
    };
  }, [hiddenUntilId, items, revealAfterHiddenSection, revealOnScroll]);

  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label={ariaLabel}
      className={[
        "site-section-nav fixed inset-x-0 bottom-3 z-40 flex justify-center px-2 transition duration-300 motion-reduce:transition-none xl:inset-x-auto xl:bottom-auto xl:right-4 xl:top-1/2 xl:-translate-y-1/2 xl:px-0",
        compact
          ? "xl:right-3 min-[1600px]:right-4"
          : "",
        isPastIntro
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0",
      ].join(" ")}
    >
      <ol
        className={[
          "flex gap-1 border border-border bg-background/82 px-2 py-2 shadow-[0_18px_50px_color-mix(in_srgb,var(--background)_72%,black)] backdrop-blur xl:flex-col",
          compact
            ? "xl:gap-0.5 xl:px-1.5 xl:py-2 xl:shadow-[0_12px_34px_color-mix(in_srgb,var(--background)_70%,black)] min-[1600px]:gap-1 min-[1600px]:px-2 min-[1600px]:shadow-[0_18px_50px_color-mix(in_srgb,var(--background)_72%,black)]"
            : "",
        ].join(" ")}
      >
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-label={item.label}
                aria-current={isActive ? "location" : undefined}
                className={[
                  "group flex min-h-11 min-w-11 items-center justify-center gap-2 px-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/62 transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none xl:justify-start",
                  compact
                    ? "xl:min-h-8 xl:min-w-8 xl:gap-1.5 xl:px-1 xl:text-[0.62rem] xl:tracking-[0.14em] min-[1600px]:min-h-11 min-[1600px]:min-w-11 min-[1600px]:gap-2 min-[1600px]:px-2 min-[1600px]:text-xs min-[1600px]:tracking-[0.16em]"
                    : "",
                  isActive ? "text-primary" : "",
                ].join(" ")}
              >
                <span
                  className={[
                    "block h-1.5 w-1.5 rounded-full border border-current transition motion-reduce:transition-none",
                    isActive ? "scale-125 bg-primary" : "bg-transparent",
                  ].join(" ")}
                  aria-hidden="true"
                />
                <span
                  className={
                    compact
                      ? "hidden max-w-40 truncate xl:inline min-[1600px]:max-w-none"
                      : "hidden xl:inline"
                  }
                  aria-hidden="true"
                >
                  {item.label}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
