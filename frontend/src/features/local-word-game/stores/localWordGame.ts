import { resetWords } from "$features/local-word-game/stores";
import { persistentAtom } from "@nanostores/persistent";
import {
  localWordGamePreferences,
  setCurrentMaxMistakes,
} from "./localWordGamePreferences";

type LocalWordGame = {
  isPlaying: boolean;
  mistakes: number;
};

export const localWordGame = persistentAtom<LocalWordGame>(
  "gameState",
  {
    isPlaying: false,
    mistakes: 0,
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);

export function startNewWordGame(): void {
  resetWords();
  localWordGame.set({ isPlaying: true, mistakes: 0 });
  const maxMistakes = localWordGamePreferences.get().maxMistakes;
  setCurrentMaxMistakes(maxMistakes);
}

export function startWordGame(): void {
  localWordGame.set({ ...localWordGame.get(), isPlaying: true });
}

export function stopWordGame(): void {
  localWordGame.set({ ...localWordGame.get(), isPlaying: false });
}

export function resetWordGame(): void {
  resetWords();
  localWordGame.set({ ...localWordGame.get(), mistakes: 0 });
}

export function incrementMistakes(onGameOver?: () => void): void {
  const mistakes = localWordGame.get().mistakes + 1;
  const currentMaxMistakes = localWordGamePreferences.get().currentMaxMistakes;

  if (mistakes >= currentMaxMistakes) {
    onGameOver?.();
    localWordGame.set({ ...localWordGame.get(), mistakes: 0 });
    return;
  }

  localWordGame.set({
    ...localWordGame.get(),
    mistakes,
  });
}

export function resetMistakes(): void {
  localWordGame.set({ ...localWordGame.get(), mistakes: 0 });
}
