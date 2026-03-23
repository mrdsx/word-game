<script lang="ts">
  import { Button, type ButtonProps } from "./ui/button";
  import { LoadingSwap } from "./ui/loading-swap";

  type NewGameButtonViewProps = {
    disabled?: boolean;
  } & ButtonProps;

  let { disabled = false, ...restProps }: NewGameButtonViewProps = $props();
</script>

<Button {disabled} {...restProps}>
  <LoadingSwap isLoading={disabled}>New game</LoadingSwap>
</Button>
