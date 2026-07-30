"use client";

import { useEffect, useState } from "react";

type ProjectChapterIndicatorProps = {
  chapters: Array<{
    id: string;
    label: string;
  }>;
};

export function ProjectChapterIndicator({ chapters }: ProjectChapterIndicatorProps) {
  const [activeId, setActiveId] = useState(chapters[0]?.id);

  useEffect(() => {
    let frame = 0;

    function updateActiveChapter() {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      frame = window.requestAnimationFrame(() => {
        const lastChapter = chapters.at(-1);
        const distanceToBottom =
          document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);

        if (lastChapter && distanceToBottom <= 8) {
          setActiveId(lastChapter.id);
          return;
        }

        const scrollAnchor = window.scrollY + window.innerHeight * 0.34;
        const activeChapter = chapters.reduce<(typeof chapters)[number] | undefined>(
          (current, chapter) => {
            const element = document.getElementById(chapter.id);

            if (!element) {
              return current;
            }

            const chapterTop = element.getBoundingClientRect().top + window.scrollY;

            return chapterTop <= scrollAnchor ? chapter : current;
          },
          chapters[0],
        );

        if (activeChapter) {
          setActiveId(activeChapter.id);
        }
      });
    }

    updateActiveChapter();
    window.addEventListener("scroll", updateActiveChapter, { passive: true });
    window.addEventListener("resize", updateActiveChapter);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", updateActiveChapter);
      window.removeEventListener("resize", updateActiveChapter);
    };
  }, [chapters]);

  return (
    <nav
      aria-label="Project chapters"
      className="site-section-nav fixed bottom-3 left-1/2 z-40 max-w-[calc(100vw-1rem)] -translate-x-1/2 border border-border bg-background/82 px-2 py-2 shadow-[0_18px_50px_color-mix(in_srgb,var(--background)_72%,black)] backdrop-blur md:bottom-auto md:left-auto md:right-3 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:px-1.5 md:shadow-[0_12px_34px_color-mix(in_srgb,var(--background)_70%,black)] min-[1600px]:right-4 min-[1600px]:px-2 min-[1600px]:shadow-[0_18px_50px_color-mix(in_srgb,var(--background)_72%,black)]"
    >
      <ol className="flex gap-1 md:flex-col md:gap-0.5 min-[1600px]:gap-1">
        {chapters.map((chapter) => {
          const isActive = activeId === chapter.id;

          return (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                aria-label={chapter.label}
                aria-current={isActive ? "location" : undefined}
                className={[
                  "group flex min-h-11 min-w-11 items-center justify-center gap-2 px-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/62 transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none md:justify-start",
                  "md:min-h-8 md:min-w-8 md:gap-1.5 md:px-1 md:text-[0.62rem] md:tracking-[0.14em] min-[1600px]:min-h-11 min-[1600px]:min-w-11 min-[1600px]:gap-2 min-[1600px]:px-2 min-[1600px]:text-xs min-[1600px]:tracking-[0.16em]",
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
                <span className="hidden max-w-40 truncate md:inline min-[1600px]:max-w-none" aria-hidden="true">
                  {chapter.label}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
