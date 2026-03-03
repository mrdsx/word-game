<script lang="ts">
  import { auth } from "$lib/firebase";
  import { navigate } from "$lib/router";
  import { signOut } from "firebase/auth";
  import { HouseIcon, LogOutIcon, UserIcon } from "lucide-svelte";
  import { userState } from "../../store/userState";
  import { Button, buttonVariants } from "./ui/button";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "./ui/dropdown-menu";

  async function handleLogout(): Promise<void> {
    await signOut(auth);
    await navigate("/");
  }
</script>

{#if $userState.currentUser === null}
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
        <DropdownMenuItem onclick={() => navigate("/profile")}>
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
