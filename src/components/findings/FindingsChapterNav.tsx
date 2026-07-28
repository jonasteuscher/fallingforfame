"use client";

import { useEffect, useState } from "react";

import type { FindingNavItem } from "@/types/findings";

type FindingsChapterNavProps = {
  items: FindingNavItem[];
  ariaLabel: string;
  hiddenUntilId?: string;
};

export function FindingsChapterNav({
  items,
  ariaLabel,
  hiddenUntilId,
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
        const distanceToBottom =
          document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);

        if (distanceToBottom <= 8) {
          setActiveId(items.at(-1)?.id ?? items[0]?.id ?? "");
          setIsPastIntro(true);
          return;
        }

        if (hiddenUntilId) {
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
  }, [hiddenUntilId, items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label={ariaLabel}
      className={[
        "fixed bottom-3 left-1/2 z-40 max-w-[calc(100vw-1rem)] -translate-x-1/2 border border-border bg-background/82 px-2 py-2 shadow-[0_18px_50px_color-mix(in_srgb,var(--background)_72%,black)] backdrop-blur transition duration-300 motion-reduce:transition-none md:bottom-auto md:left-auto md:right-4 md:top-1/2 md:-translate-y-1/2 md:translate-x-0",
        isPastIntro
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0",
      ].join(" ")}
    >
      <ol className="flex gap-1 md:flex-col">
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-label={item.label}
                aria-current={isActive ? "location" : undefined}
                className={[
                  "group flex min-h-11 min-w-11 items-center justify-center gap-2 px-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/62 transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none md:justify-start",
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
                <span className="hidden md:inline" aria-hidden="true">
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
