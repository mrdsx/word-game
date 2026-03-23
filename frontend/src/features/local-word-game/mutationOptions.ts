import type { Word } from "$features/word-game/types";
import type { MutationOptions } from "@tanstack/svelte-query";
import { localWordGameQueryKeys } from "./queryKeys";
import { addWord } from "./stores";

type AddWordMutationOptions = MutationOptions<void, Error, Word, unknown>;

export const addWordMutationOptions = {
  mutationKey: localWordGameQueryKeys.addWord,
  mutationFn: async (word: Word) => {
    return await addWord(word);
  },
} satisfies AddWordMutationOptions;
