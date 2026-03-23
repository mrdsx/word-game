import { fetchDictionaryWord } from "$features/dictionary/api";
import { validateDictionaryWord } from "$features/dictionary/utils";
import type { Word } from "$features/word-game/types";
import { addWordUseCase } from "$features/word-game/useCases";
import { normalizeWord, validateWord } from "$features/word-game/utils";
import { persistentAtom } from "@nanostores/persistent";
import { setIsTimerActive } from "./localWordGame";

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
    addWord: (newWord) => {
      const prevWords = words.get();
      words.set([...prevWords, newWord]);
    },
    setIsTimerActive,
  });
}

export function resetWords(): void {
  words.set([]);
}
