<script lang="ts" module>
  import { AuthArea } from "$features/auth/components";
  import { setUser } from "$features/auth/stores";
  import { stopWordGame } from "$features/local-word-game/stores";
  import ToggleThemeButton from "$lib/components/ToggleThemeButton.svelte";
  import { Toaster } from "$lib/components/ui/sonner";
  import { auth } from "$lib/firebase";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { onAuthStateChanged } from "firebase/auth";
  import { Router } from "sv-router";
  import { theme } from "./store/theme";

  const queryClient = new QueryClient();

  theme.subscribe((newTheme) => {
    if (newTheme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  });

  onAuthStateChanged(auth, (user) => {
    if (user !== null) {
      stopWordGame();
    }
    setUser(user);
  });
</script>

<QueryClientProvider client={queryClient}>
  <div class="flex flex-col items-center gap-4">
    <header class="flex w-full justify-end space-x-2 p-3">
      <ToggleThemeButton />
      <AuthArea />
    </header>

    <main class="flex w-full max-w-100 flex-col items-center gap-4 px-4">
      <Router />
    </main>
  </div>
  <Toaster richColors />
</QueryClientProvider>
