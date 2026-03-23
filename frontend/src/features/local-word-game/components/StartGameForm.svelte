<script lang="ts">
  import ContinueGameButtonView from "$lib/components/ContinueGameButtonView.svelte";
  import NewGameAlertDialogView from "$lib/components/NewGameAlertDialogView.svelte";
  import NewGameButtonView from "$lib/components/NewGameButtonView.svelte";
  import { Label } from "$lib/components/ui/label";
  import { MaxMistakesNativeSelect } from "../components";
  import { startNewWordGame, startWordGame, words } from "../stores";
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
    <ContinueGameButtonView
      disabled={!canContinueGame}
      onclick={startWordGame}
    />
    {#if canContinueGame}
      <NewGameAlertDialogView {startNewWordGame} />
    {:else}
      <NewGameButtonView type="submit" />
    {/if}
  </div>
</form>
