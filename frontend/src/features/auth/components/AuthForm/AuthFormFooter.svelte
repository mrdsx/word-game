<script lang="ts">
  import type { Snippet } from "svelte";

  type AuthFormFooterProps = {
    children?: Snippet;
  };

  let { children }: AuthFormFooterProps = $props();
</script>

<p class=" self-start text-sm">{@render children?.()}</p>
