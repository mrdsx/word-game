<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import LoadingSwap from "$lib/components/ui/loading-swap/loading-swap.svelte";
  import { auth } from "$lib/firebase";
  import { navigate } from "$lib/router";
  import { emailSchema, signUpPasswordSchema } from "$lib/schemas";
  import { mapFirebaseErrorCode } from "$lib/utils";
  import { createMutation } from "@tanstack/svelte-query";
  import {
    createUserWithEmailAndPassword,
    type AuthError,
  } from "firebase/auth";
  import { toast } from "svelte-sonner";

  let email = $state("");
  let password = $state("");
  let emailError: string | null = $state(null);
  let passwordError: string | null = $state(null);

  const userSignUp = createMutation(() => ({
    mutationKey: ["signup"],
    mutationFn: async () => {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      return userCredential;
    },
    onSuccess: () => {
      navigate("/register/verify");
    },
    onError: (error: AuthError) => {
      const firebaseError = mapFirebaseErrorCode(error.code);
      toast.error(firebaseError ?? "Failed to sign up.");
    },
  }));

  function handleSubmit(event: Event): void {
    emailError = null;
    passwordError = null;
    event.preventDefault();

    const emailParse = emailSchema.safeParse(email);
    const passwordParse = signUpPasswordSchema.safeParse(password);
    if (!emailParse.success) {
      emailError = "Invalid email.";
    }
    if (!passwordParse.success) {
      passwordError = "Invalid password.";
    }

    if (emailError === null && passwordError === null) {
      userSignUp.mutate();
    }
  }
</script>

<form class="card auth-form" onsubmit={handleSubmit}>
  <h1 class="text-lg font-semibold">Create new account</h1>
  <fieldset class="form-fieldset">
    <Label for="email">Email</Label>
    <Input
      id="email"
      placeholder="Enter your email"
      aria-invalid={emailError !== null}
      bind:value={email}
    />
    {#if emailError !== null}
      <p class="text-destructive text-sm">{emailError}</p>
    {/if}
  </fieldset>
  <fieldset class="form-fieldset">
    <Label for="password">Password</Label>
    <Input
      id="password"
      type="password"
      placeholder="Enter your password"
      aria-invalid={passwordError !== null}
      bind:value={password}
    />
    {#if passwordError !== null}
      <p class="text-destructive text-sm">{passwordError}</p>
    {/if}
  </fieldset>
  <Button class="w-full" type="submit" disabled={userSignUp.isPending}>
    <LoadingSwap isLoading={userSignUp.isPending}>Sign Up</LoadingSwap>
  </Button>
</form>

<style>
  @import "tailwindcss";

  .form-fieldset {
    @apply w-full space-y-1;
  }
</style>
