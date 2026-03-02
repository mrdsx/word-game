import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
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

export function isLowercaseOnly(str: string): boolean {
  return /^[a-z]+$/.test(str);
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
