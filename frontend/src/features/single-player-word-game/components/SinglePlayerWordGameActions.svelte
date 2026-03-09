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
  import { LoadingSwap } from "$lib/components/ui/loading-swap";
  import { mapFirebaseErrorCode } from "$lib/firebase";
  import { navigate } from "$lib/router";
  import { createMutation } from "@tanstack/svelte-query";
  import type { FirebaseError } from "firebase/app";
  import { toast } from "svelte-sonner";
  import { resetSinglePlayerWordsMutationOptions } from "../mutationOptions";
  import { singlePlayerWordGameState } from "../stores";

  const wordGame = $derived($singlePlayerWordGameState.wordGame);
  const singlePlayerWords = $derived(
    $singlePlayerWordGameState.words as Word[],
  );
  const userUID = $derived($authState.currentUser?.uid);

  const resetSinglePlayerWordsMutation = createMutation(() => ({
    ...resetSinglePlayerWordsMutationOptions,
    onError: (error: FirebaseError) => {
      const message = mapFirebaseErrorCode(error.code);
      toast.error(message ?? "Failed to reset the words.");
    },
  }));

  async function handleSinglePlayerWordsReset(): Promise<void> {
    if (userUID === undefined) return;
    resetSinglePlayerWordsMutation.mutate(userUID);
  }
</script>

<div class="space-x-1">
  {#if wordGame !== undefined && wordGame !== null && singlePlayerWords.length > 0}
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
          <AlertDialogAction
            disabled={resetSinglePlayerWordsMutation.isPending}
            onclick={handleSinglePlayerWordsReset}
          >
            <LoadingSwap isLoading={resetSinglePlayerWordsMutation.isPending}>
              Yes
            </LoadingSwap>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  {/if}

  <Button onclick={() => navigate("/")}>Finish</Button>
</div>
