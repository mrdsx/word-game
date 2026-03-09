<script lang="ts">
  import { getDictionaryWordQueryOptions } from "$features/dictionary/queryOptions";
  import { flatDictionaryWordDefinitions } from "$features/dictionary/utils";
  import { buttonVariants } from "$lib/components/ui/button";
  import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "$lib/components/ui/sheet";
  import { Spinner } from "$lib/components/ui/spinner";
  import { capitalizeWord, cn } from "$lib/utils";
  import { BookTextIcon } from "@lucide/svelte";
  import { createQuery } from "@tanstack/svelte-query";
  import type { Word } from "../types";

  type WordExplanationProps = {
    word: Word;
  };

  let { word }: WordExplanationProps = $props();
  let wasOpened: boolean = $state(false);
  let wordDefinitions: string[] = $state([]);

  const dictionaryWordQuery = createQuery(() => ({
    ...getDictionaryWordQueryOptions(word),
    enabled: wasOpened,
  }));

  const dictionaryWord = $derived(dictionaryWordQuery.data);

  $effect(() => {
    const words = $state.snapshot(dictionaryWord);
    if (words === undefined) return;

    const definitions: string[] = flatDictionaryWordDefinitions(words);
    wordDefinitions = structuredClone(definitions);
  });

  function handleSheetOpenChange(): void {
    wasOpened = true;
  }
</script>

<Sheet onOpenChange={handleSheetOpenChange}>
  <SheetTrigger
    class={cn(
      buttonVariants({ size: "icon-sm", variant: "ghost" }),
      "hover:bg-blue-300 dark:hover:bg-blue-600",
    )}
  >
    <BookTextIcon />
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      {#if dictionaryWordQuery.isPending}
        <Spinner />
      {:else if dictionaryWordQuery.isError}
        <p class="text-destructive">Failed to fetch word.</p>
      {:else}
        <SheetTitle class="mb-2 text-lg">{capitalizeWord(word)}</SheetTitle>
        <SheetDescription class="text-foreground max-h-[90vh] overflow-auto">
          <ol class="space-y-2 text-[15px]">
            {#each wordDefinitions as definition, index}
              <li>
                <span class="font-bold">{index + 1}.</span>
                {definition}
              </li>
            {/each}
          </ol>
        </SheetDescription>
      {/if}
    </SheetHeader>
  </SheetContent>
</Sheet>
