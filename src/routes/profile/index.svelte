<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { LoadingSwap } from "$lib/components/ui/loading-swap";
  import { createMutation } from "@tanstack/svelte-query";
  import { updateProfile, type User } from "firebase/auth";
  import { toast } from "svelte-sonner";
  import { userState } from "../../store/userState";

  let nickname = $state("");

  const userProfile = createMutation(() => ({
    mutationKey: ["userProfile"],
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
    onError: () => {
      toast.error("Failed to update profile.");
    },
  }));

  $effect(() => {
    nickname = $userState.currentUser?.displayName ?? "";
  });

  function handleSubmit(event: Event): void {
    event.preventDefault();
    const user = userState.get().currentUser;
    if (user === null) return;

    userProfile.mutate({ user, nickname });
  }
</script>

<h1 class="mb-4 text-xl font-semibold">
  {$userState.currentUser?.displayName ?? "User"}'s profile settings
</h1>
<form class="w-full max-w-100 space-y-4" onsubmit={handleSubmit}>
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
