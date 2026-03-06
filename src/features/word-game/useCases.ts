import type { Word } from "$features/word-game/types";

type AddWordParams = {
  newWord: Word;
  words: Word[];
  normalizeWord: (word: Word) => Word;
  validateWord: (word: Word, words: Word[]) => void;
  fetchDictionaryWord: (word: Word) => Promise<unknown>;
  validateDictionaryWord: (data: unknown) => void;
  addWord: (newWord: Word, prevWords: Word[]) => void | Promise<void>;
};

export async function addWordUseCase({
  newWord,
  words,
  normalizeWord,
  validateWord,
  fetchDictionaryWord,
  validateDictionaryWord,
  addWord,
}: AddWordParams): Promise<void> {
  const word = normalizeWord(newWord);
  validateWord(word, words);

  const dictionaryWord = await fetchDictionaryWord(word);
  validateDictionaryWord(dictionaryWord);

  await addWord(word, words);
}
