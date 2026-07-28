export type PressureModelState =
  | "intro"
  | "first-influences"
  | "accumulation"
  | "maximum-pressure"
  | "safety-release"
  | "final";

export type PressureFactorPosition = {
  id: string;
  x: number;
  y: number;
  enterX: number;
  enterY: number;
  align: "left" | "right" | "center";
};

export const pressureFactorPositions = [
  {
    id: "public-visibility",
    x: -250,
    y: -46,
    enterX: -270,
    enterY: -46,
    align: "right",
  },
  {
    id: "project-costs",
    x: 0,
    y: -152,
    enterX: 0,
    enterY: -172,
    align: "center",
  },
  {
    id: "deadlines",
    x: 250,
    y: -46,
    enterX: 270,
    enterY: -46,
    align: "left",
  },
  {
    id: "new-equipment",
    x: 250,
    y: 88,
    enterX: 270,
    enterY: 88,
    align: "left",
  },
  {
    id: "financial-incentives",
    x: 214,
    y: 170,
    enterX: 232,
    enterY: 184,
    align: "left",
  },
  {
    id: "audience-expectations",
    x: 0,
    y: 206,
    enterX: 0,
    enterY: 228,
    align: "center",
  },
  {
    id: "sponsor-relationships",
    x: -214,
    y: 170,
    enterX: -232,
    enterY: 184,
    align: "right",
  },
  {
    id: "personal-ambition",
    x: -250,
    y: 92,
    enterX: -270,
    enterY: 92,
    align: "right",
  },
] as const satisfies readonly PressureFactorPosition[];

export function getPressureModelState(progress: number): PressureModelState {
  const clamped = clamp(progress);

  if (clamped < 0.14) {
    return "intro";
  }

  if (clamped < 0.36) {
    return "first-influences";
  }

  if (clamped < 0.64) {
    return "accumulation";
  }

  if (clamped < 0.94) {
    return "maximum-pressure";
  }

  if (clamped < 0.98) {
    return "safety-release";
  }

  return "final";
}

export function getPressureFactorPoint(
  position: PressureFactorPosition,
  revealProgress: number,
) {
  return {
    x: mix(position.enterX, position.x, revealProgress),
    y: mix(position.enterY, position.y, revealProgress),
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

  const eased = clamp((progress - inputStart) / (inputEnd - inputStart));

  return outputStart + (outputEnd - outputStart) * easeOutCubic(eased);
}

function mix(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function clamp(value: number) {
  return Math.min(Math.max(value, 0), 1);
}
