<script lang="ts" module>
  import ToggleThemeButton from "$lib/components/ToggleThemeButton.svelte";
  import { Button } from "$lib/components/ui/button";
  import { auth } from "$lib/firebase";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import {
    isSignInWithEmailLink,
    onAuthStateChanged,
    signInWithEmailLink,
    signOut,
  } from "firebase/auth";
  import { Router } from "sv-router";

  import { navigate } from "$lib/router";
  import { authState } from "./store/authState";
  import { theme } from "./store/theme";
  import { setUser, userState } from "./store/userState";

  const queryClient = new QueryClient();

  async function handleLogout(): Promise<void> {
    await signOut(auth);
    await navigate("/");
  }

  theme.subscribe((newTheme) => {
    if (newTheme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  });

  onAuthStateChanged(auth, (user) => {
    setUser(user);
  });

  if (isSignInWithEmailLink(auth, window.location.href)) {
    const email = authState.get().userEmail;
    if (email !== null) {
      await signInWithEmailLink(auth, email, window.location.href);
    }
  }
</script>

<QueryClientProvider client={queryClient}>
  <div class="flex flex-col items-center gap-4">
    <header class="flex w-full justify-end space-x-2 p-3">
      <ToggleThemeButton />
      {#if $userState.currentUser === null}
        <Button variant="outline" href="/login">Log In</Button>
      {:else}
        <Button variant="outline" onclick={handleLogout}>Log Out</Button>
      {/if}
    </header>

    <Router />
  </div>
</QueryClientProvider>
