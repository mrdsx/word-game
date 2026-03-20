import type { Word } from "$features/word-game/types";
import { db } from "$lib/firebase";
import { doc } from "firebase/firestore";

export function singlePlayerWordGameDoc(userUID: string) {
  return doc(db, "singlePlayerWordGames", userUID);
}

export function singlePlayerWordDoc(userUID: string, word: Word) {
  return doc(db, "singlePlayerWordGames", userUID, "words", word);
}

export function singlePlayerWordGamePreferencesDoc(userUID: string) {
  return doc(db, "singlePlayerWordGamePreferences", userUID);
}
