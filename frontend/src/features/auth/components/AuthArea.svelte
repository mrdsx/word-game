<script lang="ts">
  import { authState } from "$features/auth/stores";
  import { localWordGame } from "$features/local-word-game/stores";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "$lib/components/ui/dropdown-menu";
  import { auth } from "$lib/firebase";
  import { navigate } from "$lib/router";
  import { HouseIcon, LogOutIcon, UserIcon } from "@lucide/svelte";
  import { signOut } from "firebase/auth";

  async function handleLogout(): Promise<void> {
    localWordGame.set({ ...localWordGame.get(), isPlaying: false });
    await signOut(auth);
    await navigate("/");
  }
</script>

{#if $authState.currentUser === null}
  <Button variant="outline" href="/login">Log In</Button>
{:else}
  <DropdownMenu>
    <DropdownMenuTrigger
      class={buttonVariants({
        variant: "outline",
      })}
    >
      <UserIcon />
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-50" align="end">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuGroup>
        <DropdownMenuItem onclick={() => navigate("/")}>
          <HouseIcon />
          Home
        </DropdownMenuItem>
        <DropdownMenuItem onclick={() => navigate("/user/profile")}>
          <UserIcon />
          Profile
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive" onclick={handleLogout}>
        <LogOutIcon />
        Log Out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
{/if}
