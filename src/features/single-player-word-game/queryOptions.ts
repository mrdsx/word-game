import { authState } from "$features/auth/stores";
import { db } from "$lib/firebase";
import { queryOptions, type CreateQueryOptions } from "@tanstack/svelte-query";
import { doc, DocumentSnapshot, getDoc } from "firebase/firestore";
import { singlePlayerWordGameQueryKeys } from "./queryKeys";
import type {
  SinglePlayerWordGame,
  SinglePlayerWordGamePreferences,
} from "./types";

type SinglePlayerWordGameQueryOptions = CreateQueryOptions<
  SinglePlayerWordGame | null,
  Error,
  SinglePlayerWordGame | null,
  typeof singlePlayerWordGameQueryKeys.singlePlayer
>;

type SinglePlayerWordGamePreferencesQueryOptions = CreateQueryOptions<
  SinglePlayerWordGamePreferences | null,
  Error,
  SinglePlayerWordGamePreferences | null,
  typeof singlePlayerWordGameQueryKeys.preferences
>;

export const singlePlayerWordGameQueryOptions: SinglePlayerWordGameQueryOptions =
  queryOptions({
    queryKey: singlePlayerWordGameQueryKeys.singlePlayer,
    queryFn: async () => {
      const userUID = authState.get().currentUser?.uid ?? "";
      const singlePlayerWordGameDoc = doc(db, "singlePlayerWordGames", userUID);

      const docSnapshot = (await getDoc(
        singlePlayerWordGameDoc,
      )) as DocumentSnapshot<SinglePlayerWordGame>;
      return docSnapshot.data() ?? null;
    },
  });

export const singlePlayerWordGamePreferencesQueryOptions: SinglePlayerWordGamePreferencesQueryOptions =
  queryOptions({
    queryKey: singlePlayerWordGameQueryKeys.preferences,
    queryFn: async () => {
      const userUID = authState.get().currentUser?.uid ?? "";
      const singlePlayerWordGamePreferencesDoc = doc(
        db,
        "singlePlayerWordGamePreferences",
        userUID,
      );

      const docSnapshot = (await getDoc(
        singlePlayerWordGamePreferencesDoc,
      )) as DocumentSnapshot<SinglePlayerWordGamePreferences>;
      return docSnapshot.exists()
        ? (docSnapshot.data() as SinglePlayerWordGamePreferences)
        : null;
    },
  });
