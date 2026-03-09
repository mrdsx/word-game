<script lang="ts">
  import type { Snippet } from "svelte";

  type AuthFormTitleProps = {
    children?: Snippet;
  };

  let { children }: AuthFormTitleProps = $props();
</script>

<h1 class="text-lg font-semibold">{@render children?.()}</h1>
