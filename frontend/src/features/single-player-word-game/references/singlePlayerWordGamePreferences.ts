import { db } from "$lib/firebase";
import { doc } from "firebase/firestore";

export function userWordGamePreferencesDoc(userUID: string) {
  return doc(db, "singlePlayerWordGamePreferences", userUID);
}
