"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";

export function ScrollProgressIndicator() {
  const progress = useScrollProgress();

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-50 h-1 w-full origin-left bg-primary"
      style={{ transform: `scaleX(${progress})` }}
      aria-hidden="true"
    />
  );
}
