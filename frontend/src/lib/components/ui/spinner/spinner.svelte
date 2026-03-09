<script lang="ts">
  import { cn } from "$lib/utils";
  import { LoaderCircleIcon } from "@lucide/svelte";

  type SpinnerProps = {
    class?: string;
  };

  let { class: className }: SpinnerProps = $props();
</script>

<LoaderCircleIcon class={cn("animate-spin", className)} />
