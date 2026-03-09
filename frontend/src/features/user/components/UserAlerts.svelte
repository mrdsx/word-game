<script>
  import { Alert, AlertTitle } from "$lib/components/ui/alert";
  import { TriangleAlertIcon } from "@lucide/svelte";
  import { authState } from "../../auth/stores";
</script>

{#if $authState.currentUser !== null && !$authState.currentUser.emailVerified}
  <Alert variant="warning">
    <TriangleAlertIcon />
    <AlertTitle>
      Your email is not verified. You can verify it <a
        class="link"
        href="/register/verify">here</a
      >.
    </AlertTitle>
  </Alert>
{/if}
