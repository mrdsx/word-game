<script lang="ts">
  import { db } from "$lib/firebase";
  import { navigate } from "$lib/router";
  import type {
    SinglePlayerWordGame,
    SinglePlayerWordGamePreferences,
  } from "$lib/types";
  import { createQuery } from "@tanstack/svelte-query";
  import { doc, DocumentSnapshot, getDoc, setDoc } from "firebase/firestore";
  import { userState } from "../../store/userState";
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "./ui/alert-dialog";
  import { Button, buttonVariants } from "./ui/button";
  import { Label } from "./ui/label";
  import { NativeSelect, NativeSelectOption } from "./ui/native-select";

  const NEW_GAME_BUTTON_TEXT = "New game";

  let maxMistakesSelectRef: HTMLSelectElement | null = $state(null);
  const userUID = $derived($userState.currentUser?.uid);

  const wordGameExists = createQuery(() => ({
    queryKey: ["singlePlayerWordGameExists"],
    queryFn: async () => {
      const userUID = userState.get().currentUser?.uid ?? "";
      const singlePlayerWordGameDoc = doc(db, "singlePlayerWordGames", userUID);

      const docSnapshot = (await getDoc(
        singlePlayerWordGameDoc,
      )) as DocumentSnapshot<SinglePlayerWordGame>;
      return docSnapshot.exists();
    },
    enabled: $userState.currentUser !== null,
  }));

  const wordGamePreferences = createQuery(() => ({
    queryKey: ["singlePlayerWordGamePreferences"],
    queryFn: async () => {
      const userUID = userState.get().currentUser?.uid ?? "";
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
    enabled: $userState.currentUser !== null,
  }));

  const maxMistakes = $derived(wordGamePreferences.data?.maxMistakes ?? 5);
  const canContinueGame = $derived(wordGameExists.data !== undefined);

  $effect(() => {
    if (maxMistakesSelectRef !== null) {
      maxMistakesSelectRef.value = String(maxMistakes);
    }
  });

  function handleSubmit(event: Event): void {
    event.preventDefault();
    console.log("hi");
  }

  async function handleUpdateMaxMistakes(
    event: Event & {
      currentTarget: EventTarget & HTMLSelectElement;
    },
  ): Promise<void> {
    if (userUID === undefined) return;

    const maxMistakes = Number(event.currentTarget.value);
    if (isNaN(maxMistakes)) return;

    await setDoc(
      doc(db, "singlePlayerWordGamePreferences", userUID),
      { maxMistakes },
      { merge: true },
    );
  }

  async function handleStartNewGame(): Promise<void> {
    if (userUID === undefined || maxMistakesSelectRef === null) return;

    const maxMistakes = Number(maxMistakesSelectRef.value);
    if (isNaN(maxMistakes)) return;

    const newWordGame: SinglePlayerWordGame = {
      maxMistakes,
      mistakes: 0,
      words: [],
    };
    await setDoc(doc(db, "singlePlayerWordGames", userUID), newWordGame, {
      merge: true,
    });
    await navigate("/user/game");
  }
</script>

<form
  class="card flex w-full flex-col items-center gap-4"
  onsubmit={handleSubmit}
>
  <div class="flex w-full justify-between space-y-2">
    <Label>Max consecutive mistakes</Label>
    <NativeSelect
      value={maxMistakes}
      disabled={wordGamePreferences.isPending}
      onchange={handleUpdateMaxMistakes}
      bind:ref={maxMistakesSelectRef}
    >
      <NativeSelectOption value="1">1</NativeSelectOption>
      <NativeSelectOption value="2">2</NativeSelectOption>
      <NativeSelectOption value="3">3</NativeSelectOption>
      <NativeSelectOption value="4">4</NativeSelectOption>
      <NativeSelectOption value="5">5</NativeSelectOption>
    </NativeSelect>
  </div>
  <div class="flex gap-2 *:w-25">
    <Button
      variant="outline"
      disabled={!canContinueGame || wordGameExists.isPending}
      onclick={() => navigate("/user/game")}
    >
      Continue
    </Button>
    {#if canContinueGame}
      <AlertDialog>
        <AlertDialogTrigger
          class={buttonVariants({ variant: "default" })}
          type="button"
          disabled={!canContinueGame || wordGameExists.isPending}
        >
          {NEW_GAME_BUTTON_TEXT}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You still have game in progress. It'll be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onclick={handleStartNewGame}
              >Yes</AlertDialogAction
            >
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    {:else}
      <Button
        type="submit"
        disabled={!canContinueGame || wordGameExists.isPending}
      >
        {NEW_GAME_BUTTON_TEXT}
      </Button>
    {/if}
  </div>
</form>
