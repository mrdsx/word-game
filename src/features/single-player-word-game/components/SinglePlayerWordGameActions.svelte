<script lang="ts">
  import { authState } from "$features/auth/stores";
  import type { Word } from "$features/word-game/types";
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
  import { navigate } from "$lib/router";
  import { resetSinglePlayerWords } from "../services";
  import { singlePlayerWordGameState } from "../stores";

  const wordGame = $derived($singlePlayerWordGameState.wordGame);
  const wordGameWords = $derived((wordGame ?? { words: [] }).words as Word[]);
  const userUID = $derived($authState.currentUser?.uid);
</script>

<div class="space-x-1">
  {#if wordGame !== undefined && wordGame !== null && wordGameWords.length > 0}
    <AlertDialog>
      <AlertDialogTrigger class={buttonVariants({ variant: "outline" })}>
        Reset
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            All entered words will be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No</AlertDialogCancel>
          <AlertDialogAction onclick={() => resetSinglePlayerWords(userUID)}>
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  {/if}

  <Button onclick={() => navigate("/")}>Finish</Button>
</div>
