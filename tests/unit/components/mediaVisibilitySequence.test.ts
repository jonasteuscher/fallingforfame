import { describe, expect, it } from "vitest";

import {
  getActiveMediaVisibilityState,
  getMediaVisibilityStateOpacity,
  mediaVisibilityStateRanges,
} from "@/components/findings/mediaVisibilitySequence";

describe("media visibility sequence state ranges", () => {
  it("maps scroll progress to one active narrative state", () => {
    expect(getActiveMediaVisibilityState(0)).toBe("discovery");
    expect(getActiveMediaVisibilityState(0.16)).toBe("discovery");
    expect(getActiveMediaVisibilityState(0.38)).toBe("inspiration");
    expect(getActiveMediaVisibilityState(0.62)).toBe("learning");
    expect(getActiveMediaVisibilityState(0.84)).toBe("reflection");
    expect(getActiveMediaVisibilityState(1)).toBe("reflection");
  });

  it("crossfades a state through hidden, dominant and released phases", () => {
    const discovery = mediaVisibilityStateRanges[0];

    expect(getMediaVisibilityStateOpacity(0, discovery)).toBe(0);
    expect(getMediaVisibilityStateOpacity(discovery.peakStart, discovery)).toBe(1);
    expect(getMediaVisibilityStateOpacity(discovery.peakEnd, discovery)).toBe(1);
    expect(getMediaVisibilityStateOpacity(0.5, discovery)).toBe(0);
  });
});
