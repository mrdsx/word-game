<script lang="ts">
  import {
    incrementMistakes,
    localWordGame,
    resetMistakes,
    resetWords,
    setIsTimerActive,
    setRemainingTime,
    words,
  } from "$features/local-word-game/stores";
  import {
    MAX_WORD_LENGTH,
    MIN_WORD_LENGTH,
  } from "$features/word-game/constants";
  import { WordGameError } from "$features/word-game/exceptions";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { LoadingSwap } from "$lib/components/ui/loading-swap";
  import { declineWord } from "$lib/utils";
  import { createMutation } from "@tanstack/svelte-query";
  import { addWordMutationOptions } from "../mutationOptions";

  let input: HTMLInputElement | null = $state(null);
  let submitError: string | null = $state(null);

  $effect(() => {
    const isTimerOver =
      $localWordGame.remainingTime <= 0 && $localWordGame.answeringTime > 0;
    if (isTimerOver) {
      handleGameOver();
    }
  });

  const addWordMutation = createMutation(() => ({
    ...addWordMutationOptions,
    onMutate: () => {
      setIsTimerActive(false);
    },
    onSettled: () => {
      setIsTimerActive(true);
    },
    onSuccess: () => {
      if (input !== null) input.value = "";
      resetMistakes();
      setRemainingTime($localWordGame.answeringTime);
    },
    onError: (error) => {
      submitError =
        error?.message ?? "Something went wrong. Please, try again.";

      if (error instanceof WordGameError) {
        incrementMistakes(handleGameOver);
      }
    },
  }));

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitError = null;
    if (input === null) return;

    const newWord = input.value;
    addWordMutation.mutate(newWord);
  }

  function handleGameOver(): void {
    const enteredWords = words.get().length;
    if (enteredWords === 0) return;

    submitError = `Game over. Your result is ${enteredWords} ${declineWord(enteredWords, ["word", "words"])}.`;
    setIsTimerActive(false);
    setRemainingTime(localWordGame.get().answeringTime);
    resetWords();
  }
</script>

<form class="flex w-full gap-2" onsubmit={handleSubmit}>
  <div class="w-full space-y-0.5">
    <Input
      placeholder="Enter the word"
      minlength={MIN_WORD_LENGTH}
      maxlength={MAX_WORD_LENGTH}
      aria-invalid={submitError !== null}
      bind:ref={input}
    />
    {#if submitError !== null}
      <p class="text-destructive text-sm">{submitError}</p>
    {/if}
  </div>
  <Button class="w-25" type="submit" disabled={addWordMutation.isPending}>
    <LoadingSwap isLoading={addWordMutation.isPending} fallback="Adding">
      Add
    </LoadingSwap>
  </Button>
</form>
