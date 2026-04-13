<script lang="ts">
  import { onDestroy, onMount } from "svelte";
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

  onMount(() => {
    if ($words.length > 0) {
      setIsTimerActive(true);
    }
  });

  $effect(() => {
    if (!$localWordGame.isTimerActive) {
      return;
    }

    const interval = setInterval(() => {
      const time = localWordGame.get().remainingTime;
      if (time > 0) {
        setRemainingTime(time - 1);
      } else {
        clearInterval(interval);
      }
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
