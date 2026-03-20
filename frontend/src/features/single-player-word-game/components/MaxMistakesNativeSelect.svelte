<script lang="ts">
  import { authState } from "$features/auth/stores";
  import {
    NativeSelect,
    NativeSelectOption,
  } from "$lib/components/ui/native-select";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { mapFirebaseErrorCode } from "$lib/firebase";
  import { createMutation, createQuery } from "@tanstack/svelte-query";
  import type { FirebaseError } from "firebase/app";
  import { toast } from "svelte-sonner";
  import { updateMaxMistakesMutationOptions } from "../mutationOptions";
  import { singlePlayerWordGamePreferencesQueryOptions } from "../queryOptions";

  type MaxMistakesNativeSelectProps = {
    maxMistakesSelectRef: HTMLSelectElement | null;
  };

  let { maxMistakesSelectRef = $bindable(null) }: MaxMistakesNativeSelectProps =
    $props();

  const wordGamePreferencesQuery = createQuery(() => ({
    ...singlePlayerWordGamePreferencesQueryOptions,
    enabled: $authState.currentUser !== null,
  }));

  const userUID = $derived($authState.currentUser?.uid);
  const defaultMaxMistakes = $derived(
    wordGamePreferencesQuery.data?.maxMistakes ?? 5,
  );

  const updateMaxMistakesMutation = createMutation(() => ({
    ...updateMaxMistakesMutationOptions,
    onError: (error: FirebaseError) => {
      const message = mapFirebaseErrorCode(error.code);
      toast.error(message ?? "Failed to update max mistakes.");
      if (maxMistakesSelectRef !== null) {
        maxMistakesSelectRef.value = String(defaultMaxMistakes);
      }
    },
  }));

  $effect(() => {
    if (maxMistakesSelectRef !== null) {
      maxMistakesSelectRef.value = String(defaultMaxMistakes);
    }
  });

  async function handleUpdateMaxMistakes(
    event: Event & {
      currentTarget: EventTarget & HTMLSelectElement;
    },
  ): Promise<void> {
    const maxMistakes = Number(event.currentTarget.value);
    if (userUID === undefined || isNaN(maxMistakes)) return;
    updateMaxMistakesMutation.mutate({ maxMistakes, userUID });
  }
</script>

{#if wordGamePreferencesQuery.isPending}
  <Skeleton class="h-9 w-14.5" />
{:else}
  <NativeSelect
    value={defaultMaxMistakes}
    disabled={wordGamePreferencesQuery.isPending}
    onchange={handleUpdateMaxMistakes}
    bind:ref={maxMistakesSelectRef}
  >
    <NativeSelectOption value={1}>1</NativeSelectOption>
    <NativeSelectOption value={2}>2</NativeSelectOption>
    <NativeSelectOption value={3}>3</NativeSelectOption>
    <NativeSelectOption value={4}>4</NativeSelectOption>
    <NativeSelectOption value={5}>5</NativeSelectOption>
  </NativeSelect>
{/if}
