<script lang="ts">
  import { localWordGamePreferences } from "$features/local-word-game/stores";
  import {
    NativeSelect,
    NativeSelectOption,
  } from "$lib/components/ui/native-select";
</script>

<NativeSelect bind:value={$localWordGamePreferences.answeringTime}>
  <NativeSelectOption value={0}>-</NativeSelectOption>
  <NativeSelectOption value={3}>3</NativeSelectOption>
  <NativeSelectOption value={5}>5</NativeSelectOption>
  <NativeSelectOption value={10}>10</NativeSelectOption>
  <NativeSelectOption value={15}>15</NativeSelectOption>
</NativeSelect>
