<script lang="ts">
  import { singlePlayerWordGameState } from "$features/single-player-word-game/stores";
  import { WordGameInfo, WordsList } from "$features/word-game/components";
  import { reverseWords } from "$features/word-game/utils";
  import { Spinner } from "$lib/components/ui/spinner";

  const wordGame = $derived($singlePlayerWordGameState.wordGame);
  const wordGameWords = $derived($singlePlayerWordGameState.words);
  const reversedWords = $derived(reverseWords(wordGameWords));
</script>

<div class="flex w-full flex-col items-center gap-2">
  {#if wordGame === undefined}
    <Spinner class="my-1 size-5" />
  {:else if wordGame === null}
    <p class="text-destructive">Failed to load words.</p>
  {:else if wordGameWords.length > 0}
    <WordGameInfo
      words={wordGameWords}
      mistakes={wordGame.mistakes}
      maxMistakes={wordGame.maxMistakes}
    />
  {/if}
  <WordsList
    isHidden={wordGame === undefined || wordGame === null}
    words={reversedWords}
  />
</div>
