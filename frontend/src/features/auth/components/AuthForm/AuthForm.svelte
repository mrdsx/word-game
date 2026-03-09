<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLFormAttributes } from "svelte/elements";

  type AuthFormProps = {
    children?: Snippet;
  } & HTMLFormAttributes;

  let { children, ...props }: AuthFormProps = $props();
</script>

<form class="card mt-10 flex w-full flex-col items-center gap-4" {...props}>
  {@render children?.()}
</form>
