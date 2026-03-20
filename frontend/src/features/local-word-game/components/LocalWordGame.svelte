<script>
  import { WordsArea } from "$features/local-word-game/components";
  import { localWordGame } from "$features/local-word-game/stores";
  import AddWordForm from "./AddWordForm.svelte";
  import StartGameForm from "./StartGameForm.svelte";
  import Timer from "./Timer.svelte";
</script>

{#if $localWordGame.isPlaying}
  <Timer />
  <AddWordForm />
  <WordsArea />
{:else}
  <StartGameForm />
{/if}
