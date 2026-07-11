import { describe, expect, it, vi } from "vitest";

import {
  pauseActiveVideo,
  registerVideoPlayer,
  requestVideoPlayback,
  subscribeToVideoPlayback,
} from "@/lib/videoPlaybackManager";

describe("videoPlaybackManager", () => {
  it("pauses other registered media and emits playback requests", () => {
    const pauseFirst = vi.fn();
    const pauseSecond = vi.fn();
    const onPlayback = vi.fn();
    const unregisterFirst = registerVideoPlayer("first", pauseFirst);
    const unregisterSecond = registerVideoPlayer("second", pauseSecond);
    const unsubscribe = subscribeToVideoPlayback(onPlayback);

    requestVideoPlayback("first");
    expect(pauseFirst).not.toHaveBeenCalled();
    expect(pauseSecond).toHaveBeenCalledTimes(1);
    expect(onPlayback).toHaveBeenCalledTimes(1);

    requestVideoPlayback("second");
    expect(pauseFirst).toHaveBeenCalledTimes(1);
    expect(pauseSecond).toHaveBeenCalledTimes(1);

    pauseActiveVideo();
    expect(pauseSecond).toHaveBeenCalledTimes(2);

    unsubscribe();
    unregisterFirst();
    unregisterSecond();
  });
});
