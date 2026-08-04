"use client";

import { useEffect, useState } from "react";

type NarrativeNavItem = {
  id: string;
  label: string;
};

type AthleteNarrativeNavProps = {
  items: NarrativeNavItem[];
  ariaLabel: string;
};

export function AthleteNarrativeNav({ items, ariaLabel }: AthleteNarrativeNavProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let frame = 0;

    function updateActiveItem() {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      frame = window.requestAnimationFrame(() => {
        setIsVisible(window.scrollY > 12);

        const lastItem = items.at(-1);
        const distanceToBottom =
          document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);

        if (lastItem && distanceToBottom <= 8) {
          setActiveId(lastItem.id);
          return;
        }

        const scrollAnchor = window.scrollY + window.innerHeight * 0.38;
        const activeItem = items.reduce<NarrativeNavItem | undefined>(
          (current, item) => {
            const element = document.getElementById(item.id);

            if (!element) {
              return current;
            }

            const itemTop = element.getBoundingClientRect().top + window.scrollY;

            return itemTop <= scrollAnchor ? item : current;
          },
          items[0],
        );

        if (activeItem) {
          setActiveId(activeItem.id);
        }
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
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label={ariaLabel}
      className={[
        "site-section-nav fixed inset-x-0 bottom-3 z-30 flex justify-center px-2 transition duration-300 motion-reduce:transition-none xl:inset-x-auto xl:bottom-auto xl:right-3 xl:top-1/2 xl:-translate-y-1/2 xl:px-0 min-[1600px]:right-4",
        isVisible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      ].join(" ")}
    >
      <ol className="flex gap-1 border border-border bg-background/82 px-2 py-2 shadow-[0_18px_50px_color-mix(in_srgb,var(--background)_72%,black)] backdrop-blur xl:flex-col xl:gap-0.5 xl:px-1.5 xl:shadow-[0_12px_34px_color-mix(in_srgb,var(--background)_70%,black)] min-[1600px]:gap-1 min-[1600px]:px-2 min-[1600px]:shadow-[0_18px_50px_color-mix(in_srgb,var(--background)_72%,black)]">
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
                  "xl:min-h-8 xl:min-w-8 xl:gap-1.5 xl:px-1 xl:text-[0.62rem] xl:tracking-[0.14em] min-[1600px]:min-h-11 min-[1600px]:min-w-11 min-[1600px]:gap-2 min-[1600px]:px-2 min-[1600px]:text-xs min-[1600px]:tracking-[0.16em]",
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
                  className="hidden max-w-40 truncate xl:inline min-[1600px]:max-w-none"
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
