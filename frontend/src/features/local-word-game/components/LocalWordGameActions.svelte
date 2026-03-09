<script lang="ts">
  import {
    resetWordGame,
    stopWordGame,
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
  import { cn } from "$lib/utils";

  type LocalWordGameActionsProps = {
    class?: string;
  };

  let { class: className }: LocalWordGameActionsProps = $props();
</script>

<div class={cn("space-x-1", className)}>
  {#if $words.length > 0}
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
          <AlertDialogAction onclick={resetWordGame}>Yes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  {/if}

  <Button onclick={stopWordGame}>Finish</Button>
</div>
