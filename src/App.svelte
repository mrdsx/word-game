<script lang="ts" module>
  import ToggleThemeButton from "$lib/components/ToggleThemeButton.svelte";
  import { Toaster } from "$lib/components/ui/sonner";
  import UserArea from "$lib/components/UserArea.svelte";
  import { auth } from "$lib/firebase";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import {
    isSignInWithEmailLink,
    onAuthStateChanged,
    signInWithEmailLink,
  } from "firebase/auth";
  import { Router } from "sv-router";
  import { authState } from "./store/authState";
  import { theme } from "./store/theme";
  import { setUser } from "./store/userState";

  const queryClient = new QueryClient();

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
      <UserArea />
    </header>

    <Router />
  </div>
  <Toaster richColors />
</QueryClientProvider>
