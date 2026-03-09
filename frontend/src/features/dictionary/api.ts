import { WordGameError } from "$features/word-game/exceptions";
import type { Word } from "$features/word-game/types";
import { StatusCodes } from "http-status-codes";
import { DICTIONARY_API_URL } from "./constants";

export async function fetchDictionaryWord(word: Word): Promise<unknown> {
  const response = await fetch(`${DICTIONARY_API_URL}/${word}`);
  if (response.status === StatusCodes.NOT_FOUND) {
    throw new WordGameError("Word does not exist.");
  }
  if (response.status === StatusCodes.TOO_MANY_REQUESTS) {
    throw new Error("Too many requests.");
  }
  if (!response.ok) {
    throw new Error("Failed to fetch word.");
  }

  return await response.json();
}
