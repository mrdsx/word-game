<script lang="ts">
  import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
  } from "$lib/components/ui/empty";
  import type { Word } from "../types";
  import WordExplanationSheet from "./WordExplanationSheet.svelte";

  type WordsListProps = {
    words: Word[];
    isHidden?: boolean;
  };

  let { words, isHidden = false }: WordsListProps = $props();
</script>

{#if words.length > 0}
  <ul class="max-h-80 w-full space-y-2 overflow-auto">
    {#each words as word (word)}
      <li
        class="dark:text-background flex items-center justify-between rounded-md bg-blue-100 p-1 pl-2 break-all dark:bg-blue-400/80"
      >
        {word}
        <WordExplanationSheet {word} />
      </li>
    {/each}
  </ul>
{:else if !isHidden}
  <Empty class="border-primary/50 w-full border-2">
    <EmptyHeader>
      <EmptyTitle>No Words Yet</EmptyTitle>
      <EmptyDescription>
        Enter your first word to start the game.
      </EmptyDescription>
    </EmptyHeader>
  </Empty>
{/if}
