import { persistentAtom } from "@nanostores/persistent";

type GamePreferences = {
  maxWrongAttempts: number;
};

export const gamePreferences = persistentAtom<GamePreferences>(
  "gamePreferences",
  {
    maxWrongAttempts: 5,
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);
