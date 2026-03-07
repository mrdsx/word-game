import { isLowercaseOnly } from "$lib/utils";
import { MAX_WORD_LENGTH, MIN_WORD_LENGTH } from "./constants";
import { WordGameError } from "./exceptions";
import type { Word } from "./types";

export function normalizeWord(word: Word): Word {
  return word.toLowerCase().trim();
}

export function reverseWords(words: readonly Word[]): Word[] {
  return [...words].reverse();
}

export function validateWord(word: Word, words: Word[]): void {
  // assert easter eggs
  if (word === "mrdsx") {
    throw new Error("yo, wassup?");
  } else if (word === "69") {
    throw new Error("bro -_-");
  }

  if (word.length < MIN_WORD_LENGTH) {
    throw new Error("Too short.");
  } else if (word.length > MAX_WORD_LENGTH) {
    throw new Error("Too long.");
  }

  // assert main rule of word game
  // (new word must start with last letter of last word)
  const lastWord = words[words.length - 1] ?? word[0];
  const lastWordLastChar = lastWord[lastWord.length - 1];
  const newWordFirstChar = word[0];

  if (lastWordLastChar !== newWordFirstChar) {
    throw new WordGameError(`Word must start with "${lastWordLastChar}".`);
  }
  if (words.includes(word)) {
    throw new WordGameError("Word already exists.");
  }

  // non-alphabet symbols won't pass
  if (!isLowercaseOnly(word)) {
    throw new Error("Only alphabet letters allowed.");
  }
}
