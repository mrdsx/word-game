<script lang="ts">
  import {
    localWordGame,
    localWordGamePreferences,
    setIsTimerActive,
    words,
  } from "$features/local-word-game/stores";
  import { WordGameInfo, WordsList } from "$features/word-game/components";
  import { reverseWords } from "$features/word-game/utils";
  import LocalWordGameActions from "./LocalWordGameActions.svelte";

  const reversedWords = $derived(reverseWords($words));

  $effect(() => {
    if ($words.length > 0) {
      setIsTimerActive(true);
    } else {
      setIsTimerActive(false);
    }
  });
</script>

<div class="flex w-full flex-col items-center gap-2">
  {#if $words.length > 0}
    <WordGameInfo
      words={$words}
      mistakes={$localWordGame.mistakes}
      maxMistakes={$localWordGamePreferences.currentMaxMistakes}
    />
  {/if}
  <WordsList words={reversedWords} />
  <LocalWordGameActions class="mt-2" />
</div>
