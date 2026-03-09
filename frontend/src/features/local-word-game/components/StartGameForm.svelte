<script lang="ts">
  import { MaxMistakesNativeSelect } from "$features/local-word-game/components";
  import {
    startNewWordGame,
    startWordGame,
    words,
  } from "$features/local-word-game/stores";
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "$lib/components/ui/alert-dialog";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import { Label } from "$lib/components/ui/label";

  const NEW_GAME_BUTTON_TEXT = "New game";

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
  <div class="flex w-full justify-between space-y-2">
    <Label>Max consecutive mistakes</Label>
    <MaxMistakesNativeSelect />
  </div>
  <div class="flex gap-2 *:w-25">
    <Button
      variant="outline"
      onclick={continueGame}
      disabled={!canContinueGame}
    >
      Continue
    </Button>
    {#if canContinueGame}
      <AlertDialog>
        <AlertDialogTrigger
          class={buttonVariants({ variant: "default" })}
          type="button"
        >
          {NEW_GAME_BUTTON_TEXT}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You still have game in progress. It'll be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onclick={startNewWordGame}>
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    {:else}
      <Button type="submit">{NEW_GAME_BUTTON_TEXT}</Button>
    {/if}
  </div>
</form>
