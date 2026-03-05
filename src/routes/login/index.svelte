<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import LoadingSwap from "$lib/components/ui/loading-swap/loading-swap.svelte";
  import { auth } from "$lib/firebase";
  import { navigate } from "$lib/router";
  import { emailSchema, loginPasswordSchema } from "$lib/schemas";
  import { createMutation } from "@tanstack/svelte-query";
  import { signInWithEmailAndPassword } from "firebase/auth";
  import { toast } from "svelte-sonner";
  import { userState } from "../../store/userState";

  let email = $state("");
  let password = $state("");
  let emailError: string | null = $state(null);
  let passwordError: string | null = $state(null);

  const userLogin = createMutation(() => ({
    mutationKey: ["login"],
    mutationFn: async () => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    onError: () => {
      toast.error("Wrong email or password.");
    },
  }));

  $effect(() => {
    if ($userState.currentUser !== null) {
      navigate("/");
    }
  });

  function handleSubmit(event: Event): void {
    emailError = null;
    passwordError = null;
    event.preventDefault();

    const emailParse = emailSchema.safeParse(email);
    const passwordParse = loginPasswordSchema.safeParse(password);
    if (!emailParse.success) {
      emailError = "Invalid email.";
    }
    if (!passwordParse.success) {
      passwordError = "Invalid password.";
    }

    if (emailError === null && passwordError === null) {
      userLogin.mutate();
    }
  }
</script>

<form class="card auth-form" onsubmit={handleSubmit}>
  <h1 class="text-lg font-semibold">Login to your account</h1>
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
  <Button class="w-full" type="submit" disabled={userLogin.isPending}>
    <LoadingSwap isLoading={userLogin.isPending}>Log In</LoadingSwap>
  </Button>
  <p class=" self-start text-sm">
    Don't have account yet? Create new <Button href="/register" variant="link">
      here
    </Button>.
  </p>
</form>

<style>
  @import "tailwindcss";

  .form-fieldset {
    @apply w-full space-y-1;
  }
</style>
