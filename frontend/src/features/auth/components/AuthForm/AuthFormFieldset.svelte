<script lang="ts">
  import type { Snippet } from "svelte";

  type AuthFormFieldsetProps = {
    children?: Snippet;
  };

  let { children }: AuthFormFieldsetProps = $props();
</script>

<fieldset class="w-full space-y-2">{@render children?.()}</fieldset>
