<script lang="ts">
  import { cn, type WithElementRef } from "$lib/utils.js";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
  bind:this={ref}
  data-slot="alert-dialog-footer"
  class={cn("bg-secondary flex w-full gap-2 border-t p-4 *:flex-1", className)}
  {...restProps}
>
  {@render children?.()}
</div>
