<script lang="ts">
  import { finishWordGame } from "../../store/gameState";
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

  function handleGameReset(): void {
    finishWordGame();
  }
</script>

<AlertDialog>
  <AlertDialogTrigger class={buttonVariants({ variant: "default" })}>
    End the game
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Finish the game?</AlertDialogTitle>
      <AlertDialogDescription>
        This will end the game, but you can continue playing later.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>No</AlertDialogCancel>
      <AlertDialogAction onclick={handleGameReset}>Yes</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
