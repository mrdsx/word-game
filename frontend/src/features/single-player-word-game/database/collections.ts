import { db } from "$lib/firebase";
import { collection } from "firebase/firestore";

export function singlePlayerWordsCollection(userUID: string) {
  return collection(db, "singlePlayerWordGames", userUID, "words");
}
