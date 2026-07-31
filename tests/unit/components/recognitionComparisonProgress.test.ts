import { describe, expect, it } from "vitest";

import {
  getRecognitionComparisonState,
  getRecognitionItemOpacity,
} from "@/components/findings/recognitionComparisonProgress";

describe("recognition comparison progress", () => {
  it("lets visibility peak before recognition completes", () => {
    const earlyPeak = getRecognitionComparisonState(0.34);
    const lateBuild = getRecognitionComparisonState(0.8);

    expect(earlyPeak.visibilityEmphasis).toBeGreaterThan(0.9);
    expect(earlyPeak.recognitionEmphasis).toBeLessThan(0.4);
    expect(lateBuild.recognitionEmphasis).toBeGreaterThan(0.95);
    expect(lateBuild.visibilityEmphasis).toBeLessThan(earlyPeak.visibilityEmphasis);
  });

  it("keeps recognition visible in the final state", () => {
    const finalState = getRecognitionComparisonState(0.96);

    expect(finalState.showConclusion).toBe(true);
    expect(finalState.recognitionOpacity).toBe(1);
    expect(finalState.visibilityOpacity).toBeGreaterThan(0.3);
    expect(finalState.visibilityOpacity).toBeLessThan(finalState.recognitionOpacity);
  });

  it("uses one progress value for both item groups", () => {
    const progress = 0.62;
    const visibility = getRecognitionItemOpacity(progress, 2, 5, "visibility");
    const recognition = getRecognitionItemOpacity(progress, 2, 5, "recognition");
    const finalRecognition = getRecognitionItemOpacity(progress, 4, 5, "recognition");

    expect(visibility).toBeLessThan(1);
    expect(recognition).toBeGreaterThan(0);
    expect(recognition).toBeGreaterThan(visibility);
    expect(finalRecognition).toBe(0);
  });
});
