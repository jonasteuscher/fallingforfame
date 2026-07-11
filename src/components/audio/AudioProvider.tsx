"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type AudioContextValue = {
  activeId: string | null;
  play: (id: string, element: HTMLAudioElement) => Promise<void>;
  stop: () => void;
};

const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const activeElementRef = useRef<HTMLAudioElement | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const play = useCallback(async (id: string, element: HTMLAudioElement) => {
    if (activeElementRef.current && activeElementRef.current !== element) {
      activeElementRef.current.pause();
    }

    activeElementRef.current = element;
    setActiveId(id);
    await element.play();
  }, []);

  const stop = useCallback(() => {
    activeElementRef.current?.pause();
    activeElementRef.current = null;
    setActiveId(null);
  }, []);

  const value = useMemo(
    () => ({
      activeId,
      play,
      stop,
    }),
    [activeId, play, stop],
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudioController() {
  const context = useContext(AudioContext);

  if (!context) {
    throw new Error("useAudioController must be used within AudioProvider.");
  }

  return context;
}
