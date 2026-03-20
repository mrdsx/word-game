import { persistentAtom } from "@nanostores/persistent";

type LocalWordGamePreferences = {
  currentMaxMistakes: number;
  maxMistakes: number;
  answeringTime: number;
};

const MAX_MISTAKES = 5;

export const localWordGamePreferences =
  persistentAtom<LocalWordGamePreferences>(
    "gamePreferences",
    {
      currentMaxMistakes: MAX_MISTAKES,
      maxMistakes: MAX_MISTAKES,
      answeringTime: 0,
    },
    {
      encode: JSON.stringify,
      decode: JSON.parse,
    },
  );

export function setCurrentMaxMistakes(
  mistakes: LocalWordGamePreferences["currentMaxMistakes"],
): void {
  localWordGamePreferences.set({
    ...localWordGamePreferences.get(),
    currentMaxMistakes: mistakes,
  });
}

export function setAnsweringTime(
  answeringTime: LocalWordGamePreferences["answeringTime"],
): void {
  localWordGamePreferences.set({
    ...localWordGamePreferences.get(),
    answeringTime,
  });
}
