<script lang="ts">
  import { localWordGame, words } from "../stores";
</script>

{#if $words.length > 0 && $localWordGame.answeringTime > 0}
  <div class="card-sm">Remaining time: {$localWordGame.remainingTime}</div>
{/if}
