<script>
  import { Button } from "$lib/components/ui/button";
  import { MoonIcon, SunIcon } from "@lucide/svelte";
  import { theme } from "../../store/theme";
</script>

<Button
  variant="outline"
  onclick={() => ($theme = $theme === "dark" ? "light" : "dark")}
>
  {#if $theme === "dark"}
    <SunIcon />
  {:else}
    <MoonIcon />
  {/if}
</Button>
