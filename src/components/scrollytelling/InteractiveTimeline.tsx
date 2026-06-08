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
    <div className="grid gap-6 border border-border bg-surface p-4 md:grid-cols-[14rem_1fr]">
      <div className="flex gap-2 overflow-x-auto md:flex-col" role="tablist">
        {items.map((item, index) => (
          <button
            key={`${item.date}-${item.title}`}
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            onClick={() => setActiveIndex(index)}
            className="min-w-32 border border-border px-3 py-2 text-left text-sm aria-selected:border-primary aria-selected:bg-primary aria-selected:text-primary-foreground"
          >
            {item.date}
          </button>
        ))}
      </div>
      <article aria-live="polite">
        <h2 className="text-2xl font-semibold text-foreground">{activeItem.title}</h2>
        <p className="mt-3 leading-7 text-foreground/72">{activeItem.body}</p>
      </article>
    </div>
  );
}
