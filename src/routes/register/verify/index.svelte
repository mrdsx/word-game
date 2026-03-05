<script lang="ts">
  import { Alert, AlertTitle } from "$lib/components/ui/alert";
  import { Button } from "$lib/components/ui/button";
  import LoadingSwap from "$lib/components/ui/loading-swap/loading-swap.svelte";
  import { actionCodeSettings } from "$lib/firebase";
  import { navigate } from "$lib/router";
  import { createMutation } from "@tanstack/svelte-query";
  import { sendEmailVerification, type User } from "firebase/auth";
  import { CircleCheckIcon } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import { userState } from "../../../store/userState";

  let isEmailSent = $state(false);
  const user = $derived($userState.currentUser);

  const confirmationEmail = createMutation(() => ({
    mutationKey: ["confirmationEmail"],
    mutationFn: async (user: User) => {
      await sendEmailVerification(user, actionCodeSettings);
    },
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

  function handleSendEmailVerification(): void {
    if (user === null) return;
    confirmationEmail.mutate(user);
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
      disabled={confirmationEmail.isPending}
      onclick={handleSendEmailVerification}
    >
      <LoadingSwap isLoading={confirmationEmail.isPending} fallback="Sending">
        Send verification email
      </LoadingSwap>
    </Button>
  {/if}
</div>
