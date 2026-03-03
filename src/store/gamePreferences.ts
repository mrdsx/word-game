import { persistentAtom } from "@nanostores/persistent";

type GamePreferences = {
  currentMaxWrongAttempts: number;
  maxWrongAttempts: number;
};

const MAX_ATTEMPTS = 5;

export const gamePreferences = persistentAtom<GamePreferences>(
  "gamePreferences",
  {
    currentMaxWrongAttempts: MAX_ATTEMPTS,
    maxWrongAttempts: MAX_ATTEMPTS,
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);

export function setCurrentMaxWrongAttempts(
  attempts: GamePreferences["currentMaxWrongAttempts"],
): void {
  gamePreferences.set({
    ...gamePreferences.get(),
    currentMaxWrongAttempts: attempts,
  });
}
