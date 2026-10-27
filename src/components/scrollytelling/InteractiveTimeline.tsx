"use client";

import { useId, useRef, useState } from "react";

import type { TimelineItem } from "@/types/story";

type InteractiveTimelineProps = {
  items: TimelineItem[];
};

export function InteractiveTimeline({ items }: InteractiveTimelineProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex];
  const id = useId();
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  if (!activeItem) return null;

  return (
    <div className="grid min-w-0 gap-5 border border-border bg-surface p-3 sm:p-4 md:grid-cols-[14rem_1fr] md:gap-6">
      <div
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:flex md:flex-col"
        role="tablist"
        aria-label="Timeline"
      >
        {items.map((item, index) => (
          <button
            key={`${item.date}-${item.title}`}
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-controls={`${id}-panel`}
            aria-selected={activeIndex === index}
            tabIndex={activeIndex === index ? 0 : -1}
            ref={(element) => {
              tabs.current[index] = element;
            }}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(event) => {
              let nextIndex = index;
              if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                nextIndex = (index + 1) % items.length;
              } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                nextIndex = (index - 1 + items.length) % items.length;
              } else if (event.key === "Home") {
                nextIndex = 0;
              } else if (event.key === "End") {
                nextIndex = items.length - 1;
              } else return;
              event.preventDefault();
              setActiveIndex(nextIndex);
              tabs.current[nextIndex]?.focus();
            }}
            className="min-w-0 border border-border px-3 py-2 text-left text-sm transition aria-selected:border-primary aria-selected:bg-primary aria-selected:text-primary-foreground"
          >
            {item.date}
          </button>
        ))}
      </div>
      <article
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${activeIndex}`}
        tabIndex={0}
        className="min-w-0"
      >
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
          {activeItem.title}
        </h2>
        <p className="mt-3 leading-7 text-foreground/72">{activeItem.body}</p>
      </article>
    </div>
  );
}
