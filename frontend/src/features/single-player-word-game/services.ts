import { authState } from "$features/auth/stores";
import { apiFetch } from "$lib/api";
import { FirebaseError } from "firebase/app";
import { setDoc } from "firebase/firestore";
import { userWordGamePreferencesDoc } from "./references/singlePlayerWordGamePreferences";

export async function resetSinglePlayerWords({
  userUID,
}: {
  userUID: string;
}): Promise<void> {
  const token = await authState.get().currentUser?.getIdToken();
  if (token === undefined) {
    throw new FirebaseError(
      "auth/unauthenticated",
      "User must have auth token.",
    );
  }

  const response = await apiFetch("/word-game/single-player", {
    method: "DELETE",
    body: JSON.stringify({ userUID }),
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    throw new FirebaseError(
      "auth/unauthenticated",
      "User must be authenticated.",
    );
  } else if (response.status === 403) {
    throw new FirebaseError(
      "auth/permission-denied",
      "User must have permission.",
    );
  } else if (response.status === 400) {
    throw new FirebaseError("auth/invalid-argument", "Invalid request.");
  }
}

export async function updateMaxMistakes({
  maxMistakes,
  userUID,
}: {
  maxMistakes: number;
  userUID: string;
}): Promise<void> {
  await setDoc(
    userWordGamePreferencesDoc(userUID),
    { maxMistakes },
    { merge: true },
  );
}
