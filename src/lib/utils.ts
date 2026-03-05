import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MAX_WORD_LENGTH, MIN_WORD_LENGTH } from "./constants";
import { wordResponseSchema } from "./schemas";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * @param {number} number - Number used with word
 * @param {string[]} words - Array of words [singular, plural]
 * Declines word in singular or plural form.
 * ```
 * declineWord(1, ["word", "words"]) // returns "word"
 * declineWord(11, ["word", "words"]) // returns "words"
 * declineWord(-123, ["word", "words"]) // returns "words"
 * ```
 */
export function declineWord(number: number, words: string[]): string {
  if (Math.abs(number) === 1) {
    return words[0];
  }
  return words[1];
}

export function delayedReturn<T>(result: T, time?: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(result), time));
}

export function isLowercaseOnly(str: string): boolean {
  return /^[a-z]+$/.test(str);
}

export function mapFirebaseErrorCode(str: string): string | undefined {
  switch (str) {
    case "auth/email-already-in-use":
      return "Email is already used.";
    default:
      return undefined;
  }
}

export function normalizeWord(word: string): string {
  return word.toLowerCase().trim();
}

export function validateWord(word: string, words: string[]): void {
  // assert easter eggs
  if (word === "mrdsx") {
    throw new Error("yo, wassup?");
  } else if (word === "69") {
    throw new Error("bro -_-");
  }

  // assert length
  if (word.length < MIN_WORD_LENGTH) {
    throw new Error("Too short.");
  }
  if (word.length > MAX_WORD_LENGTH) {
    throw new Error("Too long.");
  }

  // assert main rule of word game
  // (new word must start with last letter of last word)
  const lastWord = words[words.length - 1] ?? word[0];
  const lastWordLastChar = lastWord[lastWord.length - 1];
  const newWordFirstChar = word[0];

  if (lastWordLastChar !== newWordFirstChar) {
    throw new Error(`Word must start with "${lastWordLastChar}".`);
  }
  if (words.includes(word)) {
    throw new Error("Word already exists.");
  }

  // assert chars and uniqueness
  // non-alphabet symbols won't pass
  if (!isLowercaseOnly(word)) {
    throw new Error("Only alphabet letters allowed.");
  }
}

export function validateWordResponse(data: unknown): void {
  const { data: words, success } = wordResponseSchema.safeParse(data);
  if (!success) {
    throw new Error("Invalid response shape.");
  }

  let isNoun = false;
  words.forEach((word) => {
    word.meanings.forEach((meaning) => {
      if (meaning.partOfSpeech === "noun") {
        isNoun = true;
      }
    });
  });

  if (!isNoun) {
    throw new Error("Word is not noun.");
  }
}

export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
export type WithoutChildren<T> = T extends { children?: any }
  ? Omit<T, "children">
  : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
  ref?: U | null;
};
