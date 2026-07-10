type PauseCallback = () => void;

const players = new Map<string, PauseCallback>();
let activePlayerId: string | null = null;

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
}

export function clearActiveVideo(id: string) {
  if (activePlayerId === id) {
    activePlayerId = null;
  }
}
