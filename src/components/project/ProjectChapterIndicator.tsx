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
  const scrollToChapter = (chapterId: string) => {
    const element = document.getElementById(chapterId);

    if (!element) {
      return;
    }

    setActiveId(chapterId);
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    let frame = 0;

    function updateActiveChapter() {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      frame = window.requestAnimationFrame(() => {
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
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 rounded-sm border border-border bg-background/72 px-3 py-4 shadow-2xl backdrop-blur lg:block"
    >
      <ol className="grid gap-4">
        {chapters.map((chapter, index) => (
          <li key={chapter.id}>
            <button
              type="button"
              onClick={() => scrollToChapter(chapter.id)}
              className={
                activeId === chapter.id
                  ? "flex cursor-pointer items-center justify-end gap-3 text-primary"
                  : "flex cursor-pointer items-center justify-end gap-3 text-foreground/56 transition-colors hover:text-primary"
              }
              aria-current={activeId === chapter.id ? "location" : undefined}
            >
              <span
                className={
                  activeId === chapter.id
                    ? "whitespace-nowrap text-xs font-semibold uppercase tracking-wide opacity-100"
                    : "whitespace-nowrap text-xs font-semibold uppercase tracking-wide opacity-70"
                }
              >
                {chapter.label}
              </span>
              <span
                aria-hidden="true"
                className={
                  activeId === chapter.id
                    ? "h-10 w-1 bg-primary"
                    : "h-8 w-px bg-foreground/46"
                }
              />
              <span className="sr-only">
                {String(index + 1).padStart(2, "0")} {chapter.label}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
