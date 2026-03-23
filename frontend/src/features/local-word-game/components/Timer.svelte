<script lang="ts">
  import { localWordGame, setRemainingTime, words } from "../stores";

  let interval: number | undefined = $state(undefined);

  $effect(() => {
    if (!$localWordGame.isTimerActive || $localWordGame.answeringTime <= 0)
      return;

    interval = setInterval(() => {
      setRemainingTime(localWordGame.get().remainingTime - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });
</script>

{#if $words.length > 0 && $localWordGame.answeringTime > 0}
  <div class="card-sm">Remaining time: {$localWordGame.remainingTime}</div>
{/if}
