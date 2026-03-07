<script lang="ts">
  import { authState } from "$features/auth/stores";
  import { LocalWordGame } from "$features/local-word-game/components";
  import { SinglePlayerWordGame } from "$features/single-player-word-game/components";
</script>

<h1 class="mt-10 text-2xl font-semibold">Word Game</h1>
<div
  class="bg-white-100 flex w-full max-w-100 flex-col items-center gap-4 px-5"
>
  {#if $authState.currentUser === null}
    <LocalWordGame />
  {:else}
    <SinglePlayerWordGame />
  {/if}
</div>
