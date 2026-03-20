import { resetWords } from "$features/local-word-game/stores";
import { persistentAtom } from "@nanostores/persistent";
import {
  localWordGamePreferences,
  setCurrentMaxMistakes,
} from "./localWordGamePreferences";

type LocalWordGame = {
  isPlaying: boolean;
  mistakes: number;
  remainingTime: number;
  answeringTime: number;
  isTimerActive: boolean;
};

export const localWordGame = persistentAtom<LocalWordGame>(
  "gameState",
  {
    isPlaying: false,
    mistakes: 0,
    remainingTime: 0,
    answeringTime: 0,
    isTimerActive: false,
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);

export function startNewWordGame(): void {
  resetWords();
  const { answeringTime, maxMistakes } = localWordGamePreferences.get();
  localWordGame.set({
    isPlaying: true,
    mistakes: 0,
    remainingTime: answeringTime,
    answeringTime,
    isTimerActive: false,
  });
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
  localWordGame.set({
    ...localWordGame.get(),
    mistakes: 0,
    isTimerActive: false,
  });
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

export function setRemainingTime(
  remainingTime: LocalWordGame["remainingTime"],
): void {
  localWordGame.set({ ...localWordGame.get(), remainingTime });
}

export function setIsTimerActive(
  isTimerActive: LocalWordGame["isTimerActive"],
): void {
  localWordGame.set({ ...localWordGame.get(), isTimerActive });
}
