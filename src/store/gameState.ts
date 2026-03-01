import { persistentAtom } from "@nanostores/persistent";
import { gamePreferences } from "./gamePreferences";
import { resetWords } from "./words";

type GameState = {
  isPlaying: boolean;
  wrongAttempts: number;
};

export const gameState = persistentAtom<GameState>(
  "gameState",
  {
    isPlaying: false,
    wrongAttempts: 0,
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);

export function startNewWordGame(): void {
  resetWords();
  gameState.set({ isPlaying: true, wrongAttempts: 0 });
}

export function startWordGame(): void {
  gameState.set({ ...gameState.get(), isPlaying: true });
}

export function finishWordGame(): void {
  gameState.set({ ...gameState.get(), isPlaying: false });
}

export function incrementWrongAttempts(onFinish?: () => void): void {
  const wrongAttempts = gameState.get().wrongAttempts + 1;
  const maxWrongAttempts = gamePreferences.get().maxWrongAttempts;

  if (wrongAttempts >= maxWrongAttempts) {
    onFinish?.();
    gameState.set({ ...gameState.get(), wrongAttempts: 0 });
    return;
  }

  gameState.set({
    ...gameState.get(),
    wrongAttempts,
  });
}

export function resetWrongAttempts(): void {
  gameState.set({ ...gameState.get(), wrongAttempts: 0 });
}
