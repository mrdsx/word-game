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
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { navigate } from "$lib/router";
  import { cn } from "$lib/utils";
  import { createMutation, createQuery } from "@tanstack/svelte-query";
  import { onSnapshot } from "firebase/firestore";
  import { toast } from "svelte-sonner";
  import { singlePlayerWordsCollection } from "../database/collections";
  import { startNewGameMutationOptions } from "../mutationOptions";
  import { singlePlayerWordGameQueryOptions } from "../queryOptions";
  import MaxMistakesNativeSelect from "./MaxMistakesNativeSelect.svelte";

  // TODO: refactor

  const NEW_GAME_BUTTON_TEXT = "New game";

  let maxMistakesSelectRef: HTMLSelectElement | null = $state(null);
  let singlePlayerWordsLength = $state(0);
  const userUID = $derived($authState.currentUser?.uid);
  const emailVerified = $derived($authState.currentUser?.emailVerified);

  const wordGameQuery = createQuery(() => ({
    ...singlePlayerWordGameQueryOptions,
    enabled: $authState.currentUser !== null,
  }));

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
    if (userUID === undefined) return;

    const unsubscribe = onSnapshot(
      singlePlayerWordsCollection(userUID),
      async (snapshot) => {
        singlePlayerWordsLength = snapshot.docs.length;
      },
    );

    return () => {
      unsubscribe();
    };
  });

  async function handleStartNewGame(): Promise<void> {
    if (userUID === undefined || maxMistakesSelectRef === null) return;

    const maxMistakes = Number(maxMistakesSelectRef.value);
    if (isNaN(maxMistakes)) return;

    startNewGameMutation.mutate({ maxMistakes, userUID });
  }
</script>

<div class=" card relative size-full">
  {#if !emailVerified}
    <div
      class="absolute inset-0 z-1 mx-4 grid place-content-center text-center font-semibold"
    >
      Verify the email to start the game
    </div>
  {/if}
  <form
    class={cn(
      "flex w-full flex-col items-center gap-4",
      !emailVerified && "pointer-events-none opacity-60 blur-[4px]",
    )}
  >
    <fieldset class="flex w-full justify-between space-y-2">
      <Label>Max consecutive mistakes</Label>
      <MaxMistakesNativeSelect bind:maxMistakesSelectRef />
    </fieldset>
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
</div>
