<script lang="ts">
  import AddWordForm from "$lib/components/AddWordForm.svelte";
  import StartGameForm from "$lib/components/StartGameForm.svelte";
  import WordsArea from "$lib/components/WordsArea.svelte";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { gameState } from "./store/gameState";

  const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
  <div class="flex flex-col items-center gap-4 px-5 pt-20">
    <h1 class="text-2xl font-semibold">Word Game</h1>
    <div class="flex w-full max-w-100 flex-col items-center gap-2">
      {#if $gameState.isPlaying}
        <AddWordForm />
        <WordsArea />
      {:else}
        <StartGameForm />
      {/if}
    </div>
  </div>
</QueryClientProvider>
