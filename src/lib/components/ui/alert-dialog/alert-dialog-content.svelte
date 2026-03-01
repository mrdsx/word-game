<script lang="ts">
  import {
    cn,
    type WithoutChild,
    type WithoutChildrenOrChild,
  } from "$lib/utils.js";
  import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
  import type { ComponentProps } from "svelte";
  import AlertDialogOverlay from "./alert-dialog-overlay.svelte";
  import AlertDialogPortal from "./alert-dialog-portal.svelte";

  let {
    ref = $bindable(null),
    class: className,
    portalProps,
    ...restProps
  }: WithoutChild<AlertDialogPrimitive.ContentProps> & {
    portalProps?: WithoutChildrenOrChild<
      ComponentProps<typeof AlertDialogPortal>
    >;
  } = $props();
</script>

<AlertDialogPortal {...portalProps}>
  <AlertDialogOverlay />
  <AlertDialogPrimitive.Content
    bind:ref
    data-slot="alert-dialog-content"
    class={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200",
      "bg-background fixed top-[50%] left-[50%] z-50 flex w-full max-w-80 -translate-x-[50%] -translate-y-[50%] flex-col items-center gap-2 overflow-hidden rounded-lg border text-center shadow-lg",
      className,
    )}
    {...restProps}
  />
</AlertDialogPortal>
