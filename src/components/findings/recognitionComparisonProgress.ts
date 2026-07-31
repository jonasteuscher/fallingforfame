export const recognitionPhases = {
  intro: [0, 0.12],
  visibilityBuild: [0.12, 0.34],
  visibilityPeak: [0.34, 0.52],
  recognitionBuild: [0.36, 0.8],
  visibilityRecede: [0.52, 0.84],
  finalStatement: [0.82, 0.98],
} as const;

export type RecognitionComparisonState = {
  visibilityEmphasis: number;
  visibilityOpacity: number;
  recognitionEmphasis: number;
  recognitionOpacity: number;
  dividerBias: number;
  showConclusion: boolean;
};

export function getRecognitionComparisonState(
  progress: number,
): RecognitionComparisonState {
  const clampedProgress = clamp(progress, 0, 1);
  const visibilityBuild = interpolate(
    clampedProgress,
    recognitionPhases.visibilityBuild[0],
    recognitionPhases.visibilityBuild[1],
    0,
    1,
  );
  const visibilityRecede = interpolate(
    clampedProgress,
    recognitionPhases.visibilityRecede[0],
    recognitionPhases.visibilityRecede[1],
    0,
    1,
  );
  const recognitionBuild = interpolate(
    clampedProgress,
    recognitionPhases.recognitionBuild[0],
    recognitionPhases.recognitionBuild[1],
    0,
    1,
  );

  return {
    visibilityEmphasis: clamp(0.42 + visibilityBuild * 0.58 - visibilityRecede * 0.5, 0.3, 1),
    visibilityOpacity: clamp(0.58 + visibilityBuild * 0.42 - visibilityRecede * 0.42, 0.34, 1),
    recognitionEmphasis: clamp(0.28 + recognitionBuild * 0.72, 0.28, 1),
    recognitionOpacity: clamp(0.5 + recognitionBuild * 0.5, 0.5, 1),
    dividerBias: interpolate(clampedProgress, 0.18, 0.76, -1, 1),
    showConclusion: clampedProgress >= recognitionPhases.finalStatement[0],
  };
}

export function getRecognitionItemOpacity(
  progress: number,
  index: number,
  total: number,
  side: "visibility" | "recognition",
) {
  const spread = side === "visibility" ? 0.17 : 0.36;
  const start =
    side === "visibility"
      ? recognitionPhases.visibilityBuild[0]
      : recognitionPhases.recognitionBuild[0];
  const end = start + spread;
  const step = total <= 1 ? 0 : (index / (total - 1)) * (spread * 0.74);
  const baseOpacity = interpolate(progress, start + step, end + step, 0, 1);

  if (side === "recognition") {
    return baseOpacity;
  }

  const recede = interpolate(
    progress,
    recognitionPhases.visibilityRecede[0],
    recognitionPhases.visibilityRecede[1],
    0,
    0.58,
  );

  return clamp(baseOpacity - recede, 0.18, 1);
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

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
