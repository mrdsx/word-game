<script lang="ts">
  import type { Word } from "../types";

  type WordGameInfoProps = {
    words: readonly Word[];
    mistakes: number;
    maxMistakes: number;
  };

  let { words, mistakes, maxMistakes }: WordGameInfoProps = $props();
</script>

<div class="flex w-full justify-between text-sm font-semibold">
  <p>
    Words: {words.length}
  </p>
  <p class="text-destructive">
    Mistakes: {mistakes}/{maxMistakes}
  </p>
</div>
