<script lang="ts">
  import { authState } from "$features/auth/stores";
  import {
    MAX_WORD_LENGTH,
    MIN_WORD_LENGTH,
  } from "$features/word-game/constants";
  import { WordGameError } from "$features/word-game/exceptions";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { LoadingSwap } from "$lib/components/ui/loading-swap";
  import { createMutation } from "@tanstack/svelte-query";
  import {
    addWordMutationOptions,
    incrementMistakesMutationOptions,
  } from "../mutationOptions";
  import {
    setSinglePlayerWordGameError,
    singlePlayerWordGameState,
  } from "../stores";

  let newWord: string = $state("");

  const userUID = $derived($authState.currentUser?.uid);
  const wordGame = $derived($singlePlayerWordGameState.wordGame);
  const submitError = $derived($singlePlayerWordGameState.submitError);

  const addWordMutation = createMutation(() => ({
    ...addWordMutationOptions,
  }));

  const incrementMistakesMutation = createMutation(() => ({
    ...incrementMistakesMutationOptions,
  }));

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    setSinglePlayerWordGameError(null);
    if (userUID === undefined || wordGame === undefined || wordGame === null)
      return;

    try {
      await addWordMutation.mutateAsync({
        newWord,
        userUID,
        wordGame,
      });
      newWord = "";
    } catch (error) {
      setSinglePlayerWordGameError(
        (error as { message: string | undefined })?.message ??
          "Something went wrong. Please, try again.",
      );

      if (error instanceof WordGameError) {
        incrementMistakesMutation.mutate({
          userUID,
          wordGame,
        });
      }
    }
  }
</script>

<form class="flex w-full gap-2" onsubmit={handleSubmit}>
  <div class="w-full space-y-0.5">
    <Input
      placeholder="Enter the word"
      minlength={MIN_WORD_LENGTH}
      maxlength={MAX_WORD_LENGTH}
      disabled={wordGame === undefined}
      aria-invalid={submitError !== null}
      bind:value={newWord}
    />
    {#if submitError !== null}
      <p class="text-destructive text-sm">{submitError}</p>
    {/if}
  </div>

  <Button
    class="w-25"
    type="submit"
    disabled={wordGame === undefined || addWordMutation.isPending}
  >
    <LoadingSwap isLoading={addWordMutation.isPending} fallback="Adding">
      Add
    </LoadingSwap>
  </Button>
</form>
