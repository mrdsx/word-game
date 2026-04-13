<script lang="ts">
  import { authState } from "$features/auth/stores";
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
  import { buttonVariants } from "$lib/components/ui/button";
  import { mapFirebaseErrorCode, REQUIRES_RECENT_LOGIN } from "$lib/firebase";
  import { navigate } from "$lib/router";
  import { FirebaseError } from "firebase/app";
  import { deleteUser } from "firebase/auth";
  import { toast } from "svelte-sonner";

  async function handleSubmit(): Promise<void> {
    const user = authState.get().currentUser;

    if (user === null) {
      toast.error("Not authenticated");
      return;
    }

    try {
      await deleteUser(user);
      await navigate("/");
    } catch (error) {
      if (
        error instanceof FirebaseError &&
        error.code === REQUIRES_RECENT_LOGIN
      ) {
        await navigate("/login");
      }

      const message =
        error instanceof FirebaseError
          ? mapFirebaseErrorCode(error.code)
          : "Something went wrong.";
      toast.error(message ?? "Failed to delete user.");
    }
  }
</script>

<form class="card card-sm card-destructive sp w-full space-y-4">
  <h2 class="text-lg font-semibold">Danger zone</h2>
  <AlertDialog>
    <AlertDialogTrigger
      class={buttonVariants({ size: "sm", variant: "destructive" })}
      type="button"
    >
      Delete account
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onclick={handleSubmit}>Delete</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</form>
