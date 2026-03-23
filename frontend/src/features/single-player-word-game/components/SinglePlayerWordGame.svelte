<script lang="ts">
  import { authState } from "$features/auth/stores";
  import ContinueGameButtonView from "$lib/components/ContinueGameButtonView.svelte";
  import NewGameAlertDialogView from "$lib/components/NewGameAlertDialogView.svelte";
  import NewGameButtonView from "$lib/components/NewGameButtonView.svelte";
  import { Label } from "$lib/components/ui/label";
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

  async function startNewWordGame(): Promise<void> {
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
        <ContinueGameButtonView
          disabled={!canContinueGame}
          onclick={() => navigate("/user/game")}
        />
      {/if}

      {#if wordGameQuery.isPending}
        <Skeleton class="h-9" />
      {:else if canContinueGame}
        <NewGameAlertDialogView
          isActionDisabled={startNewGameMutation.isPending}
          {startNewWordGame}
        />
      {:else}
        <NewGameButtonView
          disabled={startNewGameMutation.isPending}
          onclick={startNewWordGame}
        />
      {/if}
    </div>
  </form>
</div>
