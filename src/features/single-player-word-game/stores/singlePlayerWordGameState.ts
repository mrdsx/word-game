import { atom } from "nanostores";
import type { SinglePlayerWordGame } from "../types";

type SinglePlayerWordGameState = {
  wordGame: SinglePlayerWordGame | undefined | null;
  submitError: string | null;
};

export const singlePlayerWordGameState = atom<SinglePlayerWordGameState>({
  wordGame: undefined,
  submitError: null,
});

export function setSinglePlayerWordGame(
  wordGame: SinglePlayerWordGameState["wordGame"],
): void {
  singlePlayerWordGameState.set({
    ...singlePlayerWordGameState.get(),
    wordGame,
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
