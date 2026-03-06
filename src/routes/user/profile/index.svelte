<script lang="ts">
  import { authState } from "$features/auth/stores/authState";
  import { userQueryKeys } from "$features/user/queryKeys";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { LoadingSwap } from "$lib/components/ui/loading-swap";
  import { createMutation } from "@tanstack/svelte-query";
  import { updateProfile, type User } from "firebase/auth";
  import { toast } from "svelte-sonner";

  let nickname = $state("");

  const userProfile = createMutation(() => ({
    mutationKey: userQueryKeys.profile,
    mutationFn: async ({
      user,
      nickname,
    }: {
      user: User;
      nickname: string;
    }) => {
      if (nickname.length < 3 || nickname.length > 20) {
        return;
      }

      await updateProfile(user, { displayName: nickname.trim() });
    },
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
    const user = authState.get().currentUser;
    if (user === null) return;

    userProfile.mutate({ user, nickname });
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
      minlength={3}
      maxlength={20}
      bind:value={nickname}
    />
  </fieldset>
  <Button type="submit" disabled={userProfile.isPending}>
    <LoadingSwap isLoading={userProfile.isPending} fallback="Saving">
      Save changes
    </LoadingSwap>
  </Button>
</form>
