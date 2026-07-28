import { describe, expect, it } from "vitest";

import {
  cameraEquipmentStateRanges,
  getCameraEquipmentState,
  getCameraFocus,
} from "@/components/findings/cameraEquipmentProgress";

describe("camera equipment progress mapping", () => {
  it("moves from camera to helmet to equipment to preparation to decision", () => {
    expect(getCameraEquipmentState(0)).toBe("camera");
    expect(getCameraEquipmentState(0.18)).toBe("camera");
    expect(getCameraEquipmentState(0.34)).toBe("helmet");
    expect(getCameraEquipmentState(0.56)).toBe("equipment");
    expect(getCameraEquipmentState(0.74)).toBe("preparation");
    expect(getCameraEquipmentState(0.9)).toBe("decision");
    expect(getCameraEquipmentState(1)).toBe("decision");
  });

  it("keeps the camera state first and the decision state last", () => {
    expect(cameraEquipmentStateRanges[0]?.id).toBe("camera");
    expect(cameraEquipmentStateRanges.at(-1)?.id).toBe("decision");
  });

  it("expands visual focus instead of keeping a permanent camera spotlight", () => {
    const opening = getCameraFocus(0.16);
    const final = getCameraFocus(0.9);

    expect(opening.maskRadius).toBeLessThan(final.maskRadius);
    expect(opening.cameraAccentOpacity).toBeGreaterThan(final.cameraAccentOpacity);
    expect(final.conclusionOpacity).toBeGreaterThan(opening.conclusionOpacity);
  });
});
