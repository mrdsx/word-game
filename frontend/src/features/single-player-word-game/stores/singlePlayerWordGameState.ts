import type { Word } from "$features/word-game/types";
import { atom } from "nanostores";
import type { SinglePlayerWordGame } from "../types";

type SinglePlayerWordGameState = {
  wordGame: SinglePlayerWordGame | undefined | null;
  submitError: string | null;
  words: Word[];
};

export const singlePlayerWordGameState = atom<SinglePlayerWordGameState>({
  wordGame: undefined,
  submitError: null,
  words: [],
});

export function setSinglePlayerWordGame(
  wordGame: SinglePlayerWordGameState["wordGame"],
): void {
  singlePlayerWordGameState.set({
    ...singlePlayerWordGameState.get(),
    wordGame,
  });
}

export function setSinglePlayerWords(
  words: SinglePlayerWordGameState["words"],
): void {
  singlePlayerWordGameState.set({
    ...singlePlayerWordGameState.get(),
    words,
  });
}

export function setSinglePlayerWordGameError(
  error: SinglePlayerWordGameState["submitError"],
): void {
  singlePlayerWordGameState.set({
    ...singlePlayerWordGameState.get(),
    submitError: error,
  });
}
