<script lang="ts">
  import { onMount } from "svelte";
  import { WordsArea } from "../components";
  import {
    localWordGame,
    setIsTimerActive,
    setRemainingTime,
    words,
  } from "../stores";
  import AddWordForm from "./AddWordForm.svelte";
  import StartGameForm from "./StartGameForm.svelte";
  import Timer from "./Timer.svelte";

  let interval: number | undefined = $state(undefined);

  onMount(() => {
    if ($words.length > 0) {
      setIsTimerActive(true);
    }
  });

  $effect(() => {
    if ($localWordGame.answeringTime <= 0) {
      return;
    }
    if (!$localWordGame.isTimerActive) {
      clearInterval(interval);
      return;
    }

    interval = setInterval(() => {
      setRemainingTime(localWordGame.get().remainingTime - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });
</script>

{#if $localWordGame.isPlaying}
  <Timer />
  <AddWordForm />
  <WordsArea />
{:else}
  <StartGameForm />
{/if}
