import { fetchDictionaryWord } from "$features/dictionary/api";
import { validateDictionaryWord } from "$features/dictionary/utils";
import type { Word } from "$features/word-game/types";
import { addWordUseCase } from "$features/word-game/useCases";
import { normalizeWord, validateWord } from "$features/word-game/utils";
import { persistentAtom } from "@nanostores/persistent";

export const words = persistentAtom<Word[]>("words", [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export async function addWord(newWord: Word): Promise<void> {
  await addWordUseCase({
    newWord,
    words: words.get(),
    normalizeWord,
    validateWord,
    fetchDictionaryWord,
    validateDictionaryWord,
    addWord: (newWord, prevWords) => {
      words.set([...prevWords, newWord]);
    },
  });
}

export function resetWords(): void {
  words.set([]);
}
