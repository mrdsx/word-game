import { MAX_WORD_LENGTH, MIN_WORD_LENGTH } from "$lib/constants";
import { isLowercaseOnly, validateWordResponse } from "$lib/utils";
import { persistentAtom } from "@nanostores/persistent";

export const words = persistentAtom<string[]>("words", [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export async function addWord(
  newWord: string,
  assertWordExists: (word: string) => unknown,
): Promise<void> {
  newWord = newWord.trim().toLowerCase();

  // assert easter eggs
  if (newWord === "mrdsx") {
    throw new Error("yo, wassup?");
  } else if (newWord === "69") {
    throw new Error("bro -_-");
  }

  // assert length
  if (newWord.length < MIN_WORD_LENGTH) {
    throw new Error("Too short");
  }
  if (newWord.length > MAX_WORD_LENGTH) {
    throw new Error("Too long");
  }

  // assert main rule of word game
  const lastWord = words.get()[0] ?? newWord[0];
  const lastWordLastChar = lastWord[lastWord.length - 1];
  const newWordFirstChar = newWord[0];

  if (lastWordLastChar !== newWordFirstChar) {
    throw new Error(`Word must start with "${lastWordLastChar}"`);
  }

  // assert chars and uniqueness
  // non-alphabet symbols won't pass
  if (!isLowercaseOnly(newWord)) {
    throw new Error("Only alphabet letters allowed");
  }
  if (words.get().includes(newWord)) {
    throw new Error("Word already exists");
  }

  const wordResponse = await assertWordExists(newWord);
  validateWordResponse(wordResponse);

  words.set([newWord, ...words.get()]);
}

export function resetWords(): void {
  words.set([]);
}
