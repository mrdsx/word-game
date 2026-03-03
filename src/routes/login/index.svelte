<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import LoadingSwap from "$lib/components/ui/loading-swap/loading-swap.svelte";
  import { actionCodeSettings, auth } from "$lib/firebase";
  import { navigate } from "$lib/router";
  import { emailSchema } from "$lib/schemas";
  import { createMutation } from "@tanstack/svelte-query";
  import { sendSignInLinkToEmail } from "firebase/auth";
  import { setUserEmail } from "../../store/authState";
  import { userState } from "../../store/userState";

  let email = $state("");
  let submitError: string | null = $state(null);

  const userLogin = createMutation(() => ({
    mutationKey: ["login"],
    mutationFn: async () => {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      setUserEmail(email);
    },
  }));

  $effect(() => {
    if ($userState.currentUser !== null) {
      navigate("/");
    }
  });

  async function handleSubmit(event: Event): Promise<void> {
    submitError = null;
    event.preventDefault();
    const { success } = emailSchema.safeParse(email);
    if (!success) {
      submitError = "Invalid email.";
      return;
    }

    userLogin.mutate();
  }
</script>

<form
  class="flex w-full max-w-90 flex-col items-center gap-2 pt-20"
  onsubmit={handleSubmit}
>
  <h1 class="mb-4 text-lg font-semibold">Login to your account</h1>
  <fieldset class="w-full space-y-1">
    <Input
      placeholder="Enter your email"
      aria-invalid={submitError !== null}
      bind:value={email}
    />
    {#if submitError !== null}
      <p class="text-destructive self-start text-sm">{submitError}</p>
    {/if}
  </fieldset>
  <Button class="w-full" type="submit" disabled={userLogin.isPending}>
    <LoadingSwap isLoading={userLogin.isPending}>Log In</LoadingSwap>
  </Button>
</form>
