<script lang="ts">
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
  } from "./ui/alert-dialog";
  import { buttonVariants } from "./ui/button";
  import { LoadingSwap } from "./ui/loading-swap";

  type NewGameAlertDialogViewProps = {
    isActionDisabled?: boolean;
    startNewWordGame: () => void;
  };

  let {
    isActionDisabled = false,
    startNewWordGame,
  }: NewGameAlertDialogViewProps = $props();
</script>

<AlertDialog>
  <AlertDialogTrigger
    class={buttonVariants({ variant: "default" })}
    type="button"
  >
    New game
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
      <AlertDialogAction disabled={isActionDisabled} onclick={startNewWordGame}>
        <LoadingSwap isLoading={isActionDisabled}>Yes</LoadingSwap>
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
