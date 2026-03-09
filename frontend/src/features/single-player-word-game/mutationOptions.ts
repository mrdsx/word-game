import { fetchDictionaryWord } from "$features/dictionary/api";
import { validateDictionaryWord } from "$features/dictionary/utils";
import type { Word } from "$features/word-game/types";
import { addWordUseCase } from "$features/word-game/useCases";
import { normalizeWord, validateWord } from "$features/word-game/utils";
import { db } from "$lib/firebase";
import type { MutationOptions } from "@tanstack/svelte-query";
import { doc, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";
import { singlePlayerWordGameQueryKeys } from "./queryKeys";
import { resetSinglePlayerWords } from "./services";
import type { SinglePlayerWord, SinglePlayerWordGame } from "./types";

type AddWordMutationOptions = MutationOptions<
  void,
  Error,
  { newWord: Word; userUID: string; words: Word[] },
  unknown
>;

type IncrementMistakesMutationOptions = MutationOptions<
  void,
  Error,
  { userUID: string; wordGame: SinglePlayerWordGame },
  unknown
>;

type ResetSinglePlayerWordsMutationOptions = MutationOptions<
  void,
  Error,
  string,
  unknown
>;

type StartNewGameMutationOptions = MutationOptions<
  void,
  Error,
  { maxMistakes: number; userUID: string },
  unknown
>;

export const addWordMutationOptions = {
  mutationKey: singlePlayerWordGameQueryKeys.updateWordGame,
  mutationFn: async ({
    newWord,
    userUID,
    words,
  }: {
    newWord: Word;
    userUID: string;
    words: Word[];
  }) => {
    await addWordUseCase({
      newWord,
      words,
      normalizeWord,
      validateWord,
      fetchDictionaryWord,
      validateDictionaryWord,
      addWord: async (newWord) => {
        const newWordGame: Partial<SinglePlayerWordGame> = {
          mistakes: 0,
        };
        await setDoc(doc(db, "singlePlayerWordGames", userUID), newWordGame, {
          merge: true,
        });

        const newWordDocument: Partial<SinglePlayerWord> = {
          value: newWord,
          createdAt: serverTimestamp() as Timestamp,
        };
        await setDoc(
          doc(db, "singlePlayerWordGames", userUID, "words", newWord),
          newWordDocument,
          { merge: true },
        );
      },
    });
  },
} satisfies AddWordMutationOptions;

export const incrementMistakesMutationOptions = {
  mutationKey: singlePlayerWordGameQueryKeys.wordGameMistakes,
  mutationFn: async ({
    userUID,
    wordGame,
  }: {
    userUID: string;
    wordGame: SinglePlayerWordGame;
  }) => {
    await setDoc(
      doc(db, "singlePlayerWordGames", userUID),
      { mistakes: wordGame.mistakes + 1 },
      { merge: true },
    );
  },
} satisfies IncrementMistakesMutationOptions;

export const resetSinglePlayerWordsMutationOptions = {
  mutationKey: singlePlayerWordGameQueryKeys.resetWords,
  mutationFn: async (userUID: string) => {
    await resetSinglePlayerWords(userUID);
  },
} satisfies ResetSinglePlayerWordsMutationOptions;

export const startNewGameMutationOptions = {
  mutationKey: singlePlayerWordGameQueryKeys.startWordGame,
  mutationFn: async ({
    maxMistakes,
    userUID,
  }: {
    maxMistakes: number;
    userUID: string;
  }) => {
    const newWordGame: SinglePlayerWordGame = {
      maxMistakes,
      mistakes: 0,
    };

    await setDoc(doc(db, "singlePlayerWordGames", userUID), newWordGame, {
      merge: true,
    });
    resetSinglePlayerWords(userUID);
  },
} satisfies StartNewGameMutationOptions;
