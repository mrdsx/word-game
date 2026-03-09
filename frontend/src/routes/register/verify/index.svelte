<script lang="ts">
  import { verifyEmailMutationOptions } from "$features/auth/mutationOptions";
  import { authState } from "$features/auth/stores";
  import { Alert, AlertTitle } from "$lib/components/ui/alert";
  import { Button } from "$lib/components/ui/button";
  import { LoadingSwap } from "$lib/components/ui/loading-swap";
  import { navigate } from "$lib/router";
  import { CircleCheckIcon } from "@lucide/svelte";
  import { createMutation } from "@tanstack/svelte-query";
  import { toast } from "svelte-sonner";

  let isEmailSent = $state(false);
  const user = $derived($authState.currentUser);

  const verifyEmailMutation = createMutation(() => ({
    ...verifyEmailMutationOptions,
    onSuccess: () => {
      isEmailSent = true;
    },
    onError: () => {
      toast.error("Failed to send verification email.");
    },
  }));

  $effect(() => {
    if (user?.emailVerified) {
      navigate("/");
    }
  });

  function handleSendVerificationEmail(): void {
    if (user === null) {
      toast.error("Not authenticated.");
    } else {
      verifyEmailMutation.mutate(user);
    }
  }
</script>

<div class="flex flex-col items-center gap-2 pt-20">
  <h1 class="mb-4 text-lg font-semibold">Verify your email</h1>
  {#if isEmailSent}
    <Alert variant="success">
      <CircleCheckIcon />
      <AlertTitle>Verification letter has been sent to your email.</AlertTitle>
    </Alert>
  {:else}
    <Button
      disabled={$authState.currentUser === null ||
        verifyEmailMutation.isPending}
      onclick={handleSendVerificationEmail}
    >
      <LoadingSwap isLoading={verifyEmailMutation.isPending} fallback="Sending">
        Send verification email
      </LoadingSwap>
    </Button>
  {/if}
</div>
