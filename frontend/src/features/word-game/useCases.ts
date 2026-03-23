import type { Word } from "$features/word-game/types";

type AddWordParams = {
  newWord: Word;
  words: Word[];
  normalizeWord: (word: Word) => Word;
  validateWord: (word: Word, words: Word[]) => void;
  fetchDictionaryWord: (word: Word) => Promise<unknown>;
  validateDictionaryWord: (data: unknown) => void;
  addWord: (newWord: Word) => void | Promise<void>;
  setIsTimerActive?: (isTimerActive: boolean) => void;
};

export async function addWordUseCase({
  newWord,
  words,
  normalizeWord,
  validateWord,
  fetchDictionaryWord,
  validateDictionaryWord,
  addWord,
  setIsTimerActive,
}: AddWordParams): Promise<void> {
  const word = normalizeWord(newWord);
  validateWord(word, words);

  setIsTimerActive?.(false);
  const dictionaryWord = await fetchDictionaryWord(word);
  validateDictionaryWord(dictionaryWord);

  await addWord(word);
  setIsTimerActive?.(true);
}
