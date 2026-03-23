<script lang="ts">
  import { MaxMistakesNativeSelect } from "$features/local-word-game/components";
  import {
    startNewWordGame,
    startWordGame,
    words,
  } from "$features/local-word-game/stores";
  import NewGameAlertDialogView from "$lib/components/NewGameAlertDialogView.svelte";
  import NewGameButtonView from "$lib/components/NewGameButtonView.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Label } from "$lib/components/ui/label";
  import AnsweringTimeNativeSelect from "./AnsweringTimeNativeSelect.svelte";

  let canContinueGame = $derived($words.length > 0);
</script>

<form
  class="card flex w-full flex-col items-center gap-4"
  onsubmit={startNewWordGame}
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
      disabled={!canContinueGame}
      onclick={startWordGame}
    >
      Continue
    </Button>
    {#if canContinueGame}
      <NewGameAlertDialogView {startNewWordGame} />
    {:else}
      <NewGameButtonView type="submit" />
    {/if}
  </div>
</form>
