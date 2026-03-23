<script lang="ts">
  import { MaxMistakesNativeSelect } from "$features/local-word-game/components";
  import {
    startNewWordGame,
    startWordGame,
    words,
  } from "$features/local-word-game/stores";
  import NewGameAlertDialogView from "$lib/components/NewGameAlertDialogView.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Label } from "$lib/components/ui/label";
  import AnsweringTimeNativeSelect from "./AnsweringTimeNativeSelect.svelte";

  let canContinueGame = $derived($words.length > 0);

  function handleSubmit(): void {
    startNewWordGame();
  }

  function continueGame(): void {
    startWordGame();
  }
</script>

<form
  class="card flex w-full flex-col items-center gap-4"
  onsubmit={handleSubmit}
>
  <fieldset class="flex w-full justify-between">
    <Label>Max consecutive mistakes</Label>
    <MaxMistakesNativeSelect />
  </fieldset>
  <fieldset class="flex w-full justify-between">
    <Label>Answering time</Label>
    <AnsweringTimeNativeSelect />
  </fieldset>
  <div class="flex gap-2 *:w-25">
    <Button
      variant="outline"
      onclick={continueGame}
      disabled={!canContinueGame}
    >
      Continue
    </Button>
    {#if canContinueGame}
      <NewGameAlertDialogView {startNewWordGame} />
    {:else}
      <Button type="submit">New game</Button>
    {/if}
  </div>
</form>
