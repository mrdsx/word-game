<script lang="ts">
  import { fetchDictionaryWord } from "$features/dictionary/api";
  import { dictionaryWordQueryKeys } from "$features/dictionary/queryKeys";
  import { dictionaryWordSchema } from "$features/dictionary/schemas";
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
  import { createMutation } from "@tanstack/svelte-query";
  import type { Word } from "../types";
  import { normalizeWord } from "../utils";

  type WordExplanationProps = {
    word: Word;
  };

  let { word }: WordExplanationProps = $props();
  let wasOpened: boolean = $state(false);
  let wordDefinitions: string[] = $state([]);

  const fetchDictionaryWordMutation = createMutation(() => ({
    mutationKey: dictionaryWordQueryKeys.dictionaryWord,
    mutationFn: async (word: Word) => {
      const normalized = normalizeWord(word);
      const wordData = await fetchDictionaryWord(normalized);
      const { data: dictionaryWord } =
        await dictionaryWordSchema.safeParseAsync(wordData);

      return dictionaryWord;
    },
  }));

  const dictionaryWord = $derived(fetchDictionaryWordMutation.data);

  $effect(() => {
    const words = $state.snapshot(dictionaryWord);
    if (words === undefined) return;

    const definitions: string[] = flatDictionaryWordDefinitions(words);
    wordDefinitions = structuredClone(definitions);
  });

  function handleSheetOpenChange(): void {
    if (!wasOpened) {
      fetchDictionaryWordMutation.mutate(word);
    }
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
      {#if fetchDictionaryWordMutation.isPending}
        <Spinner />
      {:else if fetchDictionaryWordMutation.isError}
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
