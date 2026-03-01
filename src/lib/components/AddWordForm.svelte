<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { MAX_WORD_LENGTH } from "$lib/constants";
  import { declineWord } from "$lib/utils";
  import { createMutation } from "@tanstack/svelte-query";
  import { LoaderCircleIcon } from "lucide-svelte";
  import { assertWordExists } from "../../api/word";
  import {
    incrementWrongAttempts,
    resetWrongAttempts,
  } from "../../store/gameState";
  import { addWord, resetWords, words } from "../../store/words";

  let canAddWords: boolean = $state(true);
  let input: HTMLInputElement | null = $state(null);
  let inputError = $state({
    isError: false,
    message: "",
  });

  function setErrorTrue(message: string): void {
    inputError.isError = true;
    inputError.message = message;
    incrementWrongAttempts(() => {
      const enteredWords = words.get().length;
      inputError.message = `Game over. Your result is ${enteredWords} ${declineWord(enteredWords, ["word", "words"])}.`;
      resetWords();
    });
  }

  const word = createMutation(() => ({
    mutationFn: async (word: string) => {
      return await assertWordExists(word);
    },
    onMutate: () => {
      inputError.isError = false;
      inputError.message = "";
    },
  }));

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (input === null || !canAddWords) return;

    try {
      const newWord = input.value;
      await addWord(newWord, word.mutateAsync);
      input.value = "";
      resetWrongAttempts();
    } catch (error) {
      if (error instanceof Error) {
        setErrorTrue(error.message);
        return;
      }

      throw error;
    }
  }
</script>

<form class="flex w-full gap-2" onsubmit={handleSubmit}>
  <div class="w-full space-y-0.5">
    <Input
      placeholder="Enter the word"
      maxlength={MAX_WORD_LENGTH}
      aria-invalid={inputError.isError}
      disabled={!canAddWords}
      bind:ref={input}
    />
    {#if inputError.isError}
      <p class="text-destructive text-sm">{inputError.message}</p>
    {/if}
  </div>
  <Button class="w-25" type="submit" disabled={word.isPending || !canAddWords}>
    {#if word.isPending}
      <LoaderCircleIcon class="animate-spin" /> Adding
    {:else}
      Add
    {/if}
  </Button>
</form>
