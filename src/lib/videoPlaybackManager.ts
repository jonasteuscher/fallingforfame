type PauseCallback = () => void;

const players = new Map<string, PauseCallback>();
let activePlayerId: string | null = null;
const videoPlaybackEvent = "fallingforfame:video-playback-requested";

export function registerVideoPlayer(id: string, pause: PauseCallback) {
  players.set(id, pause);

  return () => {
    players.delete(id);

    if (activePlayerId === id) {
      activePlayerId = null;
    }
  };
}

export function requestVideoPlayback(id: string) {
  for (const [playerId, pause] of players) {
    if (playerId !== id) {
      pause();
    }
  }

  activePlayerId = id;

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(videoPlaybackEvent, { detail: { id } }));
  }
}

export function clearActiveVideo(id: string) {
  if (activePlayerId === id) {
    activePlayerId = null;
  }
}

export function pauseActiveVideo() {
  if (!activePlayerId) {
    return;
  }

  players.get(activePlayerId)?.();
  activePlayerId = null;
}

export function subscribeToVideoPlayback(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(videoPlaybackEvent, callback);

  return () => window.removeEventListener(videoPlaybackEvent, callback);
}
