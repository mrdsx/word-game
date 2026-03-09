<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { LoadingSwap } from "$lib/components/ui/loading-swap";
  import type { Snippet } from "svelte";

  type AuthFormActionProps = {
    isLoading: boolean;
    children?: Snippet;
  };

  let { isLoading, children }: AuthFormActionProps = $props();
</script>

<Button class="w-full" type="submit" disabled={isLoading}>
  <LoadingSwap {isLoading}>{@render children?.()}</LoadingSwap>
</Button>
