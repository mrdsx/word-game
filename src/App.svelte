<script lang="ts">
  import AddWordForm from "$lib/components/AddWordForm.svelte";
  import StartGameForm from "$lib/components/StartGameForm.svelte";
  import ToggleThemeButton from "$lib/components/ToggleThemeButton.svelte";
  import { Button } from "$lib/components/ui/button";
  import WordsArea from "$lib/components/WordsArea.svelte";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { gameState } from "./store/gameState";
  import { Router } from "sv-router";
  import { theme } from "./store/theme";
  import "sv-router/generated";

  const queryClient = new QueryClient();

  $effect(() => {
    if ($theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  });
</script>

<QueryClientProvider client={queryClient}>
  <div class="flex flex-col items-center gap-4">
    <header class="flex w-full justify-end space-x-2 p-3">
      <ToggleThemeButton />
      <Button variant="outline" href="/login">Log In</Button>
    </header>

    <Router />
  </div>
</QueryClientProvider>
