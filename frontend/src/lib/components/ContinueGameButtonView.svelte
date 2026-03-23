<script lang="ts">
  import { Button, type ButtonProps } from "./ui/button";

  let { ...props }: ButtonProps = $props();
</script>

<Button variant="outline" {...props}>Continue</Button>
