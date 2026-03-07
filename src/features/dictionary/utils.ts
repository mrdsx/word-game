import { WordGameError } from "$features/word-game/exceptions";
import { dictionaryWordSchema } from "./schemas";
import type { DictionaryWord } from "./types";

export function flatDictionaryWordDefinitions(
  dictionaryWord: DictionaryWord,
): string[] {
  const result = [];

  for (const word of dictionaryWord) {
    for (const meaning of word.meanings) {
      for (const definitionObj of meaning.definitions) {
        if (meaning.partOfSpeech !== "noun") {
          continue;
        }
        result.push(definitionObj.definition);
      }
    }
  }

  return result;
}

export function validateDictionaryWord(data: unknown): void {
  const { data: words, success } = dictionaryWordSchema.safeParse(data);
  if (!success) {
    throw new Error("Invalid response shape.");
  }

  let isNoun = false;
  for (const word of words) {
    for (const meaning of word.meanings) {
      if (meaning.partOfSpeech === "noun") {
        isNoun = true;
      }
    }
  }

  if (!isNoun) {
    throw new WordGameError("Word is not noun.");
  }
}
