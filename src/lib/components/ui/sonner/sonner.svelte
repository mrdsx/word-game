<script lang="ts">
  import {
    CircleCheckIcon,
    CircleXIcon,
    InfoIcon,
    LoaderCircleIcon,
    TriangleAlertIcon,
  } from "@lucide/svelte";

  import {
    Toaster as Sonner,
    type ToasterProps as SonnerProps,
  } from "svelte-sonner";
  import { theme } from "../../../../store/theme";

  let { ...restProps }: SonnerProps = $props();
</script>

<Sonner
  class="toaster group"
  theme={$theme}
  style="--normal-bg: var(--color-popover); --normal-text: var(--color-popover-foreground); --normal-border: var(--color-border);"
  {...restProps}
>
  {#snippet loadingIcon()}
    <LoaderCircleIcon class="size-4 animate-spin" />
  {/snippet}
  {#snippet successIcon()}
    <CircleCheckIcon class="size-4" />
  {/snippet}
  {#snippet errorIcon()}
    <CircleXIcon class="size-4" />
  {/snippet}
  {#snippet infoIcon()}
    <InfoIcon class="size-4" />
  {/snippet}
  {#snippet warningIcon()}
    <TriangleAlertIcon class="size-4" />
  {/snippet}
</Sonner>
