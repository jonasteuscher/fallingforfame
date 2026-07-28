import type { CameraEquipmentStateId } from "@/types/findings";

export type CameraEquipmentStateRange = {
  id: CameraEquipmentStateId;
  start: number;
  peakStart: number;
  peakEnd: number;
  end: number;
};

export const cameraEquipmentStateRanges = [
  {
    id: "camera",
    start: 0.06,
    peakStart: 0.1,
    peakEnd: 0.22,
    end: 0.3,
  },
  {
    id: "helmet",
    start: 0.22,
    peakStart: 0.3,
    peakEnd: 0.42,
    end: 0.5,
  },
  {
    id: "equipment",
    start: 0.42,
    peakStart: 0.5,
    peakEnd: 0.62,
    end: 0.7,
  },
  {
    id: "preparation",
    start: 0.62,
    peakStart: 0.7,
    peakEnd: 0.8,
    end: 0.88,
  },
  {
    id: "decision",
    start: 0.82,
    peakStart: 0.88,
    peakEnd: 0.96,
    end: 1,
  },
] as const satisfies CameraEquipmentStateRange[];

export function getCameraEquipmentState(
  progress: number,
  ranges: readonly CameraEquipmentStateRange[] = cameraEquipmentStateRanges,
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

export function getCameraEquipmentStateOpacity(
  progress: number,
  range: CameraEquipmentStateRange,
) {
  const fadeIn = interpolate(progress, range.start, range.peakStart, 0, 1);
  const fadeOut = interpolate(progress, range.peakEnd, range.end, 1, 0);

  return Math.min(fadeIn, fadeOut);
}

export function getCameraFocus(progress: number) {
  const cameraEmphasis = interpolate(progress, 0.08, 0.2, 0, 1);
  const contextExpansion = interpolate(progress, 0.24, 0.82, 0, 1);
  const conclusion = interpolate(progress, 0.82, 0.96, 0, 1);

  return {
    maskRadius: interpolate(progress, 0.1, 0.84, 7, 118),
    subduedOpacity: interpolate(progress, 0.16, 0.9, 0.26, 0.02),
    clearOpacity: interpolate(progress, 0.08, 0.2, 0.76, 1),
    cameraAccentOpacity: clamp(cameraEmphasis - contextExpansion * 0.9, 0, 1),
    equipmentOpacity: clamp(
      interpolate(progress, 0.28, 0.56, 0, 1) -
        interpolate(progress, 0.72, 0.9, 0, 0.72),
      0,
      1,
    ),
    preparationOpacity: clamp(
      interpolate(progress, 0.58, 0.76, 0, 1) -
        interpolate(progress, 0.84, 0.96, 0, 0.56),
      0,
      1,
    ),
    conclusionOpacity: conclusion,
    imageScale: 1,
    imageX: 0,
    imageY: 0,
  };
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

function distanceToRange(progress: number, range: CameraEquipmentStateRange) {
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
