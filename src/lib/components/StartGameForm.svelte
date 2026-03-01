<script lang="ts" module>
  import { Label } from "$lib/components/ui/label";
  import { startNewWordGame, startWordGame } from "../../store/gameState";
  import { words } from "../../store/words";
  import MaxAttemptsNativeSelect from "./MaxAttemptsNativeSelect.svelte";
  import { Button } from "./ui/button";
</script>

<script lang="ts">
  let canContinueGame = $state(words.get().length > 0);

  function handleSubmit(): void {
    startNewWordGame();
  }

  function continueGame(): void {
    startWordGame();
  }
</script>

<form
  class="card flex w-full max-w-80 flex-col items-center gap-4"
  onsubmit={handleSubmit}
>
  <div class="flex w-full justify-between space-y-2">
    <Label>Max wrong attempts</Label>
    <MaxAttemptsNativeSelect />
  </div>
  <div class="flex gap-2 *:w-25">
    <Button
      variant="outline"
      onclick={continueGame}
      disabled={!canContinueGame}
    >
      Continue
    </Button>
    <Button type="submit">New game</Button>
  </div>
</form>
