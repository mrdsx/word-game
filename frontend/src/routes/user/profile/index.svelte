<script lang="ts">
  import { authState } from "$features/auth/stores";
  import {
    DeleteAccountForm,
    UserNicknameForm,
  } from "$features/user/components";
</script>

<h1 class="mb-4 text-xl font-semibold">
  {$authState.currentUser?.displayName ?? "User"}'s profile settings
</h1>
<UserNicknameForm />
<DeleteAccountForm />
