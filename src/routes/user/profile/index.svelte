<script lang="ts">
  import { authState } from "$features/auth/stores";
  import { MAX_NICKNAME_LENGTH } from "$features/user/constants";
  import { userProfileMutationOptions } from "$features/user/mutationOptions";
  import { normalizeNickname, validateNickname } from "$features/user/utils";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { LoadingSwap } from "$lib/components/ui/loading-swap";
  import { createMutation } from "@tanstack/svelte-query";
  import { toast } from "svelte-sonner";

  let nickname = $state("");
  let nicknameError: string | null = $state(null);

  const userProfileMutation = createMutation(() => ({
    ...userProfileMutationOptions,
    onSuccess: () => {
      toast.success("Successfully updated profile.");
    },
    onError: () => {
      toast.error("Failed to update profile.");
    },
  }));

  $effect(() => {
    nickname = $authState.currentUser?.displayName ?? "";
  });

  function handleSubmit(event: Event): void {
    event.preventDefault();
    nicknameError = null;

    const user = authState.get().currentUser;
    if (user === null) {
      toast.error("Not authenticated.");
      return;
    } else if (user.displayName === nickname) {
      toast.warning("No changes.");
      return;
    }

    const normalized = normalizeNickname(nickname);
    try {
      validateNickname(normalized);
      userProfileMutation.mutate({ user, nickname });
    } catch (error) {
      if (error instanceof Error) {
        nicknameError = error.message;
      }
    }
  }
</script>

<h1 class="mb-4 text-xl font-semibold">
  {$authState.currentUser?.displayName ?? "User"}'s profile settings
</h1>
<form class="card w-full space-y-4" onsubmit={handleSubmit}>
  <fieldset class="space-y-1.5">
    <Label for="display-name">Nickname</Label>
    <Input
      id="display-name"
      placeholder="Enter your nickname"
      maxlength={MAX_NICKNAME_LENGTH}
      aria-invalid={nicknameError !== null}
      bind:value={nickname}
    />
    {#if nicknameError !== null}
      <p class="text-destructive text-sm">{nicknameError}</p>
    {/if}
  </fieldset>
  <Button type="submit" disabled={userProfileMutation.isPending}>
    <LoadingSwap isLoading={userProfileMutation.isPending} fallback="Saving">
      Save changes
    </LoadingSwap>
  </Button>
</form>
