"use client";

import { useState } from "react";

import type { TimelineItem } from "@/types/story";

type InteractiveTimelineProps = {
  items: TimelineItem[];
};

export function InteractiveTimeline({ items }: InteractiveTimelineProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex];

  return (
    <div className="grid min-w-0 gap-5 border border-border bg-surface p-3 sm:p-4 md:grid-cols-[14rem_1fr] md:gap-6">
      <div
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:flex md:flex-col"
        role="tablist"
      >
        {items.map((item, index) => (
          <button
            key={`${item.date}-${item.title}`}
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            onClick={() => setActiveIndex(index)}
            className="min-w-0 border border-border px-3 py-2 text-left text-sm transition aria-selected:border-primary aria-selected:bg-primary aria-selected:text-primary-foreground"
          >
            {item.date}
          </button>
        ))}
      </div>
      <article className="min-w-0" aria-live="polite">
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
          {activeItem.title}
        </h2>
        <p className="mt-3 leading-7 text-foreground/72">{activeItem.body}</p>
      </article>
    </div>
  );
}
