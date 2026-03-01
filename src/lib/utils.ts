import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import z from "zod";

const wordResponseSchema = z.array(
  z.object({
    word: z.string().min(1),
    meanings: z.array(
      z.object({
        partOfSpeech: z.string(),
      }),
    ),
  }),
);

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function isLowercaseOnly(str: string): boolean {
  return /^[a-z]+$/.test(str);
}

export function validateWordResponse(data: unknown): void {
  const { data: words, success } = wordResponseSchema.safeParse(data);
  if (!success) {
    throw new Error("Invalid response shape");
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
    throw new Error("Word is not noun");
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
