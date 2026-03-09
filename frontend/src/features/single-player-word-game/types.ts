import type { Word } from "$features/word-game/types";
import type { Timestamp } from "firebase/firestore";

export type SinglePlayerWord = {
  value: Word;
  createdAt: Timestamp;
};

export type SinglePlayerWordGame = {
  mistakes: number;
  maxMistakes: number;
};

export type SinglePlayerWordGamePreferences = {
  maxMistakes: number;
};
