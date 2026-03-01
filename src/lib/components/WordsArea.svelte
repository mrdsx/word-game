<script lang="ts">
  import { resetWords, words } from "../../store/words";
  import FinishGameAlertDialog from "./FinishGameAlertDialog.svelte";
  import { Button } from "./ui/button";
</script>

<ul class="max-h-100 w-full space-y-2 overflow-auto">
  {#each $words as word (word)}
    <li class="rounded-md bg-blue-100 px-2 py-1 break-all">
      {word}
    </li>
  {/each}
</ul>
<div>
  {#if $words.length > 0}
    <Button variant="outline" onclick={resetWords}>Reset</Button>
  {/if}
  <FinishGameAlertDialog />
</div>
