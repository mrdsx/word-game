import { authState } from "$features/auth/stores";
import { queryOptions, type CreateQueryOptions } from "@tanstack/svelte-query";
import { DocumentSnapshot, getDoc } from "firebase/firestore";
import {
  singlePlayerWordGameDoc,
  singlePlayerWordGamePreferencesDoc,
} from "./database/documents";
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

      const docSnapshot = (await getDoc(
        singlePlayerWordGameDoc(userUID),
      )) as DocumentSnapshot<SinglePlayerWordGame>;

      return docSnapshot.data() ?? null;
    },
  });

export const singlePlayerWordGamePreferencesQueryOptions: SinglePlayerWordGamePreferencesQueryOptions =
  queryOptions({
    queryKey: singlePlayerWordGameQueryKeys.preferences,
    queryFn: async () => {
      const userUID = authState.get().currentUser?.uid ?? "";

      const docSnapshot = (await getDoc(
        singlePlayerWordGamePreferencesDoc(userUID),
      )) as DocumentSnapshot<SinglePlayerWordGamePreferences>;

      return docSnapshot.data() ?? null;
    },
  });
