import { persistentAtom } from "@nanostores/persistent";

type LocalWordGamePreferences = {
  currentMaxMistakes: number;
  maxMistakes: number;
};

const MAX_MISTAKES = 5;

export const localWordGamePreferences =
  persistentAtom<LocalWordGamePreferences>(
    "gamePreferences",
    {
      currentMaxMistakes: MAX_MISTAKES,
      maxMistakes: MAX_MISTAKES,
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
