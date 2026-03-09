import { authState } from "$features/auth/stores";
import { apiFetch } from "$lib/api";
import { FirebaseError } from "firebase/app";

export async function resetSinglePlayerWords(userUID: string): Promise<void> {
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
    headers: {
      Authorization: `Bearer ${token}`,
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
