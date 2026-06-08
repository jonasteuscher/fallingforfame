"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";

export function ScrollProgressIndicator() {
  const progress = useScrollProgress();

  return (
    <div
      className="fixed left-0 top-0 z-50 h-1 bg-primary"
      style={{ width: `${progress * 100}%` }}
      aria-hidden="true"
    />
  );
}
