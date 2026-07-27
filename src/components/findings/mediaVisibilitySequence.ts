import type { MediaVisibilityStateId } from "@/types/findings";

export type MediaVisibilityStateRange = {
  id: MediaVisibilityStateId;
  start: number;
  peakStart: number;
  peakEnd: number;
  end: number;
};

export const mediaVisibilityStateRanges = [
  {
    id: "discovery",
    start: 0.08,
    peakStart: 0.12,
    peakEnd: 0.27,
    end: 0.32,
  },
  {
    id: "inspiration",
    start: 0.27,
    peakStart: 0.33,
    peakEnd: 0.47,
    end: 0.53,
  },
  {
    id: "learning",
    start: 0.48,
    peakStart: 0.55,
    peakEnd: 0.7,
    end: 0.76,
  },
  {
    id: "reflection",
    start: 0.7,
    peakStart: 0.78,
    peakEnd: 0.91,
    end: 0.96,
  },
] as const satisfies MediaVisibilityStateRange[];

export function getActiveMediaVisibilityState(
  progress: number,
  ranges: readonly MediaVisibilityStateRange[] = mediaVisibilityStateRanges,
) {
  const clampedProgress = clamp(progress, 0, 1);
  const activeRange = ranges.find(
    (range) =>
      clampedProgress >= range.peakStart && clampedProgress <= range.peakEnd,
  );

  if (activeRange) {
    return activeRange.id;
  }

  return ranges.reduce((closest, range) => {
    const closestDistance = distanceToRange(clampedProgress, closest);
    const rangeDistance = distanceToRange(clampedProgress, range);

    return rangeDistance < closestDistance ? range : closest;
  }, ranges[0]).id;
}

export function getMediaVisibilityStateOpacity(
  progress: number,
  range: MediaVisibilityStateRange,
) {
  const fadeIn = interpolate(progress, range.start, range.peakStart, 0, 1);
  const fadeOut = interpolate(progress, range.peakEnd, range.end, 1, 0);

  return Math.min(fadeIn, fadeOut);
}

export function interpolate(
  progress: number,
  inputStart: number,
  inputEnd: number,
  outputStart: number,
  outputEnd: number,
) {
  if (inputStart === inputEnd) {
    return outputEnd;
  }

  const eased = clamp((progress - inputStart) / (inputEnd - inputStart), 0, 1);
  return outputStart + (outputEnd - outputStart) * easeOutCubic(eased);
}

function distanceToRange(progress: number, range: MediaVisibilityStateRange) {
  if (progress < range.peakStart) {
    return range.peakStart - progress;
  }

  if (progress > range.peakEnd) {
    return progress - range.peakEnd;
  }

  return 0;
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
