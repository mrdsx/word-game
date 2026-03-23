import { authState } from "$features/auth/stores";
import { apiFetch } from "$lib/api";
import { handleHttpStatusCode } from "$lib/firebase/utils";
import { FirebaseError } from "firebase/app";
import { setDoc } from "firebase/firestore";
import { singlePlayerWordGamePreferencesDoc } from "./database/documents";

export async function resetSinglePlayerWords({
  userUID,
}: {
  userUID: string;
}): Promise<void> {
  const token = await authState.get().currentUser?.getIdToken();
  if (token === undefined) {
    throw new FirebaseError(
      "auth/unauthenticated",
      "User must have auth token",
    );
  }

  const response = await apiFetch("/single-player", {
    method: "DELETE",
    body: JSON.stringify({ userUID }),
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  handleHttpStatusCode(response.status);
}

export async function updateMaxMistakes({
  maxMistakes,
  userUID,
}: {
  maxMistakes: number;
  userUID: string;
}): Promise<void> {
  await setDoc(
    singlePlayerWordGamePreferencesDoc(userUID),
    { maxMistakes },
    { merge: true },
  );
}
