<script lang="ts">
  import { localWordGameQueryKeys } from "$features/local-word-game/queryKeys";
  import {
    addWord,
    incrementMistakes,
    resetMistakes,
    resetWords,
    words,
  } from "$features/local-word-game/stores";
  import {
    MAX_WORD_LENGTH,
    MIN_WORD_LENGTH,
  } from "$features/word-game/constants";
  import { WordGameError } from "$features/word-game/exceptions";
  import type { Word } from "$features/word-game/types";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { LoadingSwap } from "$lib/components/ui/loading-swap";
  import { declineWord } from "$lib/utils";
  import { createMutation } from "@tanstack/svelte-query";

  let canAddWords: boolean = $state(true);
  let input: HTMLInputElement | null = $state(null);
  let submitError: string | null = $state(null);

  const addWordMutation = createMutation(() => ({
    mutationKey: localWordGameQueryKeys.addWord,
    mutationFn: async (word: Word) => {
      return await addWord(word);
    },
  }));

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitError = null;
    if (input === null || !canAddWords) return;

    try {
      const newWord = input.value;
      await addWordMutation.mutateAsync(newWord);
      input.value = "";
      resetMistakes();
    } catch (error) {
      submitError =
        (error as { message: string | undefined })?.message ??
        "Something went wrong. Please, try again.";

      if (error instanceof WordGameError) {
        incrementMistakes(handleGameOver);
      }
    }
  }

  function handleGameOver(): void {
    const enteredWords = words.get().length;
    if (enteredWords === 0) return;
    submitError = `Game over. Your result is ${enteredWords} ${declineWord(enteredWords, ["word", "words"])}.`;
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
      disabled={!canAddWords}
      bind:ref={input}
    />
    {#if submitError !== null}
      <p class="text-destructive text-sm">{submitError}</p>
    {/if}
  </div>
  <Button
    class="w-25"
    type="submit"
    disabled={addWordMutation.isPending || !canAddWords}
  >
    <LoadingSwap isLoading={addWordMutation.isPending} fallback="Adding">
      Add
    </LoadingSwap>
  </Button>
</form>
