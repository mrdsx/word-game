<script lang="ts">
  import { authState } from "$features/auth/stores";
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
  } from "$lib/components/ui/alert-dialog";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import { Label } from "$lib/components/ui/label";
  import { LoadingSwap } from "$lib/components/ui/loading-swap";
  import {
    NativeSelect,
    NativeSelectOption,
  } from "$lib/components/ui/native-select";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { db } from "$lib/firebase";
  import { navigate } from "$lib/router";
  import { createMutation, createQuery } from "@tanstack/svelte-query";
  import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
  import { toast } from "svelte-sonner";
  import { startNewGameMutationOptions } from "../mutationOptions";
  import {
    singlePlayerWordGamePreferencesQueryOptions,
    singlePlayerWordGameQueryOptions,
  } from "../queryOptions";
  import type { SinglePlayerWord } from "../types";

  // TODO: refactor

  const NEW_GAME_BUTTON_TEXT = "New game";

  let maxMistakesSelectRef: HTMLSelectElement | null = $state(null);
  let singlePlayerWordsLength = $state(0);
  const userUID = $derived($authState.currentUser?.uid);

  const wordGameQuery = createQuery(() => ({
    ...singlePlayerWordGameQueryOptions,
    enabled: $authState.currentUser !== null,
  }));

  const wordGamePreferencesQuery = createQuery(() => ({
    ...singlePlayerWordGamePreferencesQueryOptions,
    enabled: $authState.currentUser !== null,
  }));

  const maxMistakes = $derived(wordGamePreferencesQuery.data?.maxMistakes ?? 5);
  const canContinueGame = $derived(
    wordGameQuery.data !== undefined &&
      wordGameQuery.data !== null &&
      singlePlayerWordsLength > 0,
  );

  const startNewGameMutation = createMutation(() => ({
    ...startNewGameMutationOptions,
    onSuccess: async () => {
      await navigate("/user/game");
    },
    onError: () => {
      toast.error("Failed to start game.");
    },
  }));

  $effect(() => {
    if (maxMistakesSelectRef !== null) {
      maxMistakesSelectRef.value = String(maxMistakes);
    }
  });

  $effect(() => {
    if (userUID === undefined) return;

    const wordsRef = collection(db, "singlePlayerWordGames", userUID, "words");
    const unsubscribe = onSnapshot(wordsRef, async (snapshot) => {
      const wordDocuments = snapshot.docs.map((word) =>
        word.data(),
      ) as SinglePlayerWord[];
      singlePlayerWordsLength = wordDocuments.length;
    });

    return () => {
      unsubscribe();
    };
  });

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

    startNewGameMutation.mutate({ maxMistakes, userUID });
  }
</script>

<form class="card flex w-full flex-col items-center gap-4">
  <div class="flex w-full justify-between space-y-2">
    <Label>Max consecutive mistakes</Label>
    {#if wordGamePreferencesQuery.isPending}
      <Skeleton class="h-9 w-14.5" />
    {:else}
      <NativeSelect
        value={maxMistakes}
        disabled={wordGamePreferencesQuery.isPending}
        onchange={handleUpdateMaxMistakes}
        bind:ref={maxMistakesSelectRef}
      >
        <NativeSelectOption value="1">1</NativeSelectOption>
        <NativeSelectOption value="2">2</NativeSelectOption>
        <NativeSelectOption value="3">3</NativeSelectOption>
        <NativeSelectOption value="4">4</NativeSelectOption>
        <NativeSelectOption value="5">5</NativeSelectOption>
      </NativeSelect>
    {/if}
  </div>
  <div class="flex gap-2 *:w-25">
    {#if wordGameQuery.isPending}
      <Skeleton class="h-9" />
    {:else}
      <Button
        variant="outline"
        disabled={!canContinueGame || wordGameQuery.isPending}
        onclick={() => navigate("/user/game")}
      >
        Continue
      </Button>
    {/if}
    {#if wordGameQuery.isPending}
      <Skeleton class="h-9" />
    {:else if canContinueGame}
      <AlertDialog>
        <AlertDialogTrigger
          class={buttonVariants({ variant: "default" })}
          type="button"
          disabled={!canContinueGame || wordGameQuery.isPending}
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
            <AlertDialogAction
              disabled={startNewGameMutation.isPending}
              onclick={handleStartNewGame}
            >
              <LoadingSwap isLoading={startNewGameMutation.isPending}>
                Yes
              </LoadingSwap>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    {:else}
      <Button
        disabled={wordGameQuery.isPending || startNewGameMutation.isPending}
        onclick={handleStartNewGame}
      >
        <LoadingSwap isLoading={startNewGameMutation.isPending}>
          {NEW_GAME_BUTTON_TEXT}
        </LoadingSwap>
      </Button>
    {/if}
  </div>
</form>
