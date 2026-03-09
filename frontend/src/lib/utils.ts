import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function capitalizeWord(word: string): string {
  if (word.length === 0) {
    return word;
  }
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

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

export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
export type WithoutChildren<T> = T extends { children?: any }
  ? Omit<T, "children">
  : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
  ref?: U | null;
};
