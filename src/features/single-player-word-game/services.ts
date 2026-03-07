import { db } from "$lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function resetSinglePlayerMistakes(
  userUID: string | undefined,
): Promise<void> {
  if (userUID === undefined) return;

  await setDoc(
    doc(db, "singlePlayerWordGames", userUID),
    { mistakes: 0 },
    { merge: true },
  );
}

export async function resetSinglePlayerWords(
  userUID: string | undefined,
): Promise<void> {
  if (userUID === undefined) return;

  await setDoc(
    doc(db, "singlePlayerWordGames", userUID),
    { mistakes: 0, words: [] },
    { merge: true },
  );
}
