import { describe, expect, it } from "vitest";

import {
  getPressureFactorPoint,
  getPressureModelState,
  pressureFactorPositions,
} from "@/components/findings/pressureModelProgress";

describe("pressure model progress", () => {
  it("maps scroll progress to narrative phases", () => {
    expect(getPressureModelState(0)).toBe("intro");
    expect(getPressureModelState(0.2)).toBe("first-influences");
    expect(getPressureModelState(0.5)).toBe("accumulation");
    expect(getPressureModelState(0.7)).toBe("maximum-pressure");
    expect(getPressureModelState(0.88)).toBe("maximum-pressure");
    expect(getPressureModelState(0.96)).toBe("safety-release");
    expect(getPressureModelState(1)).toBe("final");
  });

  it("defines unique deterministic positions for each pressure factor", () => {
    const ids = pressureFactorPositions.map((position) => position.id);
    const destinations = pressureFactorPositions.map((position) => `${position.x}:${position.y}`);

    expect(new Set(ids).size).toBe(pressureFactorPositions.length);
    expect(new Set(destinations).size).toBe(pressureFactorPositions.length);
  });

  it("uses the requested fixed clock layout around the athlete", () => {
    expect(pressureFactorPositions).toEqual([
      expect.objectContaining({
        id: "public-visibility",
        x: -250,
        y: -46,
        align: "right",
      }),
      expect.objectContaining({ id: "project-costs", x: 0, y: -152, align: "center" }),
      expect.objectContaining({ id: "deadlines", x: 250, y: -46, align: "left" }),
      expect.objectContaining({ id: "new-equipment", x: 250, y: 88, align: "left" }),
      expect.objectContaining({
        id: "financial-incentives",
        x: 214,
        y: 170,
        align: "left",
      }),
      expect.objectContaining({
        id: "audience-expectations",
        x: 0,
        y: 206,
        align: "center",
      }),
      expect.objectContaining({
        id: "sponsor-relationships",
        x: -214,
        y: 170,
        align: "right",
      }),
      expect.objectContaining({
        id: "personal-ambition",
        x: -250,
        y: 92,
        align: "right",
      }),
    ]);
  });

  it("moves each factor once into its fixed final position", () => {
    const position = pressureFactorPositions[0];
    const start = getPressureFactorPoint(position, 0);
    const final = getPressureFactorPoint(position, 1);

    expect(start).toEqual({ x: position.enterX, y: position.enterY });
    expect(final).toEqual({ x: position.x, y: position.y });
  });

  it("keeps entrance offsets restrained so factors do not drift after appearing", () => {
    for (const position of pressureFactorPositions) {
      expect(Math.abs(position.enterX - position.x)).toBeLessThanOrEqual(20);
      expect(Math.abs(position.enterY - position.y)).toBeLessThanOrEqual(22);
    }
  });
});
