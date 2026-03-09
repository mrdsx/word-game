<script lang="ts">
  import type { Snippet } from "svelte";
  import { Spinner } from "../spinner";

  type LoadingSwapProps = {
    isLoading: boolean;
    fallback?: string;
    children: Snippet;
  };

  let { isLoading, fallback, children }: LoadingSwapProps = $props();
</script>

{#if isLoading}
  <Spinner /> {fallback}
{:else}
  {@render children()}
{/if}
