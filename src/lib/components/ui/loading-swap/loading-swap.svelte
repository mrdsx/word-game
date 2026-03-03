<script lang="ts">
  import { LoaderCircleIcon } from "lucide-svelte";
  import type { Snippet } from "svelte";

  type LoadingSwapProps = {
    isLoading: boolean;
    fallback?: string;
    children: Snippet;
  };

  let { isLoading, fallback, children }: LoadingSwapProps = $props();
</script>

{#if isLoading}
  <LoaderCircleIcon class="animate-spin" /> {fallback}
{:else}
  {@render children()}
{/if}
